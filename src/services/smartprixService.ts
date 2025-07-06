import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SmartprixPhone {
  id: string;
  name: string;
  brand: string;
  image: string;
  price?: number;
  specifications: {
    display?: string;
    camera?: string;
    battery?: string;
    storage?: string;
    ram?: string;
    processor?: string;
    os?: string;
    [key: string]: string | undefined;
  };
  features: string[];
  releaseDate?: string;
  colors?: string[];
  availability: boolean;
  url: string;
}

export interface SmartprixImportResult {
  success: boolean;
  phones: SmartprixPhone[];
  errors?: string[];
}

class SmartprixService {
  private baseUrl = 'https://www.smartprix.com';
  private cache = new Map<string, any>();
  private cacheTimeout = 1000 * 60 * 30; // 30 minutes
  
  // Scrape phone data from Smartprix URL
  async scrapePhoneFromUrl(url: string): Promise<SmartprixImportResult> {
    try {
      // Check if URL is valid
      if (!url.includes('smartprix.com') && !url.includes('smartprix.com/mobiles/')) {
        return {
          success: false,
          phones: [],
          errors: ['Invalid Smartprix URL. Please provide a valid phone model URL from smartprix.com']
        };
      }
      
      // Fetch the page content
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract phone data
      const name = $('.product-title h1').text().trim();
      const brand = this.extractBrand(name);
      const image = $('.product-image img').attr('src') || '';
      
      // Extract price
      let price: number | undefined;
      const priceText = $('.price').text().trim();
      if (priceText) {
        // Convert Indian Rupees to KWD (approximate conversion)
        const priceInRupees = parseFloat(priceText.replace(/[₹,]/g, ''));
        price = this.convertToKWD(priceInRupees);
      }
      
      // Extract specifications
      const specifications: Record<string, string> = {};
      $('.specs-table tr').each((i, el) => {
        const key = $(el).find('td:first-child').text().trim();
        const value = $(el).find('td:last-child').text().trim();
        if (key && value) {
          specifications[this.normalizeSpecKey(key)] = value;
        }
      });
      
      // Extract features
      const features: string[] = [];
      $('.highlights li').each((i, el) => {
        const feature = $(el).text().trim();
        if (feature) {
          features.push(feature);
        }
      });
      
      // Extract colors
      const colors: string[] = [];
      $('.variant-list.color-list li').each((i, el) => {
        const color = $(el).attr('data-name');
        if (color) {
          colors.push(color);
        }
      });
      
      // Extract release date
      const releaseDate = specifications['releaseDate'] || specifications['launchDate'] || undefined;
      
      // Create phone object
      const phone: SmartprixPhone = {
        id: this.generateId(name),
        name,
        brand,
        image,
        price,
        specifications: {
          display: specifications['display'],
          camera: specifications['camera'] || specifications['rearCamera'],
          battery: specifications['battery'],
          storage: specifications['storage'] || specifications['internalStorage'],
          ram: specifications['ram'],
          processor: specifications['processor'] || specifications['chipset'],
          os: specifications['os'] || specifications['operatingSystem'],
          ...specifications
        },
        features,
        releaseDate,
        colors,
        availability: true,
        url
      };
      
      return {
        success: true,
        phones: [phone]
      };
    } catch (error) {
      console.error('Error scraping phone from Smartprix:', error);
      return {
        success: false,
        phones: [],
        errors: [(error as Error).message]
      };
    }
  }
  
  // Scrape multiple phones from brand page
  async scrapePhonesByBrand(brand: string, limit: number = 10): Promise<SmartprixImportResult> {
    try {
      const url = `${this.baseUrl}/mobiles/${brand.toLowerCase()}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      const phones: SmartprixPhone[] = [];
      const errors: string[] = [];
      
      // Find phone cards
      const phoneCards = $('.listview .list-item');
      
      // Limit the number of phones to scrape
      const phonesToScrape = Math.min(limit, phoneCards.length);
      
      for (let i = 0; i < phonesToScrape; i++) {
        try {
          const card = $(phoneCards[i]);
          const name = card.find('.name').text().trim();
          const phoneUrl = this.baseUrl + card.find('a').attr('href');
          const image = card.find('img').attr('src') || '';
          
          // Extract price
          let price: number | undefined;
          const priceText = card.find('.price').text().trim();
          if (priceText) {
            const priceInRupees = parseFloat(priceText.replace(/[₹,]/g, ''));
            price = this.convertToKWD(priceInRupees);
          }
          
          // Extract basic specs
          const specs: Record<string, string> = {};
          card.find('.specs li').each((i, el) => {
            const specText = $(el).text().trim();
            if (specText.includes(':')) {
              const [key, value] = specText.split(':').map(s => s.trim());
              specs[this.normalizeSpecKey(key)] = value;
            }
          });
          
          const phone: SmartprixPhone = {
            id: this.generateId(name),
            name,
            brand: this.extractBrand(name) || brand,
            image,
            price,
            specifications: {
              display: specs['display'],
              camera: specs['camera'] || specs['rearCamera'],
              battery: specs['battery'],
              storage: specs['storage'] || specs['internalStorage'],
              ram: specs['ram'],
              processor: specs['processor'] || specs['chipset'],
              os: specs['os'] || specs['operatingSystem'],
              ...specs
            },
            features: [],
            availability: true,
            url: phoneUrl
          };
          
          phones.push(phone);
        } catch (error) {
          errors.push(`Error scraping phone ${i + 1}: ${(error as Error).message}`);
        }
      }
      
      return {
        success: phones.length > 0,
        phones,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error scraping phones by brand:', error);
      return {
        success: false,
        phones: [],
        errors: [(error as Error).message]
      };
    }
  }
  
  // Parse CSV/Excel file with phone data
  async parsePhoneFile(file: File): Promise<SmartprixImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (!result) {
            resolve({
              success: false,
              phones: [],
              errors: ['Failed to read file']
            });
            return;
          }
          
          // Check file extension
          const extension = file.name.split('.').pop()?.toLowerCase();
          
          let phones: SmartprixPhone[] = [];
          
          if (extension === 'csv') {
            // Parse CSV
            const papa = await import('papaparse');
            const parsed = papa.parse(result as string, { header: true });
            
            if (parsed.data && Array.isArray(parsed.data)) {
              phones = parsed.data.map((row: any) => this.mapRowToPhone(row));
            }
          } else if (extension === 'xlsx' || extension === 'xls') {
            // Parse Excel
            const xlsx = await import('xlsx');
            const workbook = xlsx.read(result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            
            phones = data.map((row: any) => this.mapRowToPhone(row));
          } else {
            resolve({
              success: false,
              phones: [],
              errors: ['Unsupported file format. Please upload CSV or Excel file.']
            });
            return;
          }
          
          resolve({
            success: true,
            phones
          });
        } catch (error) {
          console.error('Error parsing phone file:', error);
          resolve({
            success: false,
            phones: [],
            errors: [(error as Error).message]
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          phones: [],
          errors: ['Error reading file']
        });
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  }
  
  // Helper methods
  private generateId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  
  private extractBrand(name: string): string {
    const commonBrands = [
      'Apple', 'Samsung', 'Xiaomi', 'Redmi', 'OnePlus', 'Oppo', 'Vivo', 'Realme', 
      'Poco', 'Google', 'Motorola', 'Nokia', 'Sony', 'Huawei', 'Honor', 'Asus',
      'Lenovo', 'LG', 'Micromax', 'Infinix', 'Tecno', 'iQOO', 'Nothing'
    ];
    
    for (const brand of commonBrands) {
      if (name.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    
    // If no brand found, return first word
    return name.split(' ')[0];
  }
  
  private normalizeSpecKey(key: string): string {
    // Convert keys like "Display Size" to "displaySize"
    const normalized = key.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase());
    
    return normalized;
  }
  
  private convertToKWD(rupees: number): number {
    // Approximate conversion rate: 1 INR = 0.004 KWD
    const conversionRate = 0.004;
    return parseFloat((rupees * conversionRate).toFixed(3));
  }
  
  private mapRowToPhone(row: any): SmartprixPhone {
    // Map CSV/Excel row to phone object
    const specifications: Record<string, string> = {};
    
    // Extract specifications from row
    Object.keys(row).forEach(key => {
      if (!['id', 'name', 'brand', 'image', 'price', 'features', 'releaseDate', 'colors', 'availability', 'url'].includes(key)) {
        specifications[this.normalizeSpecKey(key)] = row[key];
      }
    });
    
    return {
      id: row.id || this.generateId(row.name),
      name: row.name,
      brand: row.brand || this.extractBrand(row.name),
      image: row.image || '',
      price: row.price ? parseFloat(row.price) : undefined,
      specifications: {
        display: row.display || specifications.display,
        camera: row.camera || specifications.camera,
        battery: row.battery || specifications.battery,
        storage: row.storage || specifications.storage,
        ram: row.ram || specifications.ram,
        processor: row.processor || specifications.processor,
        os: row.os || specifications.os,
        ...specifications
      },
      features: row.features ? row.features.split(',').map((f: string) => f.trim()) : [],
      releaseDate: row.releaseDate,
      colors: row.colors ? row.colors.split(',').map((c: string) => c.trim()) : [],
      availability: row.availability === 'true' || row.availability === true || row.availability === 1,
      url: row.url || ''
    };
  }
  
  // Get sample CSV template
  getSampleCSVTemplate(): string {
    return `name,brand,price,display,camera,battery,storage,ram,processor,os,features,releaseDate,colors,availability,url
iPhone 15 Pro,Apple,399.500,6.1" Super Retina XDR,48MP Triple Camera,3274 mAh,128GB/256GB/512GB/1TB,8GB,A17 Pro,iOS 17,"Face ID,5G,Wireless Charging,Water Resistant",2023-09-22,"Silver,Black,Gold",true,https://www.smartprix.com/mobiles/apple-iphone-15-pro-ppd1f9iuxeqn
Samsung Galaxy S24 Ultra,Samsung,459.900,6.8" Dynamic AMOLED 2X,200MP Quad Camera,5000 mAh,256GB/512GB/1TB,12GB,Snapdragon 8 Gen 3,Android 14,"S Pen,5G,Wireless Charging,Water Resistant",2024-01-17,"Black,Gray,Violet",true,https://www.smartprix.com/mobiles/samsung-galaxy-s24-ultra-ppd1vz7wlcvs`;
  }
  
  // Get sample Excel template
  async getSampleExcelTemplate(): Promise<Blob> {
    const xlsx = await import('xlsx');
    const data = [
      {
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        price: '399.500',
        display: '6.1" Super Retina XDR',
        camera: '48MP Triple Camera',
        battery: '3274 mAh',
        storage: '128GB/256GB/512GB/1TB',
        ram: '8GB',
        processor: 'A17 Pro',
        os: 'iOS 17',
        features: 'Face ID,5G,Wireless Charging,Water Resistant',
        releaseDate: '2023-09-22',
        colors: 'Silver,Black,Gold',
        availability: 'true',
        url: 'https://www.smartprix.com/mobiles/apple-iphone-15-pro-ppd1f9iuxeqn'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        price: '459.900',
        display: '6.8" Dynamic AMOLED 2X',
        camera: '200MP Quad Camera',
        battery: '5000 mAh',
        storage: '256GB/512GB/1TB',
        ram: '12GB',
        processor: 'Snapdragon 8 Gen 3',
        os: 'Android 14',
        features: 'S Pen,5G,Wireless Charging,Water Resistant',
        releaseDate: '2024-01-17',
        colors: 'Black,Gray,Violet',
        availability: 'true',
        url: 'https://www.smartprix.com/mobiles/samsung-galaxy-s24-ultra-ppd1vz7wlcvs'
      }
    ];
    
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Phones');
    
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

export const smartprixService = new SmartprixService();
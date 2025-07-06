import axios from 'axios';

export interface PhoneModel {
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
  };
  features: string[];
  releaseDate?: string;
  availability: boolean;
}

export interface PhoneModelResponse {
  phones: PhoneModel[];
  total: number;
  page: number;
  hasMore: boolean;
}

class PhoneModelService {
  private baseUrl = '/gsmarena-api/api';
  private fallbackBrands = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OnePlus', 'Google', 'Sony', 'LG', 'Nokia', 'Oppo', 'Vivo'];
  
  // Get all brands
  async getBrands(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/brands`);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return this.fallbackBrands;
    }
  }
  
  // Get phones by brand
  async getPhonesByBrand(brand: string, page = 1): Promise<PhoneModelResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/brands/${brand}?page=${page}`);
      return {
        phones: this.transformPhones(response.data),
        total: response.data.length,
        page,
        hasMore: response.data.length === 20 // Assuming 20 per page
      };
    } catch (error) {
      console.error(`Error fetching phones for brand ${brand}:`, error);
      return this.getFallbackPhones(brand);
    }
  }
  
  // Get phone details
  async getPhoneDetails(phoneId: string): Promise<PhoneModel | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/phones/${phoneId}`);
      return this.transformPhone(response.data);
    } catch (error) {
      console.error(`Error fetching phone details for ${phoneId}:`, error);
      return null;
    }
  }
  
  // Search phones
  async searchPhones(query: string): Promise<PhoneModel[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
      return this.transformPhones(response.data);
    } catch (error) {
      console.error(`Error searching phones with query ${query}:`, error);
      return [];
    }
  }
  
  // Helper methods
  private transformPhones(apiPhones: any[]): PhoneModel[] {
    return apiPhones.map(phone => this.transformPhone(phone));
  }
  
  private transformPhone(apiPhone: any): PhoneModel {
    return {
      id: apiPhone.slug || apiPhone.id || apiPhone.phone_name?.replace(/\s+/g, '-').toLowerCase(),
      name: apiPhone.phone_name || apiPhone.name || apiPhone.title,
      brand: apiPhone.brand || this.extractBrand(apiPhone.phone_name || apiPhone.name || apiPhone.title),
      image: apiPhone.image || apiPhone.phone_image || apiPhone.thumbnail || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
      specifications: {
        display: apiPhone.display || apiPhone.specifications?.display,
        camera: apiPhone.camera || apiPhone.specifications?.camera,
        battery: apiPhone.battery || apiPhone.specifications?.battery,
        storage: apiPhone.storage || apiPhone.specifications?.storage,
        ram: apiPhone.ram || apiPhone.specifications?.ram,
        processor: apiPhone.processor || apiPhone.specifications?.processor,
        os: apiPhone.os || apiPhone.specifications?.os
      },
      features: apiPhone.features || [],
      releaseDate: apiPhone.release_date || apiPhone.releaseDate,
      availability: true
    };
  }
  
  private extractBrand(phoneName: string = ''): string {
    for (const brand of this.fallbackBrands) {
      if (phoneName.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    return 'Unknown';
  }
  
  private getFallbackPhones(brand: string): PhoneModelResponse {
    const fallbackPhones: PhoneModel[] = [
      {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        specifications: {
          display: '6.1" Super Retina XDR',
          camera: '48MP Triple Camera',
          battery: '3274 mAh',
          storage: '128GB/256GB/512GB/1TB',
          ram: '8GB',
          processor: 'A17 Pro',
          os: 'iOS 17'
        },
        features: ['Face ID', '5G', 'Wireless Charging', 'Water Resistant'],
        availability: true
      },
      {
        id: 'samsung-galaxy-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        image: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg',
        specifications: {
          display: '6.8" Dynamic AMOLED 2X',
          camera: '200MP Quad Camera',
          battery: '5000 mAh',
          storage: '256GB/512GB/1TB',
          ram: '12GB',
          processor: 'Snapdragon 8 Gen 3',
          os: 'Android 14'
        },
        features: ['S Pen', '5G', 'Wireless Charging', 'Water Resistant'],
        availability: true
      }
    ];

    return {
      phones: fallbackPhones.filter(p => p.brand.toLowerCase() === brand.toLowerCase()),
      total: fallbackPhones.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length,
      page: 1,
      hasMore: false
    };
  }
}

export const phoneModelService = new PhoneModelService();
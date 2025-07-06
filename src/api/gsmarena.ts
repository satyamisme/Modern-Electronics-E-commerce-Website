// GSMArena API Integration for Phone Models
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

export interface GSMArenaResponse {
  phones: PhoneModel[];
  total: number;
  page: number;
  hasMore: boolean;
}

class GSMArenaAPI {
  private baseURL = 'https://gsmarena-api.herokuapp.com';
  private cache = new Map<string, any>();
  private cacheTimeout = 1000 * 60 * 30; // 30 minutes

  // Get all brands
  async getBrands(): Promise<string[]> {
    const cacheKey = 'brands';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/brands`);
      const brands = await response.json();
      
      this.cache.set(cacheKey, brands);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return this.getFallbackBrands();
    }
  }

  // Get phones by brand
  async getPhonesByBrand(brand: string, page = 1): Promise<GSMArenaResponse> {
    const cacheKey = `phones-${brand}-${page}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/${brand}?page=${page}`);
      const data = await response.json();
      
      const result: GSMArenaResponse = {
        phones: data.map(this.transformPhone),
        total: data.length,
        page,
        hasMore: data.length === 20 // Assuming 20 per page
      };
      
      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return result;
    } catch (error) {
      console.error('Error fetching phones:', error);
      return this.getFallbackPhones(brand);
    }
  }

  // Get phone details
  async getPhoneDetails(phoneId: string): Promise<PhoneModel | null> {
    const cacheKey = `phone-${phoneId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/phone/${phoneId}`);
      const data = await response.json();
      
      const phone = this.transformPhoneDetails(data);
      
      this.cache.set(cacheKey, phone);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return phone;
    } catch (error) {
      console.error('Error fetching phone details:', error);
      return null;
    }
  }

  // Search phones
  async searchPhones(query: string): Promise<PhoneModel[]> {
    const cacheKey = `search-${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseURL}/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      const phones = data.map(this.transformPhone);
      
      this.cache.set(cacheKey, phones);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return phones;
    } catch (error) {
      console.error('Error searching phones:', error);
      return [];
    }
  }

  // Transform API response to our format
  private transformPhone(apiPhone: any): PhoneModel {
    return {
      id: apiPhone.id || apiPhone.phone_name?.replace(/\s+/g, '-').toLowerCase(),
      name: apiPhone.phone_name || apiPhone.name,
      brand: apiPhone.brand || this.extractBrand(apiPhone.phone_name),
      image: apiPhone.image || apiPhone.phone_image || '/placeholder-phone.jpg',
      specifications: {
        display: apiPhone.display,
        camera: apiPhone.camera,
        battery: apiPhone.battery,
        storage: apiPhone.storage,
        ram: apiPhone.ram,
        processor: apiPhone.processor,
        os: apiPhone.os
      },
      features: apiPhone.features || [],
      releaseDate: apiPhone.release_date,
      availability: true
    };
  }

  private transformPhoneDetails(apiPhone: any): PhoneModel {
    return {
      id: apiPhone.id,
      name: apiPhone.phone_name,
      brand: apiPhone.brand,
      image: apiPhone.phone_image,
      specifications: {
        display: apiPhone.specifications?.display,
        camera: apiPhone.specifications?.camera,
        battery: apiPhone.specifications?.battery,
        storage: apiPhone.specifications?.storage,
        ram: apiPhone.specifications?.ram,
        processor: apiPhone.specifications?.processor,
        os: apiPhone.specifications?.os
      },
      features: apiPhone.features || [],
      releaseDate: apiPhone.release_date,
      availability: true
    };
  }

  private extractBrand(phoneName: string): string {
    const brands = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OnePlus', 'Google', 'Sony', 'LG', 'Nokia', 'Oppo', 'Vivo'];
    for (const brand of brands) {
      if (phoneName.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    return 'Unknown';
  }

  private getFallbackBrands(): string[] {
    return ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OnePlus', 'Google', 'Sony', 'LG', 'Nokia', 'Oppo', 'Vivo'];
  }

  private getFallbackPhones(brand: string): GSMArenaResponse {
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
      }
    ];

    return {
      phones: fallbackPhones.filter(p => p.brand.toLowerCase() === brand.toLowerCase()),
      total: 1,
      page: 1,
      hasMore: false
    };
  }
}

export const gsmarenaAPI = new GSMArenaAPI();
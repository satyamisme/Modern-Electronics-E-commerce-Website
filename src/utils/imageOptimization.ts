// Image optimization utilities for large images

export interface ImageConfig {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

export class ImageOptimizer {
  private config: ImageConfig;

  constructor(config: ImageConfig) {
    this.config = config;
  }

  // Upload large image to Cloudinary
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  // Generate optimized image URL
  optimizeImage(url: string, options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}): string {
    if (!url.includes('cloudinary.com')) return url;

    const { width = 800, height = 600, quality = 'auto', format = 'auto' } = options;
    
    const transformations = [
      `w_${width}`,
      `h_${height}`,
      'c_fill',
      `q_${quality}`,
      `f_${format}`
    ].join(',');

    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  // Generate responsive image URLs
  generateResponsiveUrls(url: string): Record<string, string> {
    return {
      thumbnail: this.optimizeImage(url, { width: 150, height: 150 }),
      small: this.optimizeImage(url, { width: 400, height: 300 }),
      medium: this.optimizeImage(url, { width: 800, height: 600 }),
      large: this.optimizeImage(url, { width: 1200, height: 900 }),
      original: url
    };
  }
}

// Default configuration
export const imageOptimizer = new ImageOptimizer({
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned'
});

// Alternative: ImgBB uploader for simple use
export class ImgBBUploader {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('ImgBB upload failed:', error);
      throw error;
    }
  }
}

export const imgbbUploader = new ImgBBUploader(
  import.meta.env.VITE_IMGBB_API_KEY || ''
);
// SEO Utilities for LAKKI PHONES
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export class SEOManager {
  private static instance: SEOManager;
  private baseURL = 'https://lakkiphones.com';
  private siteName = 'LAKKI PHONES';
  private defaultImage = '/og-image.jpg';

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  // Set page SEO
  setPageSEO(config: SEOConfig): void {
    this.setTitle(config.title);
    this.setDescription(config.description);
    this.setKeywords(config.keywords);
    this.setOpenGraph(config);
    this.setTwitterCard(config);
    this.setCanonical(config.url);
    this.setStructuredData(config);
  }

  // Set page title
  private setTitle(title: string): void {
    document.title = `${title} | ${this.siteName}`;
    this.setMetaTag('og:title', title);
    this.setMetaTag('twitter:title', title);
  }

  // Set meta description
  private setDescription(description: string): void {
    this.setMetaTag('description', description);
    this.setMetaTag('og:description', description);
    this.setMetaTag('twitter:description', description);
  }

  // Set keywords
  private setKeywords(keywords: string[]): void {
    this.setMetaTag('keywords', keywords.join(', '));
  }

  // Set Open Graph tags
  private setOpenGraph(config: SEOConfig): void {
    this.setMetaTag('og:site_name', this.siteName);
    this.setMetaTag('og:type', config.type || 'website');
    this.setMetaTag('og:url', config.url || window.location.href);
    this.setMetaTag('og:image', config.image || this.defaultImage);
    this.setMetaTag('og:locale', 'ar_KW');
    this.setMetaTag('og:locale:alternate', 'en_US');
  }

  // Set Twitter Card tags
  private setTwitterCard(config: SEOConfig): void {
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:site', '@lakkiphones');
    this.setMetaTag('twitter:creator', '@lakkiphones');
    this.setMetaTag('twitter:image', config.image || this.defaultImage);
  }

  // Set canonical URL
  private setCanonical(url?: string): void {
    const canonical = url || window.location.href;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    link.href = canonical;
  }

  // Set structured data
  private setStructuredData(config: SEOConfig): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      url: this.baseURL,
      logo: `${this.baseURL}/logo.png`,
      description: config.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Muscat street, opp gulf bank',
        addressLocality: 'Khaitan',
        addressRegion: 'Al Asimah',
        postalCode: '83000',
        addressCountry: 'KW'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+965-50430606',
        contactType: 'customer service',
        availableLanguage: ['Arabic', 'English']
      },
      sameAs: [
        'https://linktr.ee/lakkiphones',
        'https://instagram.com/lakkiphones',
        'https://facebook.com/lakkiphones'
      ]
    };

    this.setJSONLD(structuredData);
  }

  // Set JSON-LD structured data
  private setJSONLD(data: any): void {
    let script = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  }

  // Set meta tag
  private setMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }

  // Generate sitemap
  generateSitemap(): string {
    const urls = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/products', priority: '0.9', changefreq: 'daily' },
      { loc: '/categories', priority: '0.8', changefreq: 'weekly' },
      { loc: '/deals', priority: '0.8', changefreq: 'daily' },
      { loc: '/support', priority: '0.6', changefreq: 'monthly' },
      { loc: '/models', priority: '0.9', changefreq: 'daily' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${this.baseURL}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseURL}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /temp/
Disallow: /backup/

# Allow important pages
Allow: /products
Allow: /categories
Allow: /models
Allow: /deals
Allow: /support`;
  }
}

export const seoManager = SEOManager.getInstance();

// SEO Hook for React components
export const useSEO = (config: SEOConfig) => {
  React.useEffect(() => {
    seoManager.setPageSEO(config);
  }, [config]);
};

import { Product, Category } from '../types';

const WC_BASE_URL = "https://malumiere.ma/wp-json/wc/v3";
const CONSUMER_KEY = "ck_ceb74c57429fdffa549b7457a735fda705a82f46";
const CONSUMER_SECRET = "cs_2944d040a30ee3ed5056890f5a14e20f022eaa13";

// Helper to strip HTML tags from description
const stripHtml = (html: string) => {
   if (typeof document === 'undefined' || !html) return "";
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

// Strategy pattern for fetching to handle CORS and Server errors
const fetchSafe = async (targetUrl: string): Promise<any> => {
    // List of strategies to try in order
    const strategies = [
        // Strategy 1: Direct Fetch (Try first, sometimes CORS is configured)
        {
            name: 'Direct',
            fetch: async (url: string) => {
                const res = await fetch(url, { 
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            }
        },
        // Strategy 2: CORS Proxy IO
        {
            name: 'CORS Proxy',
            fetch: async (url: string) => {
                const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.text();
            }
        },
        // Strategy 3: AllOrigins
        {
            name: 'AllOrigins',
            fetch: async (url: string) => {
                const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const text = await res.text();
                const json = JSON.parse(text);
                if (!json.contents) throw new Error('No content returned from proxy');
                return typeof json.contents === 'string' ? json.contents : JSON.stringify(json.contents);
            }
        }
    ];

    let lastError;

    for (const strategy of strategies) {
        try {
            const rawText = await strategy.fetch(targetUrl);
            const trimmedText = rawText.trim();
            
            // Check if response is HTML (Error page)
            if (trimmedText.startsWith('<') || trimmedText.toLowerCase().includes('<!doctype html>')) {
                throw new Error(`Received HTML instead of JSON (likely 403/500 error page via ${strategy.name})`);
            }

            let data;
            try {
                data = JSON.parse(trimmedText);
            } catch (e) {
                throw new Error("Failed to parse JSON response");
            }

            // Check for WooCommerce specific API errors in JSON format
            if (data && data.code && data.message) {
                throw new Error(`WooCommerce API Error: ${data.message}`);
            }

            return data;
        } catch (error: any) {
            // console.warn(`[API] Strategy '${strategy.name}' failed:`, error.message);
            lastError = error;
            // Continue to loop to next strategy
        }
    }
    
    // If all strategies fail, throw the last error
    throw lastError || new Error("All fetch strategies failed");
}

export const fetchWooProducts = async (page: number = 1, search: string = ''): Promise<Product[]> => {
  try {
    const url = new URL(`${WC_BASE_URL}/products`);
    url.searchParams.append("consumer_key", CONSUMER_KEY);
    url.searchParams.append("consumer_secret", CONSUMER_SECRET);
    url.searchParams.append("per_page", "10"); 
    url.searchParams.append("page", page.toString());
    url.searchParams.append("status", "publish");
    
    if (search) {
        url.searchParams.append("search", search);
    }

    const data = await fetchSafe(url.toString());

    if (!Array.isArray(data)) {
        // console.warn("API returned non-array data, switching to mock.", data);
        return [];
    }

    return data.map((item: any) => {
      // Robust number parsing
      const price = parseFloat(item.price) || 0;
      const regularPrice = parseFloat(item.regular_price) || 0;
      
      // Handle image structure from Standard WC API
      let imageUrl = "https://via.placeholder.com/400?text=No+Image";
      let gallery: string[] = [];

      if (item.images && item.images.length > 0) {
          imageUrl = item.images[0].src;
          gallery = item.images.map((img: any) => img.src);
      }

      return {
        id: item.id,
        title: item.name,
        price: price,
        originalPrice: regularPrice > price ? regularPrice : undefined,
        description: stripHtml(item.short_description || item.description || ""),
        category: item.categories && item.categories.length > 0 ? item.categories[0].name : "Uncategorized",
        image: imageUrl,
        images: gallery,
        rating: {
          rate: parseFloat(item.average_rating) || 0,
          count: parseInt(item.rating_count) || 0
        }
      };
    });
  } catch (error) {
    // Return empty array to allow App.tsx to fallback to MOCK_PRODUCTS without crashing
    console.warn("WooCommerce API unavailable, using local mock data.");
    return []; 
  }
};

export const fetchWooCategories = async (): Promise<Category[]> => {
  try {
    const url = new URL(`${WC_BASE_URL}/products/categories`);
    url.searchParams.append("consumer_key", CONSUMER_KEY);
    url.searchParams.append("consumer_secret", CONSUMER_SECRET);
    url.searchParams.append("per_page", "20");
    url.searchParams.append("hide_empty", "true");

    const data = await fetchSafe(url.toString());

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      // Use a deterministic random image from picsum as fallback if no image is provided
      image: item.image ? item.image.src : `https://picsum.photos/seed/${item.id}/400/400`,
      description: item.description,
      productCount: item.count
    }));
  } catch (error) {
    // Return empty array to allow App.tsx to fallback to MOCK_CATEGORIES
    return []; 
  }
};

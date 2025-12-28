
// Simulated AI Service

const ADJECTIVES = ['Premium', 'High-performance', 'Elegant', 'Durable', 'Exclusive', 'Modern', 'Versatile', 'Eco-friendly', 'Luxurious', 'Compact'];

const DESCRIPTIONS: Record<string, string[]> = {
  Electronics: [
    "Experience cutting-edge technology with this device. Engineered for performance and reliability, it seamlessly integrates into your digital workflow.",
    "Stay connected and productive with this advanced electronic gadget. Features a sleek design, long battery life, and intuitive interface.",
    "Elevate your tech game with this state-of-the-art innovation. Designed for enthusiasts who demand the best in speed and quality."
  ],
  Fashion: [
    "Redefine your style with this timeless piece. Crafted from premium fabrics, it offers superior comfort and a flattering fit for any occasion.",
    "Make a statement with this trendy addition to your wardrobe. Perfect for casual outings or formal events, combining elegance with modern flair.",
    "Discover the perfect blend of comfort and style. This garment is designed to keep you looking sharp while feeling great all day long."
  ],
  "Home & Living": [
    "Transform your living space with this exquisite item. Its modern aesthetic and functional design make it a must-have for any contemporary home.",
    "Add a touch of elegance to your interior. Made with high-quality materials, this piece ensures durability while enhancing your home decor.",
    "Create a cozy atmosphere with this essential home accessory. Designed for everyday use, it brings both style and utility to your living area."
  ],
  Beauty: [
    "Reveal your natural radiance with this premium beauty product. Formulated with nourishing ingredients to rejuvenate and protect.",
    "Indulge in a luxurious self-care routine. This product is designed to enhance your natural beauty and leave you feeling refreshed.",
    "Achieve professional results at home. Gentle on the skin yet effective, it's the perfect addition to your daily regimen."
  ],
  Default: [
    "This premium product offers exceptional quality and value. Designed with the user in mind, it delivers outstanding performance and reliability.",
    "Upgrade your collection with this versatile item. Built to last and styled to impress, it is the perfect choice for discerning customers.",
    "Experience the difference with our signature product. Combining innovation with classic design, it stands out in any category."
  ]
};

const IMAGE_KEYWORDS: Record<string, string[]> = {
  Electronics: ['technology', 'gadget', 'device', 'screen', 'laptop', 'headphones'],
  Fashion: ['fashion', 'clothing', 'model', 'style', 'dress', 'shirt'],
  "Home & Living": ['furniture', 'interior', 'decor', 'sofa', 'kitchen', 'lamp'],
  Beauty: ['cosmetics', 'makeup', 'skincare', 'bottle', 'spa'],
  Default: ['product', 'minimalist', 'object', 'design']
};

export const generateAiDescription = async (title: string, category: string, keywords: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categoryTemplates = DESCRIPTIONS[category] || DESCRIPTIONS['Default'];
      const baseDesc = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      
      let enhancedDesc = `${adj} ${title}: ${baseDesc}`;
      
      if (keywords) {
        enhancedDesc += ` Key features include ${keywords.split(',').join(', ')} and more.`;
      }
      
      resolve(enhancedDesc);
    }, 1500); // Simulate network delay
  });
};

export const generateAiGallery = async (category: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const keywords = IMAGE_KEYWORDS[category] || IMAGE_KEYWORDS['Default'];
      const images = Array(4).fill(null).map((_, i) => {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        // Use unsplash source with random sig to avoid duplicate caching
        return `https://source.unsplash.com/random/800x800/?${keyword}&sig=${Date.now() + i}`;
      });
      
      // Fallback for demo since source.unsplash is sometimes flaky or slow, use picsum
      const reliableImages = Array(4).fill(null).map((_, i) => 
        `https://picsum.photos/seed/${category}${Date.now() + i}/800/800`
      );

      resolve(reliableImages);
    }, 2000);
  });
};

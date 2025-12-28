
import { supabase } from './supabase';
import { Order, User, Product, Category, BannerSlide, MenuItem, Contact, HomePageConfig, FooterConfig } from '../types';

/**
 * DATABASE SERVICE
 */

const logError = (context: string, error: any) => {
  const message = error?.message || error?.details || (typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error));
  console.error(`${context}:`, message);
};

// Local Storage Fallback Keys
const LS_HOME_CONFIG = 'lumina_home_config_fallback';
const LS_FOOTER_CONFIG = 'lumina_footer_config_fallback';

// --- User & Address ---

export const saveUserAddress = async (userId: string, addressData: any) => {
  try {
    const { error } = await supabase
      .from('user_addresses')
      .upsert({ 
        user_id: userId,
        ...addressData,
        is_default: true 
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return true;
  } catch (error) {
    logError("Error saving address", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
       logError("Error fetching profile", error);
    }

    return data ? { address: data } : null;
  } catch (error) {
    logError("Error getting profile", error);
    return null;
  }
};

// --- Products ---

export const fetchProductsFromDB = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      description: p.description,
      category: p.category || 'General', 
      image: p.main_image_url,
      images: p.gallery_images || [],
      rating: { rate: Number(p.rating_rate || 0), count: p.rating_count || 0 },
      ft_url: p.ft_url,
      fi_url: p.fi_url,
      stock: p.stock !== null ? Number(p.stock) : 10
    }));
  } catch (error) {
    logError("Error fetching products", error);
    return [];
  }
};

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const ensureUniqueSlug = async (table: string, baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;
    let exists = true;

    while (exists) {
        const { data, error } = await supabase
            .from(table)
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
             console.error(`Error checking slug uniqueness for ${slug} in ${table}`, error);
             break; 
        }

        if (data) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        } else {
            exists = false;
        }
    }
    return slug;
};

export const addProductToDB = async (product: Omit<Product, 'id'>) => {
  try {
    const baseSlug = generateSlug(product.title);
    const slug = await ensureUniqueSlug('products', baseSlug);

    const { data, error } = await supabase
      .from('products')
      .insert({
        title: product.title,
        slug: slug,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice || null,
        main_image_url: product.image,
        gallery_images: product.images || [],
        category: product.category,
        rating_rate: product.rating?.rate || 0,
        rating_count: product.rating?.count || 0,
        is_active: true,
        ft_url: product.ft_url || null,
        fi_url: product.fi_url || null,
        stock: product.stock !== undefined ? product.stock : 10
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update category product count
    if (product.category) {
        // First try to find category by name
        const { data: catData } = await supabase
            .from('categories')
            .select('id, product_count')
            .eq('name', product.category)
            .maybeSingle();
            
        if (catData) {
            await supabase.from('categories').update({
                product_count: (catData.product_count || 0) + 1
            }).eq('id', catData.id);
        }
    }

    return data;
  } catch (error) {
    logError("Error adding product", error);
    throw error;
  }
};

export const updateProductInDB = async (product: Product) => {
  try {
    // Get old product to check if category changed
    const { data: oldProduct } = await supabase
        .from('products')
        .select('category')
        .eq('id', product.id)
        .single();

    const { error } = await supabase
      .from('products')
      .update({
        title: product.title,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice || null,
        main_image_url: product.image,
        gallery_images: product.images || [],
        category: product.category,
        ft_url: product.ft_url || null,
        fi_url: product.fi_url || null,
        stock: product.stock !== undefined ? product.stock : 10
      })
      .eq('id', product.id);

    if (error) throw error;
    
    // Handle category count updates if category changed
    if (oldProduct && oldProduct.category !== product.category) {
        // Decrement old category count
        if (oldProduct.category) {
             const { data: oldCat } = await supabase
                .from('categories')
                .select('id, product_count')
                .eq('name', oldProduct.category)
                .maybeSingle();
             
             if (oldCat) {
                 await supabase.from('categories').update({
                     product_count: Math.max(0, (oldCat.product_count || 0) - 1)
                 }).eq('id', oldCat.id);
             }
        }
        
        // Increment new category count
        if (product.category) {
             const { data: newCat } = await supabase
                .from('categories')
                .select('id, product_count')
                .eq('name', product.category)
                .maybeSingle();
             
             if (newCat) {
                 await supabase.from('categories').update({
                     product_count: (newCat.product_count || 0) + 1
                 }).eq('id', newCat.id);
             }
        }
    }
    
    return true;
  } catch (error) {
    logError("Error updating product", error);
    throw error;
  }
};

export const deleteProductFromDB = async (productId: number | string) => {
  try {
    // Get product category before deleting
    const { data: product } = await supabase
        .from('products')
        .select('category')
        .eq('id', productId)
        .single();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    
    // Decrement category count
    if (product && product.category) {
         const { data: catData } = await supabase
            .from('categories')
            .select('id, product_count')
            .eq('name', product.category)
            .maybeSingle();
         
         if (catData) {
             await supabase.from('categories').update({
                 product_count: Math.max(0, (catData.product_count || 0) - 1)
             }).eq('id', catData.id);
         }
    }
    
    return true;
  } catch (error) {
    logError("Error deleting product", error);
    throw error;
  }
};

// --- Categories ---

export const fetchCategoriesFromDB = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      slug: c.slug,
      image: c.image_url, 
      description: c.description,
      productCount: c.product_count || 0 
    }));
  } catch (error) {
    logError("Error fetching categories", error);
    return [];
  }
};

export const addCategoryToDB = async (category: Omit<Category, 'id'>) => {
  try {
    const baseSlug = generateSlug(category.name);
    const slug = await ensureUniqueSlug('categories', baseSlug);
    const { error } = await supabase.from('categories').insert({
      name: category.name,
      slug: slug,
      image_url: category.image,
      description: category.description || '',
      product_count: 0
    });
    if (error) throw error;
  } catch (error) {
    logError("Error adding category", error);
    throw error;
  }
};

export const updateCategoryInDB = async (category: Category) => {
  try {
    // 1. Get old category data to handle name changes
    const { data: oldData, error: fetchError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', category.id)
      .single();
      
    if (fetchError) throw fetchError;

    // 2. Update the category
    // We don't update slug to preserve URLs
    const { error } = await supabase.from('categories').update({
      name: category.name,
      image_url: category.image,
      description: category.description || '',
    }).eq('id', category.id);
    if (error) throw error;

    // 3. Propagate name change to products
    if (oldData && oldData.name !== category.name) {
       const { error: productUpdateError } = await supabase
         .from('products')
         .update({ category: category.name })
         .eq('category', oldData.name);
         
       if (productUpdateError) {
         console.error("Failed to propagate category name update to products", productUpdateError);
       }
    }
  } catch (error) {
    logError("Error updating category", error);
    throw error;
  }
};

export const deleteCategoryFromDB = async (id: string | number) => {
  try {
    // 1. Get category name before deleting
    const { data: catData, error: fetchError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete category
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;

    // 3. Update orphaned products to 'General'
    if (catData && catData.name) {
       await supabase
         .from('products')
         .update({ category: 'General' })
         .eq('category', catData.name);
    }
  } catch (error) {
    logError("Error deleting category", error);
    throw error;
  }
};

// --- Banners ---

export const fetchBannersFromDB = async (): Promise<BannerSlide[]> => {
  try {
    const { data, error } = await supabase.from('banners').select('*').order('created_at');
    if (error) throw error;
    return data.map((b: any) => ({
      id: b.id,
      image: b.image_url,
      title: b.title || '',
      subtitle: b.subtitle || '',
      cta: b.cta || '',
      align: (b.align as any) || 'left',
      link: b.link || ''
    }));
  } catch (error) {
    logError("Error fetching banners", error);
    return [];
  }
};

export const addBannerToDB = async (banner: Omit<BannerSlide, 'id'>) => {
  try {
    const { error } = await supabase.from('banners').insert({
      image_url: banner.image,
      title: banner.title || null,
      subtitle: banner.subtitle || null,
      cta: banner.cta || null,
      align: banner.align || 'left',
      link: banner.link || null
    });
    if (error) throw error;
  } catch (error) {
    logError("Error adding banner", error);
    throw error;
  }
};

export const updateBannerInDB = async (banner: BannerSlide) => {
  try {
    const { error } = await supabase.from('banners').update({
      image_url: banner.image,
      title: banner.title || null,
      subtitle: banner.subtitle || null,
      cta: banner.cta || null,
      align: banner.align || 'left',
      link: banner.link || null
    }).eq('id', banner.id);
    if (error) throw error;
  } catch (error) {
    logError("Error updating banner", error);
    throw error;
  }
};

export const deleteBannerFromDB = async (id: number) => {
  try {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    logError("Error deleting banner", error);
    throw error;
  }
};

// --- Page Configuration (Settings Table) ---

const getLocalSettings = <T>(key: string): T | null => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) as T : null;
};

const setLocalSettings = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const fetchHomeConfig = async (): Promise<HomePageConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'home_page_config')
      .maybeSingle();
    
    if (error) {
      if (error.message?.includes('relation "public.settings" does not exist')) {
          return getLocalSettings<HomePageConfig>(LS_HOME_CONFIG);
      }
      throw error;
    }
    
    if (!data) {
        return getLocalSettings<HomePageConfig>(LS_HOME_CONFIG);
    }

    return data.value as HomePageConfig;
  } catch (error) {
    logError("Error fetching home config", error);
    return getLocalSettings<HomePageConfig>(LS_HOME_CONFIG);
  }
};

export const saveHomeConfig = async (config: HomePageConfig) => {
  try {
    setLocalSettings(LS_HOME_CONFIG, config);
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'home_page_config', value: config }, { onConflict: 'key' });
    
    if (error) throw error;
    return true;
  } catch (error) {
    logError("Error saving home config", error);
    return true; 
  }
};

export const fetchFooterConfig = async (): Promise<FooterConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'footer_config')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation "public.settings" does not exist')) {
          return getLocalSettings<FooterConfig>(LS_FOOTER_CONFIG);
      }
      throw error;
    }
    return data.value as FooterConfig;
  } catch (error) {
    logError("Error fetching footer config", error);
    return getLocalSettings<FooterConfig>(LS_FOOTER_CONFIG);
  }
};

export const saveFooterConfig = async (config: FooterConfig) => {
  try {
    setLocalSettings(LS_FOOTER_CONFIG, config);
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'footer_config', value: config }, { onConflict: 'key' });
    
    if (error) throw error;
    return true;
  } catch (error) {
    logError("Error saving footer config", error);
    return true;
  }
};

// --- Menu Items ---

export const fetchMenuItemsFromDB = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return data.map((m: any) => ({
      id: m.id.toString(),
      label: m.label,
      view: m.view_route || 'HOME', 
      icon: m.icon_name || 'Menu', 
      order: m.sort_order,
      isSpecial: m.is_special
    }));
  } catch (error) {
    logError("Error fetching menu items", error);
    return [];
  }
};

export const upsertMenuItemToDB = async (item: MenuItem) => {
  try {
    const payload: any = {
      label: item.label,
      view_route: item.view, 
      icon_name: item.icon, 
      sort_order: item.order,
      is_special: item.isSpecial || false
    };
    
    if (item.id && !item.id.startsWith('menu_')) {
        payload.id = Number(item.id);
    }

    const { error } = await supabase.from('menu_items').upsert(payload);
    if (error) throw error;
  } catch (error) {
    logError("Error upserting menu item", error);
    throw error;
  }
};

export const deleteMenuItemFromDB = async (id: string) => {
  try {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    logError("Error deleting menu item", error);
    throw error;
  }
};

// --- Contacts ---

export const fetchContactsFromDB = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase.from('contacts').select('*');
    if (error) throw error;
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      type: c.type,
      company: c.company,
      ice: c.ice,
      address: c.address,
      status: c.status
    }));
  } catch (error) {
    logError("Error fetching contacts", error);
    return [];
  }
};

export const addContactToDB = async (contact: Omit<Contact, 'id'>) => {
  try {
    const { error } = await supabase.from('contacts').insert({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        company: contact.company || null,
        ice: contact.ice || null, 
        address: contact.address,
        status: contact.status
    });
    if (error) throw error;
  } catch (error) {
    logError("Error adding contact", error);
    throw error;
  }
};

export const updateContactInDB = async (contact: Contact) => {
  try {
    const { error } = await supabase.from('contacts').update({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        company: contact.company || null,
        ice: contact.ice || null, 
        address: contact.address,
        status: contact.status
    }).eq('id', contact.id);
    if (error) throw error;
  } catch (error) {
    logError("Error updating contact", error);
    throw error;
  }
};

export const deleteContactFromDB = async (id: number) => {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    logError("Error deleting contact", error);
    throw error;
  }
};

// --- Orders (Commande) ---

export const createOrder = async (order: Omit<Order, 'id'>) => {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order.customerId !== 'guest' && order.customerId !== 'pos-guest' ? order.customerId : null,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        total_amount: order.total,
        status: order.status,
        shipping_address: order.shippingAddress,
        payment_method: order.paymentMethod
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const itemsToInsert = order.items.map(item => ({
      order_id: orderData.id,
      product_id: typeof item.productId === 'number' ? item.productId : null,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;

    return orderData.id;
  } catch (error) {
    logError("Error creating order", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    logError("Error updating order status", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((o: any) => ({
      id: o.id,
      customerId: o.user_id,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      date: new Date(o.created_at).toLocaleDateString(),
      status: o.status,
      total: Number(o.total_amount),
      shippingAddress: o.shipping_address,
      paymentMethod: o.payment_method,
      items: o.items.map((i: any) => ({
        productId: i.product_id,
        productName: i.product_name,
        quantity: i.quantity,
        price: Number(i.unit_price)
      }))
    })) as Order[];
  } catch (error) {
    logError("Error fetching user orders", error);
    return [];
  }
};

export const getAllOrders = async () => {
    try {
        const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((o: any) => ({
            id: o.id,
            customerId: o.user_id,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            date: new Date(o.created_at).toLocaleDateString(),
            status: o.status,
            total: Number(o.total_amount),
            shippingAddress: o.shipping_address,
            paymentMethod: o.payment_method,
            items: o.items.map((i: any) => ({
                productId: i.product_id,
                productName: i.product_name,
                quantity: i.quantity,
                price: Number(i.unit_price)
            }))
        })) as Order[];
    } catch (error) {
        logError("Error fetching all orders", error);
        return [];
    }
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  getAllOrders().then(callback);
  const channel = supabase
    .channel('public:orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      getAllOrders().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

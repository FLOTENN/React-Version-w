import { supabase } from './supabaseClient';

// ==================== SERVICES ====================
export const getServices = async () => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getAllServices = async () => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getServiceBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) throw error;
    return data;
};

export const getServiceById = async (id) => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const createService = async (service) => {
    const { data, error } = await supabase.from('services').insert([service]).select().single();
    if (error) throw error;
    return data;
};

export const updateService = async (id, service) => {
    const { data, error } = await supabase.from('services').update(service).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteService = async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
};

// ==================== POSTS (Blog) ====================
export const getPublishedPosts = async (limit = null) => {
    let query = supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

export const getAllPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getPostBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) throw error;
    return data;
};

export const getPostById = async (id) => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createPost = async (post) => {
    const { data, error } = await supabase.from('posts').insert([post]).select().single();
    if (error) throw error;
    return data;
};

export const updatePost = async (id, post) => {
    const { data, error } = await supabase.from('posts').update(post).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
};

// ==================== PAGES ====================
export const getPublishedPages = async () => {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getAllPages = async () => {
    const { data, error } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getPageBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
    if (error) throw error;
    return data;
};

export const getPageById = async (id) => {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createPage = async (page) => {
    const { data, error } = await supabase.from('pages').insert([page]).select().single();
    if (error) throw error;
    return data;
};

export const updatePage = async (id, page) => {
    const { data, error } = await supabase.from('pages').update(page).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deletePage = async (id) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) throw error;
};

// ==================== ENQUIRIES ====================
export const getEnquiries = async () => {
    const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getRecentEnquiries = async (limit = 5) => {
    const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data;
};

export const createEnquiry = async (enquiry) => {
    const { data, error } = await supabase.from('enquiries').insert([enquiry]).select().single();
    if (error) throw error;
    return data;
};

export const updateEnquiryStatus = async (id, status) => {
    const { data, error } = await supabase.from('enquiries').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteEnquiry = async (id) => {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) throw error;
};

// ==================== BOOKINGS ====================
export const getBookings = async () => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name)')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const createBooking = async (booking) => {
    const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
    if (error) throw error;
    return data;
};

export const updateBookingStatus = async (id, status) => {
    const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteBooking = async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
};

// ==================== TESTIMONIALS ====================
export const getPublishedTestimonials = async () => {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getAllTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getTestimonialById = async (id) => {
    const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createTestimonial = async (testimonial) => {
    const { data, error } = await supabase.from('testimonials').insert([testimonial]).select().single();
    if (error) throw error;
    return data;
};

export const updateTestimonial = async (id, testimonial) => {
    const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteTestimonial = async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
};

// ==================== FAQs ====================
export const getPublishedFaqs = async () => {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getAllFaqs = async () => {
    const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getFaqById = async (id) => {
    const { data, error } = await supabase.from('faqs').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createFaq = async (faq) => {
    const { data, error } = await supabase.from('faqs').insert([faq]).select().single();
    if (error) throw error;
    return data;
};

export const updateFaq = async (id, faq) => {
    const { data, error } = await supabase.from('faqs').update(faq).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteFaq = async (id) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
};

// ==================== GALLERY IMAGES ====================
export const getPublishedGalleryImages = async () => {
    const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getAllGalleryImages = async () => {
    const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getGalleryImageById = async (id) => {
    const { data, error } = await supabase.from('gallery_images').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createGalleryImage = async (image) => {
    const { data, error } = await supabase.from('gallery_images').insert([image]).select().single();
    if (error) throw error;
    return data;
};

export const updateGalleryImage = async (id, image) => {
    const { data, error } = await supabase.from('gallery_images').update(image).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteGalleryImage = async (id) => {
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) throw error;
};

// ==================== HERO SLIDES ====================
export const getActiveHeroSlides = async () => {
    const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
    if (error) throw error;
    return data;
};

export const getAllHeroSlides = async () => {
    const { data, error } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
    if (error) throw error;
    return data;
};

export const getHeroSlideById = async (id) => {
    const { data, error } = await supabase.from('hero_slides').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createHeroSlide = async (slide) => {
    const { data, error } = await supabase.from('hero_slides').insert([slide]).select().single();
    if (error) throw error;
    return data;
};

export const updateHeroSlide = async (id, slide) => {
    const { data, error } = await supabase.from('hero_slides').update(slide).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteHeroSlide = async (id) => {
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) throw error;
};

// ==================== USERS ====================
export const getUsers = async () => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getUserById = async (id) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createUser = async (user) => {
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) throw error;
    return data;
};

export const updateUser = async (id, user) => {
    const { data, error } = await supabase.from('users').update(user).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
};

// ==================== STORES ====================
export const getStores = async () => {
    const { data, error } = await supabase.from('stores').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const createStore = async (store) => {
    const { data, error } = await supabase.from('stores').insert([store]).select().single();
    if (error) throw error;
    return data;
};

export const deleteStore = async (id) => {
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) throw error;
};

export const getStoreById = async (id) => {
    const { data, error } = await supabase.from('stores').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const updateStore = async (id, store) => {
    const { data, error } = await supabase.from('stores').update(store).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

// ==================== ACTIVITY LOGS ====================
export const getActivityLogs = async () => {
    const { data, error } = await supabase
        .from('activity_logs')
        .select('*, users(name)')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const createActivityLog = async (log) => {
    const { data, error } = await supabase.from('activity_logs').insert([log]).select().single();
    if (error) throw error;
    return data;
};

// ==================== SETTINGS ====================
export const getSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    // Convert to key-value object
    const settings = {};
    (data || []).forEach((s) => {
        settings[s.key] = s.value;
    });
    return settings;
};

export const updateSetting = async (key, value) => {
    const { data, error } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' })
        .select()
        .single();
    if (error) throw error;
    return data;
};

// ==================== MEDIA ====================
export const getMedia = async () => {
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const uploadMedia = async (file) => {
    const filename = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file);
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(filename);

    const { data, error } = await supabase
        .from('media')
        .insert([{
            filename,
            original_name: file.name,
            mime: file.type,
            size: file.size,
            path: urlData.publicUrl,
        }])
        .select()
        .single();
    if (error) throw error;
    return data;
};

// ==================== DASHBOARD STATS ====================
export const getDashboardStats = async () => {
    const [enquiries, services, posts] = await Promise.all([
        supabase.from('enquiries').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('is_published', true),
    ]);
    return {
        enquiries: enquiries.count || 0,
        services: services.count || 0,
        posts: posts.count || 0,
    };
};

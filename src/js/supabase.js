import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL as CONFIG_URL, SUPABASE_ANON_KEY as CONFIG_KEY } from './config.js';

const STORAGE_URL_KEY = 'lipa_supabase_url';
const STORAGE_ANON_KEY = 'lipa_supabase_anon_key';

let supabaseClient = null;

export function getSupabaseCredentials() {
  const url = localStorage.getItem(STORAGE_URL_KEY) || CONFIG_URL || '';
  const key = localStorage.getItem(STORAGE_ANON_KEY) || CONFIG_KEY || '';
  return { url: url.trim(), key: key.trim() };
}

export function saveSupabaseCredentials(url, key) {
  if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
  else localStorage.removeItem(STORAGE_URL_KEY);

  if (key) localStorage.setItem(STORAGE_ANON_KEY, key.trim());
  else localStorage.removeItem(STORAGE_ANON_KEY);

  supabaseClient = null; // force re-initialization
  return getSupabase();
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

export function getSupabase() {
  if (supabaseClient) return supabaseClient;
  const { url, key } = getSupabaseCredentials();
  if (url && key && url.startsWith('http')) {
    try {
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

// Convert DB snake_case record to frontend camelCase Phone
export function mapDbPhoneToModel(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand || '',
    ram: row.ram || '',
    storage: row.storage || '',
    cashPrice: Number(row.cash_price || 0),
    deposit: Number(row.deposit || 0),
    dailyPayment: Number(row.daily_payment || 0),
    weeklyPayment: Number(row.weekly_payment || 0),
    stockStatus: row.stock_status || 'IN_STOCK',
    image: row.image || '/images/hero-phone.png',
    description: row.description || '',
    specs: row.specs || {},
    createdAt: row.created_at || null
  };
}

// Convert frontend camelCase Phone to DB snake_case record
export function mapModelToDbPhone(phone) {
  return {
    id: phone.id,
    name: phone.name,
    brand: phone.brand,
    ram: phone.ram,
    storage: phone.storage,
    cash_price: phone.cashPrice,
    deposit: phone.deposit,
    daily_payment: phone.dailyPayment,
    weekly_payment: phone.weeklyPayment,
    stock_status: phone.stockStatus,
    image: phone.image,
    description: phone.description || '',
    specs: phone.specs || {}
  };
}

// Fetch all phones from Supabase
export async function fetchPhonesFromSupabase() {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('phones')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching phones from Supabase:', error);
    throw error;
  }

  return (data || []).map(mapDbPhoneToModel);
}

// Save or Update a single phone in Supabase
export async function upsertPhoneToSupabase(phone) {
  const client = getSupabase();
  if (!client) return null;

  const row = mapModelToDbPhone(phone);
  const { data, error } = await client
    .from('phones')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error saving phone to Supabase:', error);
    throw error;
  }

  return data?.[0] ? mapDbPhoneToModel(data[0]) : phone;
}

// Delete phone from Supabase
export async function deletePhoneFromSupabase(id) {
  const client = getSupabase();
  if (!client) return null;

  const { error } = await client
    .from('phones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting phone from Supabase:', error);
    throw error;
  }
}

// Upload an image file directly to Supabase Storage bucket 'phone-images'
export async function uploadImageToSupabase(file) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured. Please enter your Supabase Project URL and Anon Key in Settings.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${Date.now()}_${cleanName}`;

  const { data, error } = await client.storage
    .from('phone-images')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image to Supabase Storage:', error);
    throw error;
  }

  const { data: urlData } = client.storage
    .from('phone-images')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

// Seed the Supabase table with initial catalogue if empty
export async function seedCatalogueToSupabase(seedPhones) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not connected');

  const rows = seedPhones.map(mapModelToDbPhone);

  // Batch insert in chunks of 50
  const CHUNK_SIZE = 50;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    const { error } = await client
      .from('phones')
      .upsert(chunk, { onConflict: 'id' });

    if (error) {
      console.error('Error seeding chunk to Supabase:', error);
      throw error;
    }
  }

  return true;
}

// Real-time listener for database updates across all devices
export function subscribeToSupabaseRealtime(onUpdate) {
  const client = getSupabase();
  if (!client) return () => {};

  const channel = client
    .channel('realtime:phones')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'phones' }, (payload) => {
      if (typeof onUpdate === 'function') {
        onUpdate(payload);
      }
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

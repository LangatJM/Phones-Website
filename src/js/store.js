// State Management & Cloud + LocalStorage Persistence System
import { SEED_PHONES } from './data.js';
import { DEFAULT_CONFIG } from './config.js';
import {
  isSupabaseConfigured,
  fetchPhonesFromSupabase,
  upsertPhoneToSupabase,
  deletePhoneFromSupabase,
  subscribeToSupabaseRealtime,
  seedCatalogueToSupabase
} from './supabase.js';

const INVENTORY_STORAGE_KEY = 'lipa_phones_inventory_v1';
const CONFIG_STORAGE_KEY = 'lipa_phones_config_v1';

class Store {
  constructor() {
    this.phones = this.loadPhones();
    this.config = this.loadConfig();
    this.listeners = [];
    this.isCloudSyncing = false;
    this.cloudConnected = false;
    this.unsubscribeRealtime = null;

    // Start background cloud sync if Supabase is set up
    this.initCloudSync();
  }

  async initCloudSync() {
    if (!isSupabaseConfigured()) {
      this.cloudConnected = false;
      return;
    }

    try {
      this.isCloudSyncing = true;
      const cloudPhones = await fetchPhonesFromSupabase();

      if (cloudPhones && cloudPhones.length > 0) {
        this.phones = cloudPhones;
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(this.phones));
        this.cloudConnected = true;
        this.notify();
      } else if (cloudPhones && cloudPhones.length === 0) {
        // Cloud table is empty, mark connected
        this.cloudConnected = true;
      }

      // Listen for real-time changes across all devices
      if (this.unsubscribeRealtime) {
        this.unsubscribeRealtime();
      }
      this.unsubscribeRealtime = subscribeToSupabaseRealtime(async (payload) => {
        try {
          const fresh = await fetchPhonesFromSupabase();
          if (fresh) {
            this.phones = fresh;
            localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(this.phones));
            this.notify();
          }
        } catch (e) {
          console.warn('Realtime sync refetch error:', e);
        }
      });
    } catch (err) {
      console.warn('Supabase cloud fetch failed, continuing with local cache:', err);
      this.cloudConnected = false;
    } finally {
      this.isCloudSyncing = false;
    }
  }

  loadPhones() {
    try {
      const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not parse saved inventory, falling back to seeds", e);
    }
    // Initialize seed data
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(SEED_PHONES));
    return SEED_PHONES;
  }

  savePhones() {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(this.phones));
    this.notify();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not parse saved config, using default", e);
    }
    return DEFAULT_CONFIG;
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    this.notify();
  }

  getPhones() {
    return this.phones;
  }

  getPhoneById(id) {
    return this.phones.find(p => p.id === id);
  }

  async addPhone(phoneData) {
    const newPhone = {
      id: `phone-${Date.now()}`,
      ...phoneData
    };
    this.phones.unshift(newPhone);
    this.savePhones();

    if (isSupabaseConfigured()) {
      try {
        await upsertPhoneToSupabase(newPhone);
      } catch (err) {
        console.error('Failed to sync added phone to Supabase:', err);
      }
    }
    return newPhone;
  }

  async updatePhone(id, phoneData) {
    const idx = this.phones.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.phones[idx] = { ...this.phones[idx], ...phoneData };
      this.savePhones();

      if (isSupabaseConfigured()) {
        try {
          await upsertPhoneToSupabase(this.phones[idx]);
        } catch (err) {
          console.error('Failed to sync updated phone to Supabase:', err);
        }
      }
    }
  }

  async updateStockStatus(id, newStatus) {
    const phone = this.getPhoneById(id);
    if (phone) {
      phone.stockStatus = newStatus;
      this.savePhones();

      if (isSupabaseConfigured()) {
        try {
          await upsertPhoneToSupabase(phone);
        } catch (err) {
          console.error('Failed to sync stock status to Supabase:', err);
        }
      }
    }
  }

  async deletePhone(id) {
    this.phones = this.phones.filter(p => p.id !== id);
    this.savePhones();

    if (isSupabaseConfigured()) {
      try {
        await deletePhoneFromSupabase(id);
      } catch (err) {
        console.error('Failed to sync phone deletion to Supabase:', err);
      }
    }
  }

  async syncAllToSupabase() {
    if (!isSupabaseConfigured()) {
      throw new Error('Please configure Supabase Project URL and Anon Key first.');
    }
    await seedCatalogueToSupabase(this.phones);
    await this.initCloudSync();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const store = new Store();

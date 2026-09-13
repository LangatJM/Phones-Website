// State Management & LocalStorage Persistence System
import { SEED_PHONES } from './data.js';
import { DEFAULT_CONFIG } from './config.js';

const INVENTORY_STORAGE_KEY = 'lipa_phones_inventory_v1';
const CONFIG_STORAGE_KEY = 'lipa_phones_config_v1';

class Store {
  constructor() {
    this.phones = this.loadPhones();
    this.config = this.loadConfig();
    this.listeners = [];
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

  addPhone(phoneData) {
    const newPhone = {
      id: `phone-${Date.now()}`,
      ...phoneData
    };
    this.phones.unshift(newPhone);
    this.savePhones();
    return newPhone;
  }

  updatePhone(id, phoneData) {
    const idx = this.phones.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.phones[idx] = { ...this.phones[idx], ...phoneData };
      this.savePhones();
    }
  }

  updateStockStatus(id, newStatus) {
    const phone = this.getPhoneById(id);
    if (phone) {
      phone.stockStatus = newStatus;
      this.savePhones();
    }
  }

  deletePhone(id) {
    this.phones = this.phones.filter(p => p.id !== id);
    this.savePhones();
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

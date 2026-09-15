// Mobile-First Admin Dashboard Controller
import { store } from './store.js';
import { ADMIN_PASSWORD, driveUrlToImage } from './config.js';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  uploadImageToSupabase
} from './supabase.js';


document.addEventListener('DOMContentLoaded', () => {
  initAuth();        // must run first — guards entire page
});

function initAuth() {
  const overlay   = document.getElementById('adminLoginOverlay');
  const content   = document.getElementById('adminContent');
  const loginForm = document.getElementById('loginForm');
  const loginErr  = document.getElementById('loginError');
  const pwdInput  = document.getElementById('loginPassword');
  const toggleBtn = document.getElementById('togglePwdVisibility');

  // Check if already authenticated this session
  if (sessionStorage.getItem('adminAuth') === 'granted') {
    showAdminContent(overlay, content);
    return;
  }

  // Show login overlay
  if (overlay) overlay.style.display = 'flex';
  if (content) content.style.display = 'none';

  // Toggle password visibility
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener('click', () => {
      const isText = pwdInput.type === 'text';
      pwdInput.type = isText ? 'password' : 'text';
      toggleBtn.textContent = isText ? '👁️' : '🙈';
    });
  }

  // Handle login submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = pwdInput.value;
      if (entered === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'granted');
        if (loginErr) loginErr.style.display = 'none';
        showAdminContent(overlay, content);
      } else {
        if (loginErr) loginErr.style.display = 'block';
        pwdInput.value = '';
        pwdInput.focus();
        // Shake animation
        loginForm.style.animation = 'shake 0.35s ease';
        setTimeout(() => { loginForm.style.animation = ''; }, 400);
      }
    });
  }
}

function showAdminContent(overlay, content) {
  if (overlay) overlay.style.display = 'none';
  if (content) content.style.display = 'block';
  // Inject logout button into header
  injectLogoutButton();
  // Now boot the dashboard
  initAdminDashboard();
  initAdminForms();
  initImageUpload();
}

function injectLogoutButton() {
  const headerActions = document.querySelector('.admin-header-bar > div:last-child');
  if (!headerActions || document.getElementById('logoutBtn')) return;
  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logoutBtn';
  logoutBtn.className = 'btn btn-call btn-sm';
  logoutBtn.innerHTML = '🚪 Logout';
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminAuth');
    location.reload();
  });
  headerActions.appendChild(logoutBtn);
}

/* Shake keyframe injected at runtime */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
}`;
document.head.appendChild(shakeStyle);


let editingPhoneId = null;

function initAdminDashboard() {
  renderInventory();
  renderStats();
  renderSettings();
  initSupabaseDashboard();

  store.subscribe(() => {
    renderInventory();
    renderStats();
    updateCloudStatusBadge();
  });


  // Admin Search filter
  const adminSearch = document.getElementById('adminSearchInput');
  if (adminSearch) {
    adminSearch.addEventListener('input', () => renderInventory());
  }

  // Stock status filter
  const statusFilter = document.getElementById('adminStatusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => renderInventory());
  }
}

function renderStats() {
  const phones = store.getPhones();
  const totalEl = document.getElementById('statTotalPhones');
  const inStockEl = document.getElementById('statInStock');
  const lowStockEl = document.getElementById('statLowStock');
  const outStockEl = document.getElementById('statOutStock');

  if (totalEl) totalEl.textContent = phones.length;
  if (inStockEl) inStockEl.textContent = phones.filter(p => p.stockStatus === 'IN_STOCK').length;
  if (lowStockEl) lowStockEl.textContent = phones.filter(p => p.stockStatus === 'LOW_STOCK').length;
  if (outStockEl) outStockEl.textContent = phones.filter(p => p.stockStatus === 'OUT_OF_STOCK').length;
}

function renderInventory() {
  const cardList = document.getElementById('adminCardList');
  const tableBody = document.getElementById('adminTableBody');
  const searchQuery = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
  const statusQuery = document.getElementById('adminStatusFilter')?.value || 'ALL';

  const phones = store.getPhones().filter(phone => {
    const matchesSearch = !searchQuery ||
      phone.name.toLowerCase().includes(searchQuery) ||
      phone.brand.toLowerCase().includes(searchQuery);
    const matchesStatus = statusQuery === 'ALL' || phone.stockStatus === statusQuery;
    return matchesSearch && matchesStatus;
  });

  const currency = store.config.currency;

  // Render Mobile Cards View
  if (cardList) {
    if (phones.length === 0) {
      cardList.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No phones found in inventory.</div>`;
    } else {
      cardList.innerHTML = phones.map(phone => `
        <div class="admin-inventory-card">
          <div class="admin-card-top">
            <img src="${phone.image}" alt="${phone.name}" class="admin-card-thumb" />
            <div class="admin-card-info">
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">${phone.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${phone.brand} • ${phone.ram}/${phone.storage}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-600); margin-top: 0.2rem;">
                Deposit: ${currency} ${phone.deposit.toLocaleString()} | ${currency} ${phone.dailyPayment}/day
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; font-weight: 600;">Stock Status:</span>
            <select class="form-select status-switcher" data-id="${phone.id}" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.8rem;">
              <option value="IN_STOCK" ${phone.stockStatus === 'IN_STOCK' ? 'selected' : ''}>🟢 IN STOCK</option>
              <option value="LOW_STOCK" ${phone.stockStatus === 'LOW_STOCK' ? 'selected' : ''}>⚡ LOW STOCK</option>
              <option value="OUT_OF_STOCK" ${phone.stockStatus === 'OUT_OF_STOCK' ? 'selected' : ''}>🔴 OUT OF STOCK</option>
            </select>
          </div>
          <div class="admin-card-actions">
            <button class="btn btn-call btn-sm edit-phone-btn" data-id="${phone.id}">✏️ Edit</button>
            <button class="btn btn-call btn-sm delete-phone-btn" data-id="${phone.id}" style="color: #ef4444;">🗑️ Delete</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Desktop Table View
  if (tableBody) {
    if (phones.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No inventory items found.</td></tr>`;
    } else {
      tableBody.innerHTML = phones.map(phone => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${phone.image}" alt="${phone.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: var(--radius-sm); background: var(--bg-subtle);" />
              <div>
                <strong style="display: block;">${phone.name}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${phone.brand}</span>
              </div>
            </div>
          </td>
          <td>${phone.ram} / ${phone.storage}</td>
          <td>${currency} ${phone.cashPrice.toLocaleString()}</td>
          <td>
            <strong style="color: var(--accent-600);">${currency} ${phone.deposit.toLocaleString()}</strong>
            <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">${currency} ${phone.dailyPayment}/day</span>
          </td>
          <td>
            <select class="form-select status-switcher" data-id="${phone.id}" style="padding: 0.35rem 0.5rem; font-size: 0.8rem;">
              <option value="IN_STOCK" ${phone.stockStatus === 'IN_STOCK' ? 'selected' : ''}>🟢 IN STOCK</option>
              <option value="LOW_STOCK" ${phone.stockStatus === 'LOW_STOCK' ? 'selected' : ''}>⚡ LOW STOCK</option>
              <option value="OUT_OF_STOCK" ${phone.stockStatus === 'OUT_OF_STOCK' ? 'selected' : ''}>🔴 OUT OF STOCK</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-call btn-sm edit-phone-btn" data-id="${phone.id}">Edit</button>
              <button class="btn btn-call btn-sm delete-phone-btn" data-id="${phone.id}" style="color: #ef4444;">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // Attach event handlers
  document.querySelectorAll('.status-switcher').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      store.updateStockStatus(id, newStatus);
    });
  });

  document.querySelectorAll('.edit-phone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openPhoneFormModal(e.target.dataset.id);
    });
  });

  document.querySelectorAll('.delete-phone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const phone = store.getPhoneById(id);
      if (phone && confirm(`Are you sure you want to delete "${phone.name}" from inventory?`)) {
        store.deletePhone(id);
      }
    });
  });
}

function renderSettings() {
  const waInput = document.getElementById('configWaNumber');
  const salesInput = document.getElementById('configSalesPhone');

  if (waInput) waInput.value = store.config.whatsappNumber;
  if (salesInput) salesInput.value = store.config.salesPhone;
}

function initAdminForms() {
  const addBtn = document.getElementById('btnAddNewPhone');
  const fabBtn = document.getElementById('fabAddPhone');
  const modal = document.getElementById('adminModalOverlay');
  const closeBtn = document.getElementById('adminModalCloseBtn');
  const phoneForm = document.getElementById('phoneForm');
  const settingsForm = document.getElementById('settingsForm');

  if (addBtn) addBtn.addEventListener('click', () => openPhoneFormModal());
  if (fabBtn) fabBtn.addEventListener('click', () => openPhoneFormModal());
  if (closeBtn) closeBtn.addEventListener('click', closePhoneFormModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePhoneFormModal();
    });
  }

  if (phoneForm) {
    phoneForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('btnSavePhone');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Saving...';
      }

      const formData = {
        name: document.getElementById('inputName').value.trim(),
        brand: document.getElementById('inputBrand').value.trim(),
        ram: document.getElementById('inputRam').value.trim(),
        storage: document.getElementById('inputStorage').value.trim(),
        cashPrice: Number(document.getElementById('inputCashPrice').value),
        deposit: Number(document.getElementById('inputDeposit').value),
        dailyPayment: Number(document.getElementById('inputDaily').value),
        weeklyPayment: Number(document.getElementById('inputWeekly').value),
        stockStatus: document.getElementById('inputStockStatus').value,
        image: driveUrlToImage(document.getElementById('inputImage').value.trim()) || '/images/hero-phone.png',
        description: document.getElementById('inputDescription').value.trim()
      };

      try {
        if (editingPhoneId) {
          await store.updatePhone(editingPhoneId, formData);
        } else {
          await store.addPhone(formData);
        }
      } catch (err) {
        console.error('Error saving phone item:', err);
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Save Smartphone Item';
        }
        closePhoneFormModal();
      }
    });
  }

  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newWa = document.getElementById('configWaNumber').value.trim();
      const newSales = document.getElementById('configSalesPhone').value.trim();
      store.saveConfig({ whatsappNumber: newWa, salesPhone: newSales });
      alert("Store configuration updated successfully!");
    });
  }
}

// ── Image Upload: Direct to Supabase Storage if connected, or local preview ──
function initImageUpload() {
  const fileInput   = document.getElementById('inputImageFile');
  const urlInput    = document.getElementById('inputImage');
  const preview     = document.getElementById('imagePreviewBox');
  const placeholder = document.getElementById('uploadPlaceholder');

  if (!fileInput || !urlInput || !preview) return;

  // File picker change
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFileIntoPreview(file, urlInput, preview, placeholder);
  });

  // Drag-and-drop on the zone
  const zone = document.getElementById('imageUploadZone');
  if (zone) {
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor = 'var(--primary-500)'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.borderColor = '';
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        loadFileIntoPreview(file, urlInput, preview, placeholder);
      }
    });
  }

  // URL paste / type — show preview; auto-convert Google Drive links
  urlInput.addEventListener('input', () => {
    const raw = urlInput.value.trim();
    const converted = driveUrlToImage(raw);
    if (converted !== raw) {
      // Replace the input with the direct URL so the stored value is always the embeddable URL
      urlInput.value = converted;
    }
    if (converted) {
      showPreview(preview, placeholder, converted);
    } else {
      clearPreview(preview, placeholder);
    }
  });
}

async function loadFileIntoPreview(file, urlInput, preview, placeholder) {
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large (max 5 MB). Please choose a smaller file.');
    return;
  }

  const statusEl = document.getElementById('imageUploadStatus');
  const showStatus = (msg, isError = false) => {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.style.background = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
    statusEl.style.color = isError ? '#ef4444' : '#16a34a';
    statusEl.textContent = msg;
  };

  const reader = new FileReader();
  reader.onload = async (ev) => {
    const localDataUrl = ev.target.result;
    showPreview(preview, placeholder, localDataUrl);

    if (isSupabaseConfigured()) {
      showStatus('☁️ Uploading photo to Supabase Cloud Storage...');
      try {
        const publicUrl = await uploadImageToSupabase(file);
        urlInput.value = publicUrl;
        showPreview(preview, placeholder, publicUrl);
        showStatus('✅ Uploaded to Cloud Storage! Photo will appear on all devices.');
      } catch (err) {
        console.error('Cloud image upload failed:', err);
        showStatus('⚠️ Cloud upload failed: ' + (err.message || 'Check storage bucket permissions'), true);
        urlInput.value = localDataUrl;
      }
    } else {
      urlInput.value = localDataUrl;
      showStatus('⚠️ Saved in local browser memory only. Connect Supabase below to make photos visible on all devices.', true);
    }
  };
  reader.readAsDataURL(file);
}

function showPreview(preview, placeholder, src) {
  preview.src = src;
  preview.classList.add('has-image');
  if (placeholder) placeholder.style.display = 'none';
}

function clearPreview(preview, placeholder) {
  preview.src = '';
  preview.classList.remove('has-image');
  if (placeholder) placeholder.style.display = '';
}

function openPhoneFormModal(phoneId = null) {
  editingPhoneId = phoneId;
  const modal = document.getElementById('adminModalOverlay');
  const modalTitle = document.getElementById('adminModalTitle');
  const form = document.getElementById('phoneForm');

  if (!modal || !form) return;

  if (phoneId) {
    const phone = store.getPhoneById(phoneId);
    if (!phone) return;

    modalTitle.textContent = 'Edit Smartphone Item';
    document.getElementById('inputName').value = phone.name;
    document.getElementById('inputBrand').value = phone.brand;
    document.getElementById('inputRam').value = phone.ram;
    document.getElementById('inputStorage').value = phone.storage;
    document.getElementById('inputCashPrice').value = phone.cashPrice;
    document.getElementById('inputDeposit').value = phone.deposit;
    document.getElementById('inputDaily').value = phone.dailyPayment;
    document.getElementById('inputWeekly').value = phone.weeklyPayment;
    document.getElementById('inputStockStatus').value = phone.stockStatus;
    document.getElementById('inputImage').value = phone.image;
    document.getElementById('inputDescription').value = phone.description || '';
  } else {
    modalTitle.textContent = 'Add New Smartphone';
    form.reset();
  }

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Sync image preview with existing value
  const urlInput    = document.getElementById('inputImage');
  const preview     = document.getElementById('imagePreviewBox');
  const placeholder = document.getElementById('uploadPlaceholder');
  const statusEl    = document.getElementById('imageUploadStatus');
  if (statusEl) {
    statusEl.style.display = 'none';
    statusEl.textContent = '';
  }

  if (urlInput && preview) {
    const val = urlInput.value.trim();
    if (val) {
      showPreview(preview, placeholder, val);
    } else {
      clearPreview(preview, placeholder);
    }
  }
}

function closePhoneFormModal() {
  const modal = document.getElementById('adminModalOverlay');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  editingPhoneId = null;
  // Reset image upload UI
  const fileInput   = document.getElementById('inputImageFile');
  const preview     = document.getElementById('imagePreviewBox');
  const placeholder = document.getElementById('uploadPlaceholder');
  const statusEl    = document.getElementById('imageUploadStatus');
  if (fileInput) fileInput.value = '';
  if (preview && placeholder) clearPreview(preview, placeholder);
  if (statusEl) {
    statusEl.style.display = 'none';
    statusEl.textContent = '';
  }
}

// ── Supabase Cloud Dashboard Management ──
const SUPABASE_SETUP_SQL = `-- 1. Create phones inventory table
create table if not exists public.phones (
  id text primary key,
  name text not null,
  brand text,
  ram text,
  storage text,
  cash_price numeric,
  deposit numeric,
  daily_payment numeric,
  weekly_payment numeric,
  stock_status text default 'IN_STOCK',
  image text,
  description text,
  specs jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.phones enable row level security;

-- 3. Public read policy (all visitors can view phones)
create policy "Allow public read on phones" on public.phones 
for select using (true);

-- 4. Allow insert/update/delete with anon key
create policy "Allow anon insert on phones" on public.phones 
for insert with check (true);

create policy "Allow anon update on phones" on public.phones 
for update using (true);

create policy "Allow anon delete on phones" on public.phones 
for delete using (true);

-- 5. Create storage bucket for uploaded phone images
insert into storage.buckets (id, name, public)
values ('phone-images', 'phone-images', true)
on conflict (id) do nothing;

-- 6. Storage security policies for phone-images bucket
create policy "Public images are viewable by everyone" on storage.objects
for select using (bucket_id = 'phone-images');

create policy "Anyone can upload phone images" on storage.objects
for insert with check (bucket_id = 'phone-images');

create policy "Anyone can update phone images" on storage.objects
for update using (bucket_id = 'phone-images');`;

function updateCloudStatusBadge() {
  const badge = document.getElementById('cloudStatusBadge');
  const syncBtn = document.getElementById('btnSyncSeedCatalog');
  if (!badge) return;

  if (store.cloudConnected) {
    badge.textContent = '🟢 Connected (Supabase Cloud)';
    badge.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
    badge.style.color = '#16a34a';
    if (syncBtn) syncBtn.style.display = 'inline-block';
  } else if (isSupabaseConfigured()) {
    badge.textContent = '🟡 Connecting to Supabase...';
    badge.style.backgroundColor = 'rgba(234, 179, 8, 0.15)';
    badge.style.color = '#ca8a04';
    if (syncBtn) syncBtn.style.display = 'inline-block';
  } else {
    badge.textContent = '🔴 Offline (Local Storage)';
    badge.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    badge.style.color = '#ef4444';
    if (syncBtn) syncBtn.style.display = 'none';
  }
}

function initSupabaseDashboard() {
  const form = document.getElementById('supabaseConfigForm');
  const urlInput = document.getElementById('inputSupabaseUrl');
  const keyInput = document.getElementById('inputSupabaseKey');
  const feedback = document.getElementById('supabaseFeedback');
  const syncBtn = document.getElementById('btnSyncSeedCatalog');
  const toggleSqlBtn = document.getElementById('btnToggleSqlGuide');
  const sqlBox = document.getElementById('supabaseSqlBox');
  const sqlPre = document.getElementById('supabaseSqlCode');
  const copySqlBtn = document.getElementById('btnCopySql');

  // Fill existing credentials
  const { url, key } = getSupabaseCredentials();
  if (urlInput && url) urlInput.value = url;
  if (keyInput && key) keyInput.value = key;

  if (sqlPre) sqlPre.textContent = SUPABASE_SETUP_SQL;

  updateCloudStatusBadge();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredUrl = urlInput.value.trim();
      const enteredKey = keyInput.value.trim();

      saveSupabaseCredentials(enteredUrl, enteredKey);

      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(59, 130, 246, 0.15)';
        feedback.style.color = 'var(--primary-600)';
        feedback.textContent = '🔄 Connecting to Supabase...';
      }

      await store.initCloudSync();
      updateCloudStatusBadge();

      if (feedback) {
        if (store.cloudConnected) {
          feedback.style.background = 'rgba(34, 197, 94, 0.15)';
          feedback.style.color = '#16a34a';
          feedback.textContent = '✅ Connected to Supabase! Smartphone images and inventory are now synced across all devices in real time.';
        } else {
          feedback.style.background = 'rgba(239, 68, 68, 0.15)';
          feedback.style.color = '#ef4444';
          feedback.textContent = '⚠️ Could not connect to Supabase. Please check your Project URL, anon key, and ensure the SQL setup was run in Supabase SQL Editor.';
        }
      }
    });
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      if (!confirm('This will upload all smartphones in your local catalog to Supabase. Continue?')) {
        return;
      }
      syncBtn.disabled = true;
      syncBtn.textContent = '⏳ Uploading to Cloud...';
      try {
        await store.syncAllToSupabase();
        alert('✅ Catalog successfully synced to Supabase Cloud!');
      } catch (err) {
        alert('❌ Sync failed: ' + (err.message || 'Check connection'));
      } finally {
        syncBtn.disabled = false;
        syncBtn.textContent = '⚡ Upload Seed Catalog to Cloud';
      }
    });
  }

  if (toggleSqlBtn && sqlBox) {
    toggleSqlBtn.addEventListener('click', () => {
      const isVisible = sqlBox.style.display !== 'none';
      sqlBox.style.display = isVisible ? 'none' : 'block';
      toggleSqlBtn.textContent = isVisible ? '📋 Supabase SQL & Setup Guide' : '✕ Hide SQL Guide';
    });
  }

  if (copySqlBtn) {
    copySqlBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
        copySqlBtn.textContent = '✅ Copied!';
        setTimeout(() => { copySqlBtn.textContent = '📋 Copy SQL'; }, 2000);
      } catch (e) {
        copySqlBtn.textContent = 'Select & copy manually';
      }
    });
  }
}

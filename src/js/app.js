// Customer Storefront Front-End Controller
import { store } from './store.js';
import { buildWhatsAppLink } from './whatsapp.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCatalogue();
  initModal();
  initStickyCTA();

  // Listen to store updates
  store.subscribe(() => {
    renderCatalogue();
    updateStickyCTA();
  });
});

// Mobile Hamburger Drawer Controller
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu(open) {
    const isActive = open !== undefined ? open : !mobileDrawer.classList.contains('is-active');
    if (isActive) {
      hamburgerBtn.classList.add('is-active');
      mobileDrawer.classList.add('is-active');
      drawerOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    } else {
      hamburgerBtn.classList.remove('is-active');
      mobileDrawer.classList.remove('is-active');
      drawerOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMenu());
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => toggleMenu(false));
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

// Catalogue State & Filtering
let activeBrand = 'ALL';
let searchQuery = '';

function initCatalogue() {
  const searchInput = document.getElementById('searchInput');
  const brandPills = document.querySelectorAll('.pill-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderCatalogue();
    });
  }

  brandPills.forEach(pill => {
    pill.addEventListener('click', () => {
      brandPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeBrand = pill.dataset.brand || 'ALL';
      renderCatalogue();
    });
  });

  renderCatalogue();
}

function renderCatalogue() {
  const gridContainer = document.getElementById('phoneGrid');
  if (!gridContainer) return;

  const phones = store.getPhones();
  const config = store.config;

  const filtered = phones.filter(phone => {
    const matchesBrand = activeBrand === 'ALL' || phone.brand.toUpperCase() === activeBrand.toUpperCase();
    const matchesSearch = !searchQuery || 
      phone.name.toLowerCase().includes(searchQuery) ||
      phone.brand.toLowerCase().includes(searchQuery) ||
      `${phone.ram} ${phone.storage}`.toLowerCase().includes(searchQuery);
    return matchesBrand && matchesSearch;
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 0.5rem;">📱</p>
        <p style="font-weight: 700; font-size: 1.1rem;">No smartphones match your search</p>
        <p style="font-size: 0.9rem; margin-top: 0.25rem;">Try selecting a different brand or search keyword.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(phone => {
    const stockBadge = getStockBadgeHTML(phone.stockStatus);
    const waUrl = buildWhatsAppLink(config.whatsappNumber, phone, 'INQUIRY');

    return `
      <div class="phone-card" data-id="${phone.id}">
        <div class="card-image-wrap">
          <div class="card-stock-tag">${stockBadge}</div>
          <div class="card-brand-tag"><span class="badge badge-brand">${phone.brand}</span></div>
          <img src="${phone.image}" alt="${phone.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${phone.name}</h3>
          <div class="card-specs-pill">
            <span>💾 ${phone.storage}</span>
            <span>•</span>
            <span>⚡ ${phone.ram} RAM</span>
          </div>
          
          <div class="lipa-box">
            <span class="lipa-label">Lipa Mdogo Mdogo</span>
            <div class="lipa-values">
              <span class="lipa-deposit">Dep: ${config.currency} ${phone.deposit.toLocaleString()}</span>
              <span class="lipa-daily">${config.currency} ${phone.dailyPayment}/day</span>
            </div>
          </div>

          <div class="card-footer">
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-call btn-sm view-details-btn" data-id="${phone.id}" style="flex: 1;">
                Details
              </button>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="flex: 1.3;">
                💬 Ask WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach event handlers for view details
  gridContainer.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const phoneId = e.currentTarget.dataset.id;
      openPhoneModal(phoneId);
    });
  });
}

function getStockBadgeHTML(status) {
  switch (status) {
    case 'IN_STOCK':
      return `<span class="badge badge-in-stock">✓ IN STOCK</span>`;
    case 'LOW_STOCK':
      return `<span class="badge badge-low-stock">⚡ FEW LEFT</span>`;
    case 'OUT_OF_STOCK':
      return `<span class="badge badge-out-stock">✖ OUT OF STOCK</span>`;
    default:
      return `<span class="badge badge-in-stock">✓ IN STOCK</span>`;
  }
}

// Modal Details Window
function initModal() {
  const modalOverlay = document.getElementById('phoneModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closePhoneModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closePhoneModal();
    });
  }
}

function openPhoneModal(phoneId) {
  const phone = store.getPhoneById(phoneId);
  if (!phone) return;

  const config = store.config;
  const modalOverlay = document.getElementById('phoneModalOverlay');
  const modalContent = document.getElementById('modalBody');

  const waUrl = buildWhatsAppLink(config.whatsappNumber, phone, 'BUY');

  modalContent.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div style="display: flex; gap: 1rem; align-items: flex-start;">
        <div style="width: 110px; height: 110px; background-color: var(--bg-subtle); border-radius: var(--radius-md); padding: 0.5rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          <img src="${phone.image}" alt="${phone.name}" style="max-height: 100%; width: auto; object-fit: contain;" />
        </div>
        <div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.35rem;">
            ${getStockBadgeHTML(phone.stockStatus)}
            <span class="badge badge-brand">${phone.brand}</span>
          </div>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">${phone.name}</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">${phone.ram} RAM | ${phone.storage} Storage</p>
          <p style="font-size: 0.95rem; font-weight: 800; color: var(--primary-600); margin-top: 0.35rem;">Cash Price: ${config.currency} ${phone.cashPrice.toLocaleString()}</p>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, var(--accent-50), #fff); border: 1px solid var(--accent-500); border-radius: var(--radius-md); padding: 1rem;">
        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--accent-700); margin-bottom: 0.5rem; font-weight: 800;">⚡ Lipa Mdogo Mdogo Payment Term</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; text-align: center;">
          <div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted);">INITIAL DEPOSIT</span>
            <strong style="font-size: 0.95rem; color: var(--accent-600);">${config.currency} ${phone.deposit.toLocaleString()}</strong>
          </div>
          <div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted);">DAILY RATE</span>
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${config.currency} ${phone.dailyPayment}</strong>
          </div>
          <div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted);">WEEKLY RATE</span>
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${config.currency} ${phone.weeklyPayment}</strong>
          </div>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Key Specifications</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.85rem;">
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">📺 ${phone.specs?.display || 'HD+ Display'}</div>
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">🔋 ${phone.specs?.battery || '5000 mAh'}</div>
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">📷 ${phone.specs?.mainCamera || '50 MP Dual Camera'}</div>
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">⚙️ ${phone.specs?.processor || 'Octa-Core Processor'}</div>
        </div>
      </div>

      <div style="background-color: var(--primary-50); border: 1px solid var(--primary-100); border-radius: var(--radius-md); padding: 0.75rem; font-size: 0.8rem; color: var(--primary-800);">
        <strong>📌 What do you need?</strong> Original National ID + Active M-Pesa line registered under your ID. Deposit paid upon receiving phone.
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">
          💬 Order on WhatsApp Now
        </a>
        <a href="tel:${config.salesPhone}" class="btn btn-call btn-block">
          📞 Call Sales Agent (${config.salesPhone})
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closePhoneModal() {
  const modalOverlay = document.getElementById('phoneModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

// Sticky CTA Toolbar updater
function initStickyCTA() {
  updateStickyCTA();
}

function updateStickyCTA() {
  const config = store.config;
  const stickyWaBtn = document.getElementById('stickyWaBtn');
  const stickyCallBtn = document.getElementById('stickyCallBtn');

  if (stickyWaBtn) {
    stickyWaBtn.href = buildWhatsAppLink(config.whatsappNumber, null, 'GENERAL');
  }
  if (stickyCallBtn) {
    stickyCallBtn.href = `tel:${config.salesPhone}`;
  }
}

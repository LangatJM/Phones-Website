import{s as d}from"./store-Da1MZaWI.js";function m(r,e=null,t="INQUIRY"){const i=r.replace(/[^0-9]/g,"");let a="";e?(t==="BUY"||t==="INQUIRY")&&(a=`Hello! I am interested in getting the *${e.name}* (${e.ram} / ${e.storage}).

• Lipa Mdogo Deposit: KSh ${e.deposit.toLocaleString()}
• Daily Payment: KSh ${e.dailyPayment.toLocaleString()}/day

Please explain the Lipa Mdogo Mdogo requirements and how I can receive or pick up this device.`):a="Hello! I would like to inquire about your available smartphones and Lipa Mdogo Mdogo deposit payment plans.";const s=encodeURIComponent(a);return`https://wa.me/${i}?text=${s}`}document.addEventListener("DOMContentLoaded",()=>{f(),h(),L(),$(),d.subscribe(()=>{l(),b()})});function f(){const r=document.getElementById("hamburgerBtn"),e=document.getElementById("mobileDrawer"),t=document.getElementById("drawerOverlay"),i=document.querySelectorAll(".mobile-nav-link");function a(s){(s!==void 0?s:!e.classList.contains("is-active"))?(r.classList.add("is-active"),e.classList.add("is-active"),t.classList.add("is-active"),document.body.style.overflow="hidden"):(r.classList.remove("is-active"),e.classList.remove("is-active"),t.classList.remove("is-active"),document.body.style.overflow="")}r&&r.addEventListener("click",()=>a()),t&&t.addEventListener("click",()=>a(!1)),i.forEach(s=>{s.addEventListener("click",()=>a(!1))})}let c="ALL",o="";function h(){const r=document.getElementById("searchInput"),e=document.querySelectorAll(".pill-btn");r&&r.addEventListener("input",t=>{o=t.target.value.toLowerCase().trim(),l()}),e.forEach(t=>{t.addEventListener("click",()=>{e.forEach(i=>i.classList.remove("is-active")),t.classList.add("is-active"),c=t.dataset.brand||"ALL",l()})}),l()}function l(){const r=document.getElementById("phoneGrid");if(!r)return;const e=d.getPhones(),t=d.config,i=e.filter(a=>{const s=c==="ALL"||a.brand.toUpperCase()===c.toUpperCase(),n=!o||a.name.toLowerCase().includes(o)||a.brand.toLowerCase().includes(o)||`${a.ram} ${a.storage}`.toLowerCase().includes(o);return s&&n});if(i.length===0){r.innerHTML=`
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 0.5rem;">📱</p>
        <p style="font-weight: 700; font-size: 1.1rem;">No smartphones match your search</p>
        <p style="font-size: 0.9rem; margin-top: 0.25rem;">Try selecting a different brand or search keyword.</p>
      </div>
    `;return}r.innerHTML=i.map(a=>{const s=y(a.stockStatus),n=m(t.whatsappNumber,a,"INQUIRY");return`
      <div class="phone-card" data-id="${a.id}">
        <div class="card-image-wrap">
          <div class="card-stock-tag">${s}</div>
          <div class="card-brand-tag"><span class="badge badge-brand">${a.brand}</span></div>
          <img src="${a.image}" alt="${a.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.name}</h3>
          <div class="card-specs-pill">
            <span>💾 ${a.storage}</span>
            <span>•</span>
            <span>⚡ ${a.ram} RAM</span>
          </div>
          
          <div class="lipa-box">
            <span class="lipa-label">Lipa Mdogo Mdogo</span>
            <div class="lipa-values">
              <span class="lipa-deposit">Dep: ${t.currency} ${a.deposit.toLocaleString()}</span>
              <span class="lipa-daily">${t.currency} ${a.dailyPayment}/day</span>
            </div>
          </div>

          <div class="card-footer">
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-call btn-sm view-details-btn" data-id="${a.id}" style="flex: 1;">
                Details
              </button>
              <a href="${n}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="flex: 1.3;">
                💬 Ask WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `}).join(""),r.querySelectorAll(".view-details-btn").forEach(a=>{a.addEventListener("click",s=>{const n=s.currentTarget.dataset.id;k(n)})})}function y(r){switch(r){case"IN_STOCK":return'<span class="badge badge-in-stock">✓ IN STOCK</span>';case"LOW_STOCK":return'<span class="badge badge-low-stock">⚡ FEW LEFT</span>';case"OUT_OF_STOCK":return'<span class="badge badge-out-stock">✖ OUT OF STOCK</span>';default:return'<span class="badge badge-in-stock">✓ IN STOCK</span>'}}function L(){const r=document.getElementById("phoneModalOverlay"),e=document.getElementById("modalCloseBtn");e&&e.addEventListener("click",u),r&&r.addEventListener("click",t=>{t.target===r&&u()})}function k(r){var n,g,p,v;const e=d.getPhoneById(r);if(!e)return;const t=d.config,i=document.getElementById("phoneModalOverlay"),a=document.getElementById("modalBody"),s=m(t.whatsappNumber,e,"BUY");a.innerHTML=`
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div style="display: flex; gap: 1rem; align-items: flex-start;">
        <div style="width: 110px; height: 110px; background-color: var(--bg-subtle); border-radius: var(--radius-md); padding: 0.5rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          <img src="${e.image}" alt="${e.name}" style="max-height: 100%; width: auto; object-fit: contain;" />
        </div>
        <div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.35rem;">
            ${y(e.stockStatus)}
            <span class="badge badge-brand">${e.brand}</span>
          </div>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">${e.name}</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">${e.ram} RAM | ${e.storage} Storage</p>
          <p style="font-size: 0.95rem; font-weight: 800; color: var(--primary-600); margin-top: 0.35rem;">Cash Price: ${t.currency} ${e.cashPrice.toLocaleString()}</p>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, var(--accent-50), #fff); border: 1px solid var(--accent-500); border-radius: var(--radius-md); padding: 1rem;">
        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--accent-700); margin-bottom: 0.5rem; font-weight: 800;">⚡ Lipa Mdogo Mdogo Payment Term</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; text-align: center;">
          <div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted);">INITIAL DEPOSIT</span>
            <strong style="font-size: 0.95rem; color: var(--accent-600);">${t.currency} ${e.deposit.toLocaleString()}</strong>
          </div>
          <div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted);">DAILY RATE</span>
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${t.currency} ${e.dailyPayment}</strong>
          </div>
          <div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="display: block; font-size: 0.7rem; color: var(--text-muted);">WEEKLY RATE</span>
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${t.currency} ${e.weeklyPayment}</strong>
          </div>
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Key Specifications</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.85rem;">
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">📺 ${((n=e.specs)==null?void 0:n.display)||"HD+ Display"}</div>
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">🔋 ${((g=e.specs)==null?void 0:g.battery)||"5000 mAh"}</div>
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">📷 ${((p=e.specs)==null?void 0:p.mainCamera)||"50 MP Dual Camera"}</div>
          <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">⚙️ ${((v=e.specs)==null?void 0:v.processor)||"Octa-Core Processor"}</div>
        </div>
      </div>

      <div style="background-color: var(--primary-50); border: 1px solid var(--primary-100); border-radius: var(--radius-md); padding: 0.75rem; font-size: 0.8rem; color: var(--primary-800);">
        <strong>📌 What do you need?</strong> Original National ID + Active M-Pesa line registered under your ID. Deposit paid upon receiving phone.
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
        <a href="${s}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">
          💬 Order on WhatsApp Now
        </a>
        <a href="tel:${t.salesPhone}" class="btn btn-call btn-block">
          📞 Call Sales Agent (${t.salesPhone})
        </a>
      </div>
    </div>
  `,i.classList.add("is-open"),document.body.style.overflow="hidden"}function u(){const r=document.getElementById("phoneModalOverlay");r&&(r.classList.remove("is-open"),document.body.style.overflow="")}function $(){b()}function b(){const r=d.config,e=document.getElementById("stickyWaBtn"),t=document.getElementById("stickyCallBtn");e&&(e.href=m(r.whatsappNumber,null,"GENERAL")),t&&(t.href=`tel:${r.salesPhone}`)}

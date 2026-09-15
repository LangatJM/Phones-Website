import{A as O,s as r,d as C,i as k,u as P,g as T,a as A}from"./store-Da1MZaWI.js";document.addEventListener("DOMContentLoaded",()=>{$()});function $(){const n=document.getElementById("adminLoginOverlay"),t=document.getElementById("adminContent"),l=document.getElementById("loginForm"),s=document.getElementById("loginError"),o=document.getElementById("loginPassword"),a=document.getElementById("togglePwdVisibility");if(sessionStorage.getItem("adminAuth")==="granted"){E(n,t);return}n&&(n.style.display="flex"),t&&(t.style.display="none"),a&&o&&a.addEventListener("click",()=>{const i=o.type==="text";o.type=i?"password":"text",a.textContent=i?"👁️":"🙈"}),l&&l.addEventListener("submit",i=>{i.preventDefault(),o.value===O?(sessionStorage.setItem("adminAuth","granted"),s&&(s.style.display="none"),E(n,t)):(s&&(s.style.display="block"),o.value="",o.focus(),l.style.animation="shake 0.35s ease",setTimeout(()=>{l.style.animation=""},400))})}function E(n,t){n&&(n.style.display="none"),t&&(t.style.display="block"),_(),F(),K(),N()}function _(){const n=document.querySelector(".admin-header-bar > div:last-child");if(!n||document.getElementById("logoutBtn"))return;const t=document.createElement("button");t.id="logoutBtn",t.className="btn btn-call btn-sm",t.innerHTML="🚪 Logout",t.addEventListener("click",()=>{sessionStorage.removeItem("adminAuth"),location.reload()}),n.appendChild(t)}const w=document.createElement("style");w.textContent=`@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
}`;document.head.appendChild(w);let g=null;function F(){y(),h(),U(),D(),r.subscribe(()=>{y(),h(),v()});const n=document.getElementById("adminSearchInput");n&&n.addEventListener("input",()=>y());const t=document.getElementById("adminStatusFilter");t&&t.addEventListener("change",()=>y())}function h(){const n=r.getPhones(),t=document.getElementById("statTotalPhones"),l=document.getElementById("statInStock"),s=document.getElementById("statLowStock"),o=document.getElementById("statOutStock");t&&(t.textContent=n.length),l&&(l.textContent=n.filter(a=>a.stockStatus==="IN_STOCK").length),s&&(s.textContent=n.filter(a=>a.stockStatus==="LOW_STOCK").length),o&&(o.textContent=n.filter(a=>a.stockStatus==="OUT_OF_STOCK").length)}function y(){var i,d;const n=document.getElementById("adminCardList"),t=document.getElementById("adminTableBody"),l=(((i=document.getElementById("adminSearchInput"))==null?void 0:i.value)||"").toLowerCase().trim(),s=((d=document.getElementById("adminStatusFilter"))==null?void 0:d.value)||"ALL",o=r.getPhones().filter(e=>{const c=!l||e.name.toLowerCase().includes(l)||e.brand.toLowerCase().includes(l),m=s==="ALL"||e.stockStatus===s;return c&&m}),a=r.config.currency;n&&(o.length===0?n.innerHTML='<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No phones found in inventory.</div>':n.innerHTML=o.map(e=>`
        <div class="admin-inventory-card">
          <div class="admin-card-top">
            <img src="${e.image}" alt="${e.name}" class="admin-card-thumb" />
            <div class="admin-card-info">
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">${e.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${e.brand} • ${e.ram}/${e.storage}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-600); margin-top: 0.2rem;">
                Deposit: ${a} ${e.deposit.toLocaleString()} | ${a} ${e.dailyPayment}/day
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; font-weight: 600;">Stock Status:</span>
            <select class="form-select status-switcher" data-id="${e.id}" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.8rem;">
              <option value="IN_STOCK" ${e.stockStatus==="IN_STOCK"?"selected":""}>🟢 IN STOCK</option>
              <option value="LOW_STOCK" ${e.stockStatus==="LOW_STOCK"?"selected":""}>⚡ LOW STOCK</option>
              <option value="OUT_OF_STOCK" ${e.stockStatus==="OUT_OF_STOCK"?"selected":""}>🔴 OUT OF STOCK</option>
            </select>
          </div>
          <div class="admin-card-actions">
            <button class="btn btn-call btn-sm edit-phone-btn" data-id="${e.id}">✏️ Edit</button>
            <button class="btn btn-call btn-sm delete-phone-btn" data-id="${e.id}" style="color: #ef4444;">🗑️ Delete</button>
          </div>
        </div>
      `).join("")),t&&(o.length===0?t.innerHTML='<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No inventory items found.</td></tr>':t.innerHTML=o.map(e=>`
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${e.image}" alt="${e.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: var(--radius-sm); background: var(--bg-subtle);" />
              <div>
                <strong style="display: block;">${e.name}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${e.brand}</span>
              </div>
            </div>
          </td>
          <td>${e.ram} / ${e.storage}</td>
          <td>${a} ${e.cashPrice.toLocaleString()}</td>
          <td>
            <strong style="color: var(--accent-600);">${a} ${e.deposit.toLocaleString()}</strong>
            <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">${a} ${e.dailyPayment}/day</span>
          </td>
          <td>
            <select class="form-select status-switcher" data-id="${e.id}" style="padding: 0.35rem 0.5rem; font-size: 0.8rem;">
              <option value="IN_STOCK" ${e.stockStatus==="IN_STOCK"?"selected":""}>🟢 IN STOCK</option>
              <option value="LOW_STOCK" ${e.stockStatus==="LOW_STOCK"?"selected":""}>⚡ LOW STOCK</option>
              <option value="OUT_OF_STOCK" ${e.stockStatus==="OUT_OF_STOCK"?"selected":""}>🔴 OUT OF STOCK</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-call btn-sm edit-phone-btn" data-id="${e.id}">Edit</button>
              <button class="btn btn-call btn-sm delete-phone-btn" data-id="${e.id}" style="color: #ef4444;">Delete</button>
            </div>
          </td>
        </tr>
      `).join("")),document.querySelectorAll(".status-switcher").forEach(e=>{e.addEventListener("change",c=>{const m=c.target.dataset.id,u=c.target.value;r.updateStockStatus(m,u)})}),document.querySelectorAll(".edit-phone-btn").forEach(e=>{e.addEventListener("click",c=>{b(c.target.dataset.id)})}),document.querySelectorAll(".delete-phone-btn").forEach(e=>{e.addEventListener("click",c=>{const m=c.target.dataset.id,u=r.getPhoneById(m);u&&confirm(`Are you sure you want to delete "${u.name}" from inventory?`)&&r.deletePhone(m)})})}function U(){const n=document.getElementById("configWaNumber"),t=document.getElementById("configSalesPhone");n&&(n.value=r.config.whatsappNumber),t&&(t.value=r.config.salesPhone)}function K(){const n=document.getElementById("btnAddNewPhone"),t=document.getElementById("fabAddPhone"),l=document.getElementById("adminModalOverlay"),s=document.getElementById("adminModalCloseBtn"),o=document.getElementById("phoneForm"),a=document.getElementById("settingsForm");n&&n.addEventListener("click",()=>b()),t&&t.addEventListener("click",()=>b()),s&&s.addEventListener("click",f),l&&l.addEventListener("click",i=>{i.target===l&&f()}),o&&o.addEventListener("submit",async i=>{i.preventDefault();const d=document.getElementById("btnSavePhone");d&&(d.disabled=!0,d.textContent="⏳ Saving...");const e={name:document.getElementById("inputName").value.trim(),brand:document.getElementById("inputBrand").value.trim(),ram:document.getElementById("inputRam").value.trim(),storage:document.getElementById("inputStorage").value.trim(),cashPrice:Number(document.getElementById("inputCashPrice").value),deposit:Number(document.getElementById("inputDeposit").value),dailyPayment:Number(document.getElementById("inputDaily").value),weeklyPayment:Number(document.getElementById("inputWeekly").value),stockStatus:document.getElementById("inputStockStatus").value,image:C(document.getElementById("inputImage").value.trim())||"/images/hero-phone.png",description:document.getElementById("inputDescription").value.trim()};try{g?await r.updatePhone(g,e):await r.addPhone(e)}catch(c){console.error("Error saving phone item:",c)}finally{d&&(d.disabled=!1,d.textContent="💾 Save Smartphone Item"),f()}}),a&&a.addEventListener("submit",i=>{i.preventDefault();const d=document.getElementById("configWaNumber").value.trim(),e=document.getElementById("configSalesPhone").value.trim();r.saveConfig({whatsappNumber:d,salesPhone:e}),alert("Store configuration updated successfully!")})}function N(){const n=document.getElementById("inputImageFile"),t=document.getElementById("inputImage"),l=document.getElementById("imagePreviewBox"),s=document.getElementById("uploadPlaceholder");if(!n||!t||!l)return;n.addEventListener("change",a=>{var d;const i=(d=a.target.files)==null?void 0:d[0];i&&I(i,t,l,s)});const o=document.getElementById("imageUploadZone");o&&(o.addEventListener("dragover",a=>{a.preventDefault(),o.style.borderColor="var(--primary-500)"}),o.addEventListener("dragleave",()=>{o.style.borderColor=""}),o.addEventListener("drop",a=>{var d,e;a.preventDefault(),o.style.borderColor="";const i=(e=(d=a.dataTransfer)==null?void 0:d.files)==null?void 0:e[0];i&&i.type.startsWith("image/")&&I(i,t,l,s)})),t.addEventListener("input",()=>{const a=t.value.trim(),i=C(a);i!==a&&(t.value=i),i?p(l,s,i):S(l,s)})}async function I(n,t,l,s){if(n.size>5*1024*1024){alert("Image is too large (max 5 MB). Please choose a smaller file.");return}const o=document.getElementById("imageUploadStatus"),a=(d,e=!1)=>{o&&(o.style.display="block",o.style.background=e?"rgba(239, 68, 68, 0.15)":"rgba(34, 197, 94, 0.15)",o.style.color=e?"#ef4444":"#16a34a",o.textContent=d)},i=new FileReader;i.onload=async d=>{const e=d.target.result;if(p(l,s,e),k()){a("☁️ Uploading photo to Supabase Cloud Storage...");try{const c=await P(n);t.value=c,p(l,s,c),a("✅ Uploaded to Cloud Storage! Photo will appear on all devices.")}catch(c){console.error("Cloud image upload failed:",c),a("⚠️ Cloud upload failed: "+(c.message||"Check storage bucket permissions"),!0),t.value=e}}else t.value=e,a("⚠️ Saved in local browser memory only. Connect Supabase below to make photos visible on all devices.",!0)},i.readAsDataURL(n)}function p(n,t,l){n.src=l,n.classList.add("has-image"),t&&(t.style.display="none")}function S(n,t){n.src="",n.classList.remove("has-image"),t&&(t.style.display="")}function b(n=null){g=n;const t=document.getElementById("adminModalOverlay"),l=document.getElementById("adminModalTitle"),s=document.getElementById("phoneForm");if(!t||!s)return;if(n){const e=r.getPhoneById(n);if(!e)return;l.textContent="Edit Smartphone Item",document.getElementById("inputName").value=e.name,document.getElementById("inputBrand").value=e.brand,document.getElementById("inputRam").value=e.ram,document.getElementById("inputStorage").value=e.storage,document.getElementById("inputCashPrice").value=e.cashPrice,document.getElementById("inputDeposit").value=e.deposit,document.getElementById("inputDaily").value=e.dailyPayment,document.getElementById("inputWeekly").value=e.weeklyPayment,document.getElementById("inputStockStatus").value=e.stockStatus,document.getElementById("inputImage").value=e.image,document.getElementById("inputDescription").value=e.description||""}else l.textContent="Add New Smartphone",s.reset();t.classList.add("is-open"),document.body.style.overflow="hidden";const o=document.getElementById("inputImage"),a=document.getElementById("imagePreviewBox"),i=document.getElementById("uploadPlaceholder"),d=document.getElementById("imageUploadStatus");if(d&&(d.style.display="none",d.textContent=""),o&&a){const e=o.value.trim();e?p(a,i,e):S(a,i)}}function f(){const n=document.getElementById("adminModalOverlay");n&&(n.classList.remove("is-open"),document.body.style.overflow=""),g=null;const t=document.getElementById("inputImageFile"),l=document.getElementById("imagePreviewBox"),s=document.getElementById("uploadPlaceholder"),o=document.getElementById("imageUploadStatus");t&&(t.value=""),l&&s&&S(l,s),o&&(o.style.display="none",o.textContent="")}const B=`-- 1. Create phones inventory table
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
drop policy if exists "Allow public read on phones" on public.phones;
create policy "Allow public read on phones" on public.phones 
for select using (true);

-- 4. Allow insert/update/delete with anon key
drop policy if exists "Allow anon insert on phones" on public.phones;
create policy "Allow anon insert on phones" on public.phones 
for insert with check (true);

drop policy if exists "Allow anon update on phones" on public.phones;
create policy "Allow anon update on phones" on public.phones 
for update using (true);

drop policy if exists "Allow anon delete on phones" on public.phones;
create policy "Allow anon delete on phones" on public.phones 
for delete using (true);

-- 5. Create storage bucket for uploaded phone images
insert into storage.buckets (id, name, public)
values ('phone-images', 'phone-images', true)
on conflict (id) do nothing;

-- 6. Storage security policies for phone-images bucket
drop policy if exists "Public images are viewable by everyone" on storage.objects;
create policy "Public images are viewable by everyone" on storage.objects
for select using (bucket_id = 'phone-images');

drop policy if exists "Anyone can upload phone images" on storage.objects;
create policy "Anyone can upload phone images" on storage.objects
for insert with check (bucket_id = 'phone-images');

drop policy if exists "Anyone can update phone images" on storage.objects;
create policy "Anyone can update phone images" on storage.objects
for update using (bucket_id = 'phone-images');`;function v(){const n=document.getElementById("cloudStatusBadge"),t=document.getElementById("btnSyncSeedCatalog");n&&(r.cloudConnected?(n.textContent="🟢 Connected (Supabase Cloud)",n.style.backgroundColor="rgba(34, 197, 94, 0.15)",n.style.color="#16a34a",t&&(t.style.display="inline-block")):k()?(n.textContent="🟡 Connecting to Supabase...",n.style.backgroundColor="rgba(234, 179, 8, 0.15)",n.style.color="#ca8a04",t&&(t.style.display="inline-block")):(n.textContent="🔴 Offline (Local Storage)",n.style.backgroundColor="rgba(239, 68, 68, 0.15)",n.style.color="#ef4444",t&&(t.style.display="none")))}function D(){const n=document.getElementById("supabaseConfigForm"),t=document.getElementById("inputSupabaseUrl"),l=document.getElementById("inputSupabaseKey"),s=document.getElementById("supabaseFeedback"),o=document.getElementById("btnSyncSeedCatalog"),a=document.getElementById("btnToggleSqlGuide"),i=document.getElementById("supabaseSqlBox"),d=document.getElementById("supabaseSqlCode"),e=document.getElementById("btnCopySql"),{url:c,key:m}=T();t&&c&&(t.value=c),l&&m&&(l.value=m),d&&(d.textContent=B),v(),n&&n.addEventListener("submit",async u=>{u.preventDefault();const x=t.value.trim(),L=l.value.trim();A(x,L),s&&(s.style.display="block",s.style.background="rgba(59, 130, 246, 0.15)",s.style.color="var(--primary-600)",s.textContent="🔄 Connecting to Supabase..."),await r.initCloudSync(),v(),s&&(r.cloudConnected?(s.style.background="rgba(34, 197, 94, 0.15)",s.style.color="#16a34a",s.textContent="✅ Connected to Supabase! Smartphone images and inventory are now synced across all devices in real time."):(s.style.background="rgba(239, 68, 68, 0.15)",s.style.color="#ef4444",s.textContent="⚠️ Could not connect to Supabase. Please check your Project URL, anon key, and ensure the SQL setup was run in Supabase SQL Editor."))}),o&&o.addEventListener("click",async()=>{if(confirm("This will upload all smartphones in your local catalog to Supabase. Continue?")){o.disabled=!0,o.textContent="⏳ Uploading to Cloud...";try{await r.syncAllToSupabase(),alert("✅ Catalog successfully synced to Supabase Cloud!")}catch(u){alert("❌ Sync failed: "+(u.message||"Check connection"))}finally{o.disabled=!1,o.textContent="⚡ Upload Seed Catalog to Cloud"}}}),a&&i&&a.addEventListener("click",()=>{const u=i.style.display!=="none";i.style.display=u?"none":"block",a.textContent=u?"📋 Supabase SQL & Setup Guide":"✕ Hide SQL Guide"}),e&&e.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(B),e.textContent="✅ Copied!",setTimeout(()=>{e.textContent="📋 Copy SQL"},2e3)}catch{e.textContent="Select & copy manually"}})}

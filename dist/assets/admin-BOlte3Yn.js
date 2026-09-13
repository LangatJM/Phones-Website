import{A as L,s as r,d as b}from"./store-BAgcX4VC.js";document.addEventListener("DOMContentLoaded",()=>{O()});function O(){const e=document.getElementById("adminLoginOverlay"),t=document.getElementById("adminContent"),a=document.getElementById("loginForm"),l=document.getElementById("loginError"),d=document.getElementById("loginPassword"),o=document.getElementById("togglePwdVisibility");if(sessionStorage.getItem("adminAuth")==="granted"){I(e,t);return}e&&(e.style.display="flex"),t&&(t.style.display="none"),o&&d&&o.addEventListener("click",()=>{const i=d.type==="text";d.type=i?"password":"text",o.textContent=i?"👁️":"🙈"}),a&&a.addEventListener("submit",i=>{i.preventDefault(),d.value===L?(sessionStorage.setItem("adminAuth","granted"),l&&(l.style.display="none"),I(e,t)):(l&&(l.style.display="block"),d.value="",d.focus(),a.style.animation="shake 0.35s ease",setTimeout(()=>{a.style.animation=""},400))})}function I(e,t){e&&(e.style.display="none"),t&&(t.style.display="block"),C(),k(),P(),T()}function C(){const e=document.querySelector(".admin-header-bar > div:last-child");if(!e||document.getElementById("logoutBtn"))return;const t=document.createElement("button");t.id="logoutBtn",t.className="btn btn-call btn-sm",t.innerHTML="🚪 Logout",t.addEventListener("click",()=>{sessionStorage.removeItem("adminAuth"),location.reload()}),e.appendChild(t)}const h=document.createElement("style");h.textContent=`@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
}`;document.head.appendChild(h);let y=null;function k(){g(),B(),w(),r.subscribe(()=>{g(),B()});const e=document.getElementById("adminSearchInput");e&&e.addEventListener("input",()=>g());const t=document.getElementById("adminStatusFilter");t&&t.addEventListener("change",()=>g())}function B(){const e=r.getPhones(),t=document.getElementById("statTotalPhones"),a=document.getElementById("statInStock"),l=document.getElementById("statLowStock"),d=document.getElementById("statOutStock");t&&(t.textContent=e.length),a&&(a.textContent=e.filter(o=>o.stockStatus==="IN_STOCK").length),l&&(l.textContent=e.filter(o=>o.stockStatus==="LOW_STOCK").length),d&&(d.textContent=e.filter(o=>o.stockStatus==="OUT_OF_STOCK").length)}function g(){var i,s;const e=document.getElementById("adminCardList"),t=document.getElementById("adminTableBody"),a=(((i=document.getElementById("adminSearchInput"))==null?void 0:i.value)||"").toLowerCase().trim(),l=((s=document.getElementById("adminStatusFilter"))==null?void 0:s.value)||"ALL",d=r.getPhones().filter(n=>{const c=!a||n.name.toLowerCase().includes(a)||n.brand.toLowerCase().includes(a),m=l==="ALL"||n.stockStatus===l;return c&&m}),o=r.config.currency;e&&(d.length===0?e.innerHTML='<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No phones found in inventory.</div>':e.innerHTML=d.map(n=>`
        <div class="admin-inventory-card">
          <div class="admin-card-top">
            <img src="${n.image}" alt="${n.name}" class="admin-card-thumb" />
            <div class="admin-card-info">
              <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">${n.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${n.brand} • ${n.ram}/${n.storage}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-600); margin-top: 0.2rem;">
                Deposit: ${o} ${n.deposit.toLocaleString()} | ${o} ${n.dailyPayment}/day
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; font-weight: 600;">Stock Status:</span>
            <select class="form-select status-switcher" data-id="${n.id}" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.8rem;">
              <option value="IN_STOCK" ${n.stockStatus==="IN_STOCK"?"selected":""}>🟢 IN STOCK</option>
              <option value="LOW_STOCK" ${n.stockStatus==="LOW_STOCK"?"selected":""}>⚡ LOW STOCK</option>
              <option value="OUT_OF_STOCK" ${n.stockStatus==="OUT_OF_STOCK"?"selected":""}>🔴 OUT OF STOCK</option>
            </select>
          </div>
          <div class="admin-card-actions">
            <button class="btn btn-call btn-sm edit-phone-btn" data-id="${n.id}">✏️ Edit</button>
            <button class="btn btn-call btn-sm delete-phone-btn" data-id="${n.id}" style="color: #ef4444;">🗑️ Delete</button>
          </div>
        </div>
      `).join("")),t&&(d.length===0?t.innerHTML='<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No inventory items found.</td></tr>':t.innerHTML=d.map(n=>`
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${n.image}" alt="${n.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: var(--radius-sm); background: var(--bg-subtle);" />
              <div>
                <strong style="display: block;">${n.name}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${n.brand}</span>
              </div>
            </div>
          </td>
          <td>${n.ram} / ${n.storage}</td>
          <td>${o} ${n.cashPrice.toLocaleString()}</td>
          <td>
            <strong style="color: var(--accent-600);">${o} ${n.deposit.toLocaleString()}</strong>
            <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">${o} ${n.dailyPayment}/day</span>
          </td>
          <td>
            <select class="form-select status-switcher" data-id="${n.id}" style="padding: 0.35rem 0.5rem; font-size: 0.8rem;">
              <option value="IN_STOCK" ${n.stockStatus==="IN_STOCK"?"selected":""}>🟢 IN STOCK</option>
              <option value="LOW_STOCK" ${n.stockStatus==="LOW_STOCK"?"selected":""}>⚡ LOW STOCK</option>
              <option value="OUT_OF_STOCK" ${n.stockStatus==="OUT_OF_STOCK"?"selected":""}>🔴 OUT OF STOCK</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-call btn-sm edit-phone-btn" data-id="${n.id}">Edit</button>
              <button class="btn btn-call btn-sm delete-phone-btn" data-id="${n.id}" style="color: #ef4444;">Delete</button>
            </div>
          </td>
        </tr>
      `).join("")),document.querySelectorAll(".status-switcher").forEach(n=>{n.addEventListener("change",c=>{const m=c.target.dataset.id,u=c.target.value;r.updateStockStatus(m,u)})}),document.querySelectorAll(".edit-phone-btn").forEach(n=>{n.addEventListener("click",c=>{v(c.target.dataset.id)})}),document.querySelectorAll(".delete-phone-btn").forEach(n=>{n.addEventListener("click",c=>{const m=c.target.dataset.id,u=r.getPhoneById(m);u&&confirm(`Are you sure you want to delete "${u.name}" from inventory?`)&&r.deletePhone(m)})})}function w(){const e=document.getElementById("configWaNumber"),t=document.getElementById("configSalesPhone");e&&(e.value=r.config.whatsappNumber),t&&(t.value=r.config.salesPhone)}function P(){const e=document.getElementById("btnAddNewPhone"),t=document.getElementById("fabAddPhone"),a=document.getElementById("adminModalOverlay"),l=document.getElementById("adminModalCloseBtn"),d=document.getElementById("phoneForm"),o=document.getElementById("settingsForm");e&&e.addEventListener("click",()=>v()),t&&t.addEventListener("click",()=>v()),l&&l.addEventListener("click",f),a&&a.addEventListener("click",i=>{i.target===a&&f()}),d&&d.addEventListener("submit",i=>{i.preventDefault();const s={name:document.getElementById("inputName").value.trim(),brand:document.getElementById("inputBrand").value.trim(),ram:document.getElementById("inputRam").value.trim(),storage:document.getElementById("inputStorage").value.trim(),cashPrice:Number(document.getElementById("inputCashPrice").value),deposit:Number(document.getElementById("inputDeposit").value),dailyPayment:Number(document.getElementById("inputDaily").value),weeklyPayment:Number(document.getElementById("inputWeekly").value),stockStatus:document.getElementById("inputStockStatus").value,image:b(document.getElementById("inputImage").value.trim())||"/images/infinix-hot-60i.png",description:document.getElementById("inputDescription").value.trim()};y?r.updatePhone(y,s):r.addPhone(s),f()}),o&&o.addEventListener("submit",i=>{i.preventDefault();const s=document.getElementById("configWaNumber").value.trim(),n=document.getElementById("configSalesPhone").value.trim();r.saveConfig({whatsappNumber:s,salesPhone:n}),alert("Store configuration updated successfully!")})}function T(){const e=document.getElementById("inputImageFile"),t=document.getElementById("inputImage"),a=document.getElementById("imagePreviewBox"),l=document.getElementById("uploadPlaceholder");if(!e||!t||!a)return;e.addEventListener("change",o=>{var s;const i=(s=o.target.files)==null?void 0:s[0];i&&S(i,t,a,l)});const d=document.getElementById("imageUploadZone");d&&(d.addEventListener("dragover",o=>{o.preventDefault(),d.style.borderColor="var(--primary-500)"}),d.addEventListener("dragleave",()=>{d.style.borderColor=""}),d.addEventListener("drop",o=>{var s,n;o.preventDefault(),d.style.borderColor="";const i=(n=(s=o.dataTransfer)==null?void 0:s.files)==null?void 0:n[0];i&&i.type.startsWith("image/")&&S(i,t,a,l)})),t.addEventListener("input",()=>{const o=t.value.trim(),i=b(o);i!==o&&(t.value=i),i?p(a,l,i):E(a,l)})}function S(e,t,a,l){if(e.size>4*1024*1024){alert("Image is too large (max 4 MB). Please choose a smaller file.");return}const d=new FileReader;d.onload=o=>{const i=o.target.result;t.value=i,p(a,l,i)},d.readAsDataURL(e)}function p(e,t,a){e.src=a,e.classList.add("has-image"),t&&(t.style.display="none")}function E(e,t){e.src="",e.classList.remove("has-image"),t&&(t.style.display="")}function v(e=null){y=e;const t=document.getElementById("adminModalOverlay"),a=document.getElementById("adminModalTitle"),l=document.getElementById("phoneForm");if(!t||!l)return;if(e){const s=r.getPhoneById(e);if(!s)return;a.textContent="Edit Smartphone Item",document.getElementById("inputName").value=s.name,document.getElementById("inputBrand").value=s.brand,document.getElementById("inputRam").value=s.ram,document.getElementById("inputStorage").value=s.storage,document.getElementById("inputCashPrice").value=s.cashPrice,document.getElementById("inputDeposit").value=s.deposit,document.getElementById("inputDaily").value=s.dailyPayment,document.getElementById("inputWeekly").value=s.weeklyPayment,document.getElementById("inputStockStatus").value=s.stockStatus,document.getElementById("inputImage").value=s.image,document.getElementById("inputDescription").value=s.description||""}else a.textContent="Add New Smartphone",l.reset();t.classList.add("is-open"),document.body.style.overflow="hidden";const d=document.getElementById("inputImage"),o=document.getElementById("imagePreviewBox"),i=document.getElementById("uploadPlaceholder");if(d&&o){const s=d.value.trim();s?p(o,i,s):E(o,i)}}function f(){const e=document.getElementById("adminModalOverlay");e&&(e.classList.remove("is-open"),document.body.style.overflow=""),y=null;const t=document.getElementById("inputImageFile"),a=document.getElementById("imagePreviewBox"),l=document.getElementById("uploadPlaceholder");t&&(t.value=""),a&&l&&E(a,l)}

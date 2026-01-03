// Minimal app.js providing Users and Settings features used by pages/*
(function(){
  // --- Members (users) storage ---
  function loadMembers(){ try{ return JSON.parse(localStorage.getItem('inventory_users')) || []; }catch(e){return []} }
  function saveMembers(list){ localStorage.setItem('inventory_users', JSON.stringify(list)); }

  // Render users table
  function renderUsersPage(){
    const tbody = document.getElementById('users-table-body'); if(!tbody) return;
    const members = loadMembers();
    const q = (document.getElementById('users-search') && document.getElementById('users-search').value || '').toLowerCase();
    tbody.innerHTML = '';
    members.filter(m=> !q || (m.name && m.name.toLowerCase().includes(q)) || (m.email && m.email.toLowerCase().includes(q)) || (m.mobile && m.mobile.toLowerCase().includes(q))).forEach(m=>{
      const tr = document.createElement('tr'); tr.className = 'border-b';
      const tdPhoto = document.createElement('td'); tdPhoto.className='px-4 py-3'; const img=document.createElement('img'); img.src=m.picture||'../assets/images/default-avatar.png'; img.className='w-12 h-12 rounded-md object-cover'; tdPhoto.appendChild(img);
      const tdName = document.createElement('td'); tdName.className='px-4 py-3 font-medium'; tdName.textContent = m.name||'';
      const tdMobile = document.createElement('td'); tdMobile.className='px-4 py-3'; tdMobile.textContent = m.mobile||'';
      const tdEmail = document.createElement('td'); tdEmail.className='px-4 py-3'; tdEmail.textContent = m.email||'';
      const tdStatus = document.createElement('td'); tdStatus.className='px-4 py-3'; const spanStatus=document.createElement('span'); spanStatus.className=`px-3 py-1 rounded-full text-sm ${m.status==='Active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`; spanStatus.textContent = m.status||'Active'; tdStatus.appendChild(spanStatus);
      const tdOp = document.createElement('td'); tdOp.className='px-4 py-3'; tdOp.textContent = m.status==='Active' ? '' : '';
      const tdAction = document.createElement('td'); tdAction.className='px-4 py-3 flex items-center gap-2';
      const btnEdit = document.createElement('button'); btnEdit.title='Edit'; btnEdit.className='p-2 rounded-md hover:bg-gray-100'; btnEdit.innerHTML='<i class="fas fa-pen text-blue-600"></i>';
      btnEdit.addEventListener('click', ()=> openMemberModal(m));
      const btnDelete = document.createElement('button'); btnDelete.title='Delete'; btnDelete.className='p-2 rounded-md hover:bg-gray-100'; btnDelete.innerHTML='<i class="fas fa-trash text-red-600"></i>';
      btnDelete.addEventListener('click', ()=>{ if(!confirm('Delete member?')) return; let members=loadMembers(); members=members.filter(x=>x.id!==m.id); saveMembers(members); renderUsersPage(); });
      const btnLogin = document.createElement('button'); btnLogin.title='Login'; btnLogin.className='p-2 rounded-md bg-gray-100'; btnLogin.innerHTML='<i class="fas fa-sign-in-alt text-gray-700"></i>';
      btnLogin.addEventListener('click', ()=>{ alert('Simulated login as '+(m.name||m.email)); });
      tdAction.appendChild(btnEdit); tdAction.appendChild(btnDelete); tdAction.appendChild(btnLogin);
      tr.appendChild(tdPhoto); tr.appendChild(tdName); tr.appendChild(tdMobile); tr.appendChild(tdEmail); tr.appendChild(tdStatus); tr.appendChild(tdOp); tr.appendChild(tdAction);
      tbody.appendChild(tr);
    });
  }

  // View item modal
  function openViewItemModal(item){
    const modal = document.getElementById('item-view-modal'); if(!modal) return;
    const content = document.getElementById('view-item-content');
    if(content){
      const members = loadMembers();
      const user = members.find(m => m.id === item.user);
      const userName = user ? (user.name || user.email) : 'Unassigned';
      content.innerHTML = `
      <div class="mb-4">
        <img src="${item.image || 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=No+Image'}" alt="${item.name}" class="w-full h-48 object-cover rounded-lg">
      </div>
      <div>
        <p class="text-sm text-gray-500">ID</p>
        <p class="font-semibold text-gray-800">${item.sku||item.id||'N/A'}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Name</p>
        <p class="font-semibold">${item.name||''}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Assigned User</p>
        <p class="font-semibold text-purple-600">${userName}</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-sm text-gray-500">Quantity</p>
          <p class="font-semibold">${item.quantity||0}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Price</p>
          <p class="font-semibold">$${(parseFloat(item.price)||0).toFixed(2)}</p>
        </div>
      </div>
      `;
    }
    const editBtn = document.getElementById('view-item-edit');
    const delBtn = document.getElementById('view-item-delete');
    const closeBtn = document.getElementById('view-item-close');
    const closeFn = ()=>{ modal.classList.add('hidden'); };
    if(closeBtn) closeBtn.onclick = closeFn;
    if(editBtn) editBtn.onclick = ()=>{ closeFn(); openItemModal(item); };
    if(delBtn) delBtn.onclick = ()=>{ if(!confirm('Delete item "'+(item.name||item.sku||item.id)+'"?')) return; let list = loadItems(); list = list.filter(x=> (x.sku||x.id) !== (item.sku||item.id)); saveItems(list); renderItemsPage(); closeFn(); };
    modal.classList.remove('hidden');
  }
  function closeViewItemModal(){ const modal = document.getElementById('item-view-modal'); if(modal) modal.classList.add('hidden'); }

  // --- Member modal ---
  function openMemberModal(member){
    const modal = document.getElementById('user-modal'); if(!modal) return;
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = member? member.id : '';
    document.getElementById('user-pic-preview').src = member? (member.picture||'../assets/images/default-avatar.png') : '../assets/images/default-avatar.png';
    document.getElementById('user-modal-title').textContent = member? 'Edit Member':'Add Member';
    if(member){ document.getElementById('user-name').value=member.name||''; document.getElementById('user-mobile').value=member.mobile||''; document.getElementById('user-email').value=member.email||''; document.getElementById('user-status').value=member.status||'Active'; }
    modal.classList.remove('hidden');
  }

  // Wire up user page events
  document.addEventListener('DOMContentLoaded', ()=>{
    const search = document.getElementById('users-search'); if(search) search.addEventListener('input', renderUsersPage);
    const addBtn = document.getElementById('btn-add-user'); if(addBtn) addBtn.addEventListener('click', ()=> openMemberModal());
    const importInput = document.getElementById('import-members-input'); if(importInput) importInput.addEventListener('change', (e)=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ const text=r.result; const lines=text.split(/\r?\n/).filter(Boolean); const hdr=lines.shift(); const members=loadMembers(); lines.forEach(l=>{ const cols=l.split(/,\s*/); const id = cols[0]||('u'+Date.now()+Math.random()); const name=(cols[1]||'').replace(/"/g,''); const mobile=(cols[2]||'').replace(/"/g,''); const email=(cols[3]||'').replace(/"/g,''); const status=(cols[4]||'Active'); members.push({id,name,mobile,email,status,picture:'../assets/images/default-avatar.png'}); }); saveMembers(members); renderUsersPage(); alert('Import complete'); }; r.readAsText(f); });
    const importBtn = document.getElementById('btn-import-members'); if(importBtn) importBtn.addEventListener('click', ()=>{ const ii=document.getElementById('import-members-input'); if(ii) ii.click(); });
    const exportBtn = document.getElementById('btn-export-members'); if(exportBtn) exportBtn.addEventListener('click', ()=>{ const members=loadMembers(); const headers=['id','name','mobile','email','status']; const lines=[headers.join(',')]; members.forEach(m=> lines.push([m.id,`"${(m.name||'').replace(/"/g,'""')}` , `"${(m.mobile||'').replace(/"/g,'""')}`, `"${(m.email||'').replace(/"/g,'""')}`, m.status||'Active'].join(','))); const csv=lines.join('\n'); const name=`members-${new Date().toISOString().slice(0,10)}.csv`; const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); });

    // user modal submit
    const userForm = document.getElementById('user-form'); if(userForm) userForm.addEventListener('submit',(e)=>{ e.preventDefault(); const idField=document.getElementById('user-id'); const id = idField.value || ('u'+Date.now()); const name=document.getElementById('user-name').value.trim(); const mobile=document.getElementById('user-mobile').value.trim(); const email=document.getElementById('user-email').value.trim(); const status=document.getElementById('user-status').value; const pic=document.getElementById('user-pic-preview').src; let members=loadMembers(); const idx=members.findIndex(m=>m.id===id); const obj={id,name,mobile,email,status,picture:pic}; if(idx>-1) members[idx]=obj; else members.push(obj); saveMembers(members); document.getElementById('user-modal').classList.add('hidden'); renderUsersPage(); });
    const userCancel = document.getElementById('user-cancel'); if(userCancel) userCancel.addEventListener('click', ()=> document.getElementById('user-modal').classList.add('hidden'));
    // Items: open Add Item modal
    const addItemBtn = document.getElementById('btn-add-item'); if(addItemBtn) addItemBtn.addEventListener('click', ()=> openItemModal());
    const itemCancel = document.getElementById('item-cancel'); if(itemCancel) itemCancel.addEventListener('click', ()=> closeItemModal());
    const itemCancel2 = document.getElementById('item-cancel-2'); if(itemCancel2) itemCancel2.addEventListener('click', ()=> closeItemModal());
    const itemForm = document.getElementById('item-form'); if(itemForm) itemForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const idField = document.getElementById('item-id'); const id = idField.value || ('i'+Date.now());
      const sku = (document.getElementById('item-sku') && document.getElementById('item-sku').value.trim()) || id;
      const name = (document.getElementById('item-name') && document.getElementById('item-name').value.trim()) || '';
      const quantity = parseInt(document.getElementById('item-quantity').value) || 0;
      const price = parseFloat(document.getElementById('item-price').value) || 0;
      const image = (document.getElementById('item-image') && document.getElementById('item-image').value.trim()) || '';
      const user = (document.getElementById('item-user') && document.getElementById('item-user').value) || '';
      let items = loadItems(); const idx = items.findIndex(x=> (x.sku||x.id) === (sku||id)); const obj = { id, sku, name, quantity, price, image, user };
      if(idx>-1) items[idx] = Object.assign(items[idx], obj); else items.push(obj);
      saveItems(items); closeItemModal(); renderItemsPage();
    });
    // Order handlers
    const orderBtn = document.getElementById('btn-order'); if(orderBtn) orderBtn.addEventListener('click', openOrderModal);
    const orderClose = document.getElementById('order-close'); if(orderClose) orderClose.addEventListener('click', closeOrderModal);
    const orderCancel = document.getElementById('order-cancel'); if(orderCancel) orderCancel.addEventListener('click', closeOrderModal);
    const orderForm = document.getElementById('order-form'); if(orderForm) orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('order-customer-name').value.trim();
      const customerEmail = document.getElementById('order-customer-email').value.trim();
      const orderDate = document.getElementById('order-date').value;
      const deliveryDate = document.getElementById('order-delivery-date').value;
      const notes = document.getElementById('order-notes').value.trim();
      const selectedItems = [];
      const checkboxes = document.querySelectorAll('#order-items-list input[type="checkbox"]:checked');
      checkboxes.forEach(cb => {
        const qtyInput = document.querySelector(`input[type="number"][data-item-id="${cb.dataset.itemId}"]`);
        const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
        selectedItems.push({ itemId: cb.dataset.itemId, quantity: qty, price: parseFloat(cb.dataset.price) });
      });
      if(selectedItems.length === 0){
        alert('Please select at least one item to order.');
        return;
      }
      const order = {
        id: 'o' + Date.now(),
        customerName,
        customerEmail,
        orderDate,
        deliveryDate,
        notes,
        items: selectedItems,
        total: selectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        status: 'Pending'
      };
      // Save order (you can extend this to save to localStorage or send to server)
      const orders = JSON.parse(localStorage.getItem('inventory_orders') || '[]');
      orders.push(order);
      localStorage.setItem('inventory_orders', JSON.stringify(orders));
      alert('Order placed successfully!');
      closeOrderModal();
    });
    const picInput = document.getElementById('user-pic-input'); if(picInput) picInput.addEventListener('change',(e)=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ document.getElementById('user-pic-preview').src=r.result; document.getElementById('user-pic-preview').dataset.pending=r.result; }; r.readAsDataURL(f); });

    // Settings page handlers
    function loadSettings(){ try{return JSON.parse(localStorage.getItem('inventory_settings')) || {dark:false,requireAuth:true}}catch(e){return {dark:false,requireAuth:true}} }
    function saveSettings(s){ localStorage.setItem('inventory_settings', JSON.stringify(s)); }
    function setSwitchVisual(chk){ if(!chk) return; const track = chk.nextElementSibling; const knob = track ? track.nextElementSibling : null; if(chk.checked){ track && track.classList.remove('bg-gray-200'); track && track.classList.add('bg-purple-600'); if(knob) knob.style.transform='translateX(160%)'; } else { track && track.classList.remove('bg-purple-600'); track && track.classList.add('bg-gray-200'); if(knob) knob.style.transform='translateX(0)'; } }
    function applyDarkMode(enabled){
      // Inject a small stylesheet that overrides common light classes when dark mode enabled.
      const styleId = 'app-dark-styles';
      let styleEl = document.getElementById(styleId);
      if(enabled){
        if(!styleEl){
          styleEl = document.createElement('style');
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
          /* Enhanced dark-mode overrides for modern UI */
          body, main { background-color: #0f0f23 !important; color: #e2e8f0 !important; }
          .bg-white, .bg-gray-50, .bg-gray-100, .bg-purple-50, .bg-blue-50, .bg-green-50 { background-color: #1a1a2e !important; color: #cbd5e1 !important; border-color: #334155 !important; }
          .bg-gradient-to-b, .bg-gradient-to-br, .bg-gradient-to-r { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important; }
          aside { background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%) !important; box-shadow: 2px 0 10px rgba(0,0,0,0.3) !important; }
          .text-gray-600, .text-gray-500, .text-gray-700, .text-gray-800, .text-purple-800, .text-blue-800 { color: #94a3b8 !important; }
          .text-purple-600, .text-blue-600, .text-green-600 { color: #a78bfa !important; }
          .text-pink-600 { color: #f472b6 !important; }
          .border, .border-gray-100, .border-gray-200, .border-gray-300, .border-purple-50, .border-purple-100 { border-color: #334155 !important; }
          .shadow, .shadow-lg, .shadow-xl, .shadow-2xl { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3) !important; }
          input, textarea, select, button { background-color: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important; }
          input:focus, textarea:focus, select:focus { border-color: #a78bfa !important; box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1) !important; }
          .hover\\:bg-gray-50:hover, .hover\\:bg-gray-100:hover { background-color: #334155 !important; }
          .hover\\:bg-purple-700:hover { background-color: #7c3aed !important; }
          .hover\\:bg-green-600:hover { background-color: #059669 !important; }
          .hover\\:bg-red-50:hover { background-color: #dc2626 !important; }
          a { color: #c084fc !important; }
          .rounded-xl, .rounded-lg, .rounded-2xl { border-radius: 12px !important; }
          /* Card enhancements */
          .bg-white.p-6 { background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%) !important; }
          /* Modal enhancements */
          .bg-black.bg-opacity-40 { background-color: rgba(0,0,0,0.6) !important; }
          /* Button enhancements */
          .bg-purple-600 { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important; }
          .bg-green-500 { background: linear-gradient(135deg, #10b981 0%, #34d399 100%) !important; }
          .bg-blue-600 { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%) !important; }
          .bg-red-600 { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important; }
          /* Text improvements */
          h1, h2, h3, h4 { color: #f1f5f9 !important; }
          p { color: #cbd5e1 !important; }
        `;
        document.documentElement.classList.add('app-dark');
      } else {
        if(styleEl) styleEl.remove();
        document.documentElement.classList.remove('app-dark');
      }
    }
    // Inject a small set of global styles to smooth transitions and style the active sidebar
    function injectGlobalStyles(){
      const gid = 'app-global-styles';
      if(document.getElementById(gid)) return;
      const s = document.createElement('style'); s.id = gid;
      s.textContent = `
        :root { --app-transition: 220ms; }
        body, main, aside, .bg-white, .rounded-2xl, .rounded-lg { transition: background-color var(--app-transition) ease, color var(--app-transition) ease, border-color var(--app-transition) ease, box-shadow var(--app-transition) ease; }
        .sidebar-active { background: rgba(120, 70, 240, 0.06) !important; color: #c084fc !important; }
        .sidebar-active i { color: #c084fc !important; }
        .app-dark .sidebar-active { background: linear-gradient(90deg,#2b0a3f,#5b21b6) !important; color: #f3e8ff !important; }
        a[aria-current="page"] { font-weight:600; }
      `;
      document.head.appendChild(s);
    }

    // Mark the current navigation item active based on the current file name
    function markActiveNav(){
      try{
        const anchors = document.querySelectorAll('aside a');
        if(!anchors || anchors.length===0) return;
        const path = window.location.pathname.split('/').pop() || 'dashboard.html';
        anchors.forEach(a=>{
          const href = (a.getAttribute('href')||'').split('/').pop();
          if(href === path || (path === '' && href === 'index.html')){
            a.classList.add('sidebar-active');
            a.setAttribute('aria-current','page');
          } else {
            a.classList.remove('sidebar-active');
            a.removeAttribute('aria-current');
          }
        });
      }catch(e){/* ignore */}
    }

    // Apply persisted dark setting immediately so all pages show the correct theme
    try{ injectGlobalStyles(); const initial = loadSettings(); applyDarkMode(!!initial.dark); }catch(e){ /* ignore */ }
    function renderSettingsPage(){ const s=loadSettings(); const darkEl=document.getElementById('toggle-dark'); const authEl=document.getElementById('toggle-auth'); if(darkEl) darkEl.checked=!!s.dark; if(authEl) authEl.checked = s.requireAuth !== false; setSwitchVisual(darkEl); setSwitchVisual(authEl); const total=document.getElementById('settings-total-items'); if(total){ const items = JSON.parse(localStorage.getItem('inventoryItems')||'[]'); total.textContent = items.reduce((sum,i)=>sum + (i.quantity||0),0); } const low=document.getElementById('settings-low-stock'); if(low){ const items = JSON.parse(localStorage.getItem('inventoryItems')||'[]'); low.textContent = items.filter(i=>i.quantity<10).length; } }
    const darkEl = document.getElementById('toggle-dark'); if(darkEl) darkEl.addEventListener('change',(e)=>{ const s=loadSettings(); s.dark=!!e.target.checked; saveSettings(s); applyDarkMode(s.dark); setSwitchVisual(e.target); });
    const authEl = document.getElementById('toggle-auth'); if(authEl) authEl.addEventListener('change',(e)=>{ const s=loadSettings(); s.requireAuth=!!e.target.checked; saveSettings(s); setSwitchVisual(e.target); });
    const saveBtn = document.getElementById('btn-save-settings'); if(saveBtn) saveBtn.addEventListener('click', ()=>{ const s=loadSettings(); s.dark = !!(document.getElementById('toggle-dark') && document.getElementById('toggle-dark').checked); s.requireAuth = !!(document.getElementById('toggle-auth') && document.getElementById('toggle-auth').checked); saveSettings(s); applyDarkMode(s.dark); alert('Settings saved'); });
    const resetBtn = document.getElementById('btn-reset-settings'); if(resetBtn) resetBtn.addEventListener('click', ()=>{ if(!confirm('Reset settings to defaults?')) return; const defaults={dark:false,requireAuth:true}; saveSettings(defaults); renderSettingsPage(); applyDarkMode(false); alert('Settings reset'); });
    renderUsersPage(); renderSettingsPage(); renderItemsPage();
    // apply active nav highlight after rendering
    markActiveNav();
  });

  // --- Items rendering ---
  function loadItems(){ try{ return JSON.parse(localStorage.getItem('inventoryItems')) || []; }catch(e){return []} }
  function saveItems(list){ try{ localStorage.setItem('inventoryItems', JSON.stringify(list||[])); }catch(e){ /* ignore */ } }
  function renderItemsPage(){
    const container = document.getElementById('items-cards'); if(!container) return;
    const items = loadItems(); container.innerHTML = '';
    const members = loadMembers();
    items.forEach(it=>{
      const card = document.createElement('div');
      card.className = 'bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-100';

      const imageDiv = document.createElement('div');
      imageDiv.className = 'mb-4';
      const img = document.createElement('img');
      img.src = it.image || 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=No+Image';
      img.className = 'w-full h-48 object-cover rounded-lg';
      img.alt = it.name || 'Product Image';
      imageDiv.appendChild(img);

      const head = document.createElement('div');
      const title = document.createElement('h4'); title.className='text-xl font-bold text-gray-800 mb-2'; title.textContent = it.name || '';
      const idp = document.createElement('p'); idp.className='text-sm text-gray-500 mb-2'; idp.textContent = 'ID: ' + (it.sku || it.id || 'N/A');
      head.appendChild(title); head.appendChild(idp);

      const userDiv = document.createElement('div');
      userDiv.className = 'mb-3';
      const user = members.find(m => m.id === it.user);
      const userName = user ? (user.name || user.email) : 'Unassigned';
      const userP = document.createElement('p'); userP.className='text-sm text-purple-600 font-medium'; userP.innerHTML = '<i class="fas fa-user mr-1"></i>Assigned to: ' + userName;
      userDiv.appendChild(userP);

      const body = document.createElement('div'); body.className = 'mb-4';
      const qty = document.createElement('p'); qty.className='text-sm text-gray-600 mb-1'; qty.innerHTML = '<strong>Quantity:</strong> ' + (it.quantity || 0);
      const price = document.createElement('p'); price.className='text-lg font-semibold text-green-600'; price.innerHTML = '<strong>Price:</strong> $' + (parseFloat(it.price)||0).toFixed(2);
      body.appendChild(qty); body.appendChild(price);

      const footer = document.createElement('div'); footer.className = 'flex items-center justify-between';
      const left = document.createElement('div'); left.className='flex items-center gap-2';
      const viewBtn = document.createElement('button'); viewBtn.className='px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition'; viewBtn.title='View'; viewBtn.innerHTML='<i class="fas fa-eye text-blue-600"></i>';
      const editBtn = document.createElement('button'); editBtn.className='px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition'; editBtn.title='Edit'; editBtn.innerHTML='<i class="fas fa-pen"></i>';
      const orderBtn = document.createElement('button'); orderBtn.className='px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition'; orderBtn.title='Order'; orderBtn.innerHTML='<i class="fas fa-shopping-cart"></i>';
      left.appendChild(viewBtn); left.appendChild(editBtn); left.appendChild(orderBtn);

      const delBtn = document.createElement('button'); delBtn.className='px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition'; delBtn.title='Delete'; delBtn.innerHTML='<i class="fas fa-trash"></i>';

      footer.appendChild(left); footer.appendChild(delBtn);

      viewBtn.addEventListener('click', ()=> openViewItemModal(it));
      editBtn.addEventListener('click', ()=> openItemModal(it));
      orderBtn.addEventListener('click', ()=> openOrderModalForItem(it));
      delBtn.addEventListener('click', ()=>{
        if(!confirm('Delete item "'+(it.name||it.sku||it.id)+'"?')) return;
        let list = loadItems(); list = list.filter(x=> (x.sku||x.id) !== (it.sku||it.id)); saveItems(list); renderItemsPage();
      });

      card.appendChild(imageDiv); card.appendChild(head); card.appendChild(userDiv); card.appendChild(body); card.appendChild(footer);
      container.appendChild(card);
    });
  }

  // Order functionality
  function openOrderModal(){
    const modal = document.getElementById('order-modal'); if(!modal) return;
    document.getElementById('order-form').reset();
    document.getElementById('order-date').value = new Date().toISOString().split('T')[0];
    populateOrderItems();
    modal.classList.remove('hidden');
  }
  function openOrderModalForItem(item){
    openOrderModal();
    // Pre-select the item
    const checkboxes = document.querySelectorAll('#order-items-list input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if(cb.dataset.itemId === (item.sku || item.id)){
        cb.checked = true;
        updateOrderTotal();
      }
    });
  }
  function populateOrderItems(){
    const container = document.getElementById('order-items-list'); if(!container) return;
    const items = loadItems();
    container.innerHTML = '';
    if(items.length === 0){
      container.innerHTML = '<p class="text-gray-500 text-center py-4">No items available</p>';
      return;
    }
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg';
      const left = document.createElement('div');
      left.className = 'flex items-center gap-3';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.itemId = it.sku || it.id;
      checkbox.dataset.price = it.price || 0;
      checkbox.addEventListener('change', updateOrderTotal);
      const img = document.createElement('img');
      img.src = it.image || 'https://via.placeholder.com/50x50/8b5cf6/ffffff?text=No+Img';
      img.className = 'w-12 h-12 object-cover rounded';
      img.alt = it.name;
      const info = document.createElement('div');
      const nameP = document.createElement('p'); nameP.className='font-medium text-gray-800'; nameP.textContent = it.name;
      const priceP = document.createElement('p'); priceP.className='text-sm text-gray-500'; priceP.textContent = '$' + (parseFloat(it.price)||0).toFixed(2);
      info.appendChild(nameP); info.appendChild(priceP);
      left.appendChild(checkbox); left.appendChild(img); left.appendChild(info);
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '1';
      qtyInput.value = '1';
      qtyInput.className = 'w-20 px-2 py-1 border border-gray-300 rounded text-center';
      qtyInput.dataset.itemId = it.sku || it.id;
      qtyInput.addEventListener('input', updateOrderTotal);
      div.appendChild(left); div.appendChild(qtyInput);
      container.appendChild(div);
    });
  }
  function updateOrderTotal(){
    let total = 0;
    const checkboxes = document.querySelectorAll('#order-items-list input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
      const qtyInput = document.querySelector(`input[type="number"][data-item-id="${cb.dataset.itemId}"]`);
      const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
      const price = parseFloat(cb.dataset.price) || 0;
      total += qty * price;
    });
    const totalEl = document.getElementById('order-total');
    if(totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }
  function closeOrderModal(){
    const modal = document.getElementById('order-modal'); if(modal) modal.classList.add('hidden');
  }
  function openItemModal(item){ const modal = document.getElementById('item-modal'); if(!modal) return; try{ document.getElementById('item-form').reset(); document.getElementById('item-id').value = item? (item.sku||item.id) : ''; document.getElementById('item-name').value = item? item.name : ''; document.getElementById('item-sku').value = item? (item.sku||item.id) : ''; document.getElementById('item-quantity').value = item? (item.quantity||0) : 0; document.getElementById('item-price').value = item? (item.price||0) : 0; document.getElementById('item-image').value = item? (item.image||'') : ''; document.getElementById('item-user').value = item? (item.user||'') : ''; populateUserSelect(); document.getElementById('item-modal-title').textContent = item? 'Edit Item' : 'Add Item'; }catch(e){} modal.classList.remove('hidden'); }
  function closeItemModal(){ const modal = document.getElementById('item-modal'); if(!modal) return; modal.classList.add('hidden'); }

  // expose helpers for quick use
  window.app = { renderUsersPage, renderItemsPage };
})();

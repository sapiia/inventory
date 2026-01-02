 // Data storage
    let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
    let nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;

    // Charts
    let barChart, pieChart, businessBarChart, businessPieChart;

    // Navigation
    document.getElementById('nav-dashboard').addEventListener('click', () => showPage('dashboard'));
    document.getElementById('nav-items').addEventListener('click', () => {
      window.location.href = 'pages/iterm.html';
    });


    document.getElementById('nav-transactions').addEventListener('click', () => {
      window.location.href = 'pages/transection.html';
    });
    document.getElementById('nav-users').addEventListener('click', () => showPage('users'));
    document.getElementById('nav-settings').addEventListener('click', () => showPage('settings'));


    function showPage(page) {
      document.querySelectorAll('[id^="page-"]').forEach(el => el.classList.add('hidden'));
      document.getElementById(`page-${page}`).classList.remove('hidden');

      document.querySelectorAll('aside button').forEach(btn => btn.classList.remove('sidebar-active'));
      document.getElementById(`nav-${page}`).classList.add('sidebar-active');

      if (page === 'dashboard') {
        updateDashboard();
        initBusinessCharts();
      }
      if (page === 'users') renderUsersPage();
      if (page === 'settings') renderSettingsPage();
    }

    // CRUD for Items
    document.getElementById('add-item-btn').addEventListener('click', openAddModal);
    function openAddModal() {
      document.getElementById('modal-title').textContent = 'Add New Item';
      document.getElementById('item-form').reset();
      document.getElementById('edit-id').value = '';
      document.getElementById('item-modal').classList.remove('hidden');
    }

    document.getElementById('modal-cancel').addEventListener('click', () => {
      document.getElementById('item-modal').classList.add('hidden');
    });

    document.getElementById('item-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-id').value || nextId++;
      const name = document.getElementById('item-name').value;
      const category = document.getElementById('item-category').value;
      const quantity = parseInt(document.getElementById('item-quantity').value);
      const price = parseFloat(document.getElementById('item-price').value);

      if (id > items.length && items.some(i => i.id === id)) id = nextId++; // safety

      const existingIndex = items.findIndex(i => i.id === parseInt(id));
      if (existingIndex > -1) {
        items[existingIndex] = {id: parseInt(id), name, category, quantity, price};
      } else {
        items.push({id, name, category, quantity, price});
      }

      saveData();
      document.getElementById('item-modal').classList.add('hidden');
      renderItemsTable();
      updateDashboard();
    });

    function editItem(id) {
      const item = items.find(i => i.id === id);
      if (!item) return;
      document.getElementById('modal-title').textContent = 'Edit Item';
      document.getElementById('edit-id').value = item.id;
      document.getElementById('item-name').value = item.name;
      document.getElementById('item-category').value = item.category;
      document.getElementById('item-quantity').value = item.quantity;
      document.getElementById('item-price').value = item.price;
      document.getElementById('item-modal').classList.remove('hidden');
    }

    function deleteItem(id) {
      if (!confirm('Delete this item?')) return;
      items = items.filter(i => i.id !== id);
      saveData();
      renderItemsTable();
      updateDashboard();
    }

    // Rendering
    function renderItemsTable() {
      const tbody = document.getElementById('items-table-body');
      tbody.innerHTML = '';
      items.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-purple-50';
        tr.innerHTML = `
          <td class="px-6 py-4">${item.id}</td>
          <td class="px-6 py-4">${item.name}</td>
          <td class="px-6 py-4">${item.category}</td>
          <td class="px-6 py-4">${item.quantity}</td>
          <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
          <td class="px-6 py-4">
            <button onclick="editItem(${item.id})" class="text-blue-600 hover:underline mr-4">Edit</button>
            <button onclick="deleteItem(${item.id})" class="text-red-600 hover:underline">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Dashboard Update - Inventory Stats Only
    function updateDashboard() {
      const totalValue = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const lowStock = items.filter(i => i.quantity < 10).length;

      document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
      document.getElementById('total-items').textContent = totalItems;
      document.getElementById('low-stock').textContent = lowStock;

      // Initialize business charts right after updating stats
      setTimeout(() => initBusinessCharts(), 100);
    }

    // Business Dashboard Charts
    function initBusinessCharts() {
      // Bar Chart - Sales by day
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const sales = [12, 19, 3, 5, 2, 3, 9];

      const barCtx = document.getElementById('businessBarChart');
      if (barCtx && barCtx.getContext) {
        if (businessBarChart) businessBarChart.destroy();
        businessBarChart = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: days,
            datasets: [{
              label: 'Sales ($1000)',
              data: sales,
              backgroundColor: '#9333ea',
              borderColor: '#7e22ce',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }

      // Pie Chart - Weekly Sales by Product
      const pieCtx = document.getElementById('businessPieChart');
      if (pieCtx && pieCtx.getContext) {
        if (businessPieChart) businessPieChart.destroy();
        businessPieChart = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['Tops', 'Animal Care', 'Electronics', 'Books'],
            datasets: [{
              data: [85, 60, 45, 30],
              backgroundColor: ['#9333ea', '#a855f7', '#c084fc', '#ddd6fe']
            }]
          },
          options: {
            responsive: true
          }
        });
      }
    }

    function saveData() {
      localStorage.setItem('inventoryItems', JSON.stringify(items));
    }

    /* ----------------- Users & Settings features ----------------- */
    function loadProfile(){
      try{return JSON.parse(localStorage.getItem('inventory_user_profile')) || {name:'',picture:''}}catch(e){return {name:'',picture:''}}
    }
    function saveProfile(p){ localStorage.setItem('inventory_user_profile', JSON.stringify(p)); }

    // ----- Users management (members table) -----
    function loadMembers(){ try{ return JSON.parse(localStorage.getItem('inventory_users')) || []; }catch(e){return []} }
    function saveMembers(list){ localStorage.setItem('inventory_users', JSON.stringify(list)); }

    function renderUsersPage(){
      const tbody = document.getElementById('users-table-body');
      const members = loadMembers();
      const q = (document.getElementById('users-search') && document.getElementById('users-search').value || '').toLowerCase();
      tbody.innerHTML = '';
      members.filter(m=> !q || (m.name && m.name.toLowerCase().includes(q)) || (m.email && m.email.toLowerCase().includes(q)) || (m.mobile && m.mobile.toLowerCase().includes(q))).forEach(m=>{
        const tr = document.createElement('tr');
        tr.className = 'border-b';

        // Photo
        const tdPhoto = document.createElement('td'); tdPhoto.className = 'px-4 py-3';
        const img = document.createElement('img'); img.src = m.picture || '../assets/images/default-avatar.png'; img.className = 'w-12 h-12 rounded-md object-cover'; tdPhoto.appendChild(img);

        // Name
        const tdName = document.createElement('td'); tdName.className = 'px-4 py-3 font-medium'; tdName.textContent = m.name || '';

        // Mobile
        const tdMobile = document.createElement('td'); tdMobile.className = 'px-4 py-3'; tdMobile.textContent = m.mobile || '';

        // Email
        const tdEmail = document.createElement('td'); tdEmail.className = 'px-4 py-3'; tdEmail.textContent = m.email || '';

        // Status
        const tdStatus = document.createElement('td'); tdStatus.className = 'px-4 py-3';
        const spanStatus = document.createElement('span'); spanStatus.className = `px-3 py-1 rounded-full text-sm ${m.status==='Active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`; spanStatus.textContent = m.status || 'Active'; tdStatus.appendChild(spanStatus);

        // Operation (Make admin placeholder)
        const tdOp = document.createElement('td'); tdOp.className = 'px-4 py-3';
        if(m.status === 'Active'){
          const btnOp = document.createElement('button'); btnOp.className = 'px-3 py-1 bg-purple-600 text-white rounded-lg text-sm'; btnOp.textContent = 'Make admin';
          tdOp.appendChild(btnOp);
        } else {
          tdOp.textContent = '-';
        }

        // Actions (icons)
        const tdAction = document.createElement('td'); tdAction.className = 'px-4 py-3 flex items-center gap-2';

        const btnEdit = document.createElement('button'); btnEdit.title = 'Edit'; btnEdit.className = 'p-2 rounded-md hover:bg-gray-100'; btnEdit.innerHTML = '<i class="fas fa-pen text-blue-600"></i>';
        btnEdit.addEventListener('click', ()=> editMember(m.id));

        const btnDelete = document.createElement('button'); btnDelete.title = 'Delete'; btnDelete.className = 'p-2 rounded-md hover:bg-gray-100'; btnDelete.innerHTML = '<i class="fas fa-trash text-red-600"></i>';
        btnDelete.addEventListener('click', ()=> deleteMember(m.id));

        const btnLogin = document.createElement('button'); btnLogin.title = 'Login'; btnLogin.className = 'p-2 rounded-md bg-gray-100'; btnLogin.innerHTML = '<i class="fas fa-sign-in-alt text-gray-700"></i>';
        btnLogin.addEventListener('click', ()=> loginAsMember(m.id));

        tdAction.appendChild(btnEdit);
        tdAction.appendChild(btnDelete);
        tdAction.appendChild(btnLogin);

        tr.appendChild(tdPhoto);
        tr.appendChild(tdName);
        tr.appendChild(tdMobile);
        tr.appendChild(tdEmail);
        tr.appendChild(tdStatus);
        tr.appendChild(tdOp);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
      });
    }

    // Search
    document.getElementById('users-search').addEventListener('input', ()=> renderUsersPage());

    // Add new
    document.getElementById('btn-add-user').addEventListener('click', ()=> openMemberModal());

    function openMemberModal(member){
      document.getElementById('user-form').reset();
      document.getElementById('user-id').value = '';
      document.getElementById('user-pic-preview').src = '../assets/images/default-avatar.png';
      document.getElementById('user-modal-title').textContent = member? 'Edit Member':'Add Member';
      if(member){
        document.getElementById('user-id').value = member.id;
        document.getElementById('user-name').value = member.name || '';
        document.getElementById('user-mobile').value = member.mobile || '';
        document.getElementById('user-email').value = member.email || '';
        document.getElementById('user-status').value = member.status || 'Active';
        document.getElementById('user-pic-preview').src = member.picture || '../assets/images/default-avatar.png';
      }
      document.getElementById('user-modal').classList.remove('hidden');
    }

    document.getElementById('user-cancel').addEventListener('click', ()=> document.getElementById('user-modal').classList.add('hidden'));

    // Picture input in modal
    document.getElementById('user-pic-input').addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload=()=>{ document.getElementById('user-pic-preview').src = r.result; document.getElementById('user-pic-preview').dataset.pending = r.result; }; r.readAsDataURL(f);
    });

    // Save member
    document.getElementById('user-form').addEventListener('submit', (e)=>{
      e.preventDefault();
      const idField = document.getElementById('user-id');
      const id = idField.value || ('u' + Date.now());
      const name = document.getElementById('user-name').value.trim();
      const mobile = document.getElementById('user-mobile').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const status = document.getElementById('user-status').value;
      const picEl = document.getElementById('user-pic-preview');
      const picture = picEl.dataset.pending || picEl.src;
      let members = loadMembers();
      const idx = members.findIndex(m=>m.id === id);
      const obj = {id, name, mobile, email, status, picture};
      if(idx>-1) members[idx]=obj; else members.push(obj);
      saveMembers(members);
      document.getElementById('user-modal').classList.add('hidden');
      renderUsersPage();
    });

    // Edit/Delete/Login actions
    window.editMember = function(id){ const members = loadMembers(); const m = members.find(x=>x.id===id); if(m) openMemberModal(m); };
    window.deleteMember = function(id){ if(!confirm('Delete member?')) return; let members = loadMembers(); members = members.filter(m=>m.id!==id); saveMembers(members); renderUsersPage(); };
    window.loginAsMember = function(id){ const members = loadMembers(); const m = members.find(x=>x.id===id); if(!m){ alert('Member not found'); return; } auth.login({username: m.name||m.email||m.id, password:'dummy'}, true).then(res=>{ if(res.ok) { alert('Logged in as '+(m.name||m.email)); location.reload(); } else alert('Login failed'); }); };

    // Import/Export members
    document.getElementById('btn-export-members').addEventListener('click', ()=>{
      const members = loadMembers(); const headers = ['id','name','mobile','email','status']; const lines = [headers.join(',')]; members.forEach(m=> lines.push([m.id,`"${(m.name||'').replace(/"/g,'""')}`,`"${(m.mobile||'').replace(/"/g,'""')}`,`"${(m.email||'').replace(/"/g,'""')}`, m.status||'Active'].join(',')) ); const csv = lines.join('\n'); const name = `members-${new Date().toISOString().slice(0,10)}.csv`; const blob = new Blob([csv],{type:'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    document.getElementById('btn-import-members').addEventListener('click', ()=> document.getElementById('import-members-input').click());
    document.getElementById('import-members-input').addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ const text = r.result; const lines = text.split(/\r?\n/).filter(Boolean); const hdr = lines.shift().split(/,\s*/).map(s=>s.replace(/"/g,'')); const members = loadMembers(); lines.forEach(l=>{ const cols = l.split(/,\s*/); const id = cols[0] || ('u'+Date.now()+Math.random()); const name = (cols[1]||'').replace(/"/g,''); const mobile = (cols[2]||'').replace(/"/g,''); const email = (cols[3]||'').replace(/"/g,''); const status = (cols[4]||'Active'); members.push({id,name,mobile,email,status,picture:'../assets/images/default-avatar.png'}); }); saveMembers(members); renderUsersPage(); alert('Import complete'); }; r.readAsText(f);
    });


    // Settings
    function loadSettings(){ try{return JSON.parse(localStorage.getItem('inventory_settings')) || {dark:false,requireAuth:true}}catch(e){return {dark:false,requireAuth:true}} }
    function saveSettings(s){ localStorage.setItem('inventory_settings', JSON.stringify(s)); }

    function renderSettingsPage(){
      const s = loadSettings();
      document.getElementById('toggle-dark').checked = !!s.dark;
      document.getElementById('toggle-auth').checked = s.requireAuth !== false;
      // stock overview
      document.getElementById('settings-total-items').textContent = items.reduce((sum,i)=>sum + i.quantity,0);
      document.getElementById('settings-low-stock').textContent = items.filter(i=>i.quantity<10).length;
    }

    document.getElementById('toggle-dark').addEventListener('change', (e)=>{
      const s = loadSettings(); s.dark = !!e.target.checked; saveSettings(s); applyDarkMode(s.dark);
    });

    document.getElementById('toggle-auth').addEventListener('change', (e)=>{
      const s = loadSettings(); s.requireAuth = !!e.target.checked; saveSettings(s);
    });

    function applyDarkMode(enabled){
      if(enabled){ document.documentElement.classList.add('dark'); document.body.classList.add('bg-gray-900'); }
      else { document.documentElement.classList.remove('dark'); document.body.classList.remove('bg-gray-900'); }
    }

    // Export CSV helpers
    function itemsToCSV(rows){
      const headers = ['id','name','category','quantity','price'];
      const lines = [headers.join(',')];
      rows.forEach(r=> lines.push([r.id,`"${r.name.replace(/"/g,'""')}` , r.category, r.quantity, r.price].join(',')));
      return lines.join('\n');
    }

    function downloadCSV(filename, content){
      const blob = new Blob([content], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }

    document.getElementById('export-daily').addEventListener('click', ()=>{
      const csv = itemsToCSV(items);
      const name = `inventory-daily-${new Date().toISOString().slice(0,10)}.csv`;
      downloadCSV(name, csv);
    });
    document.getElementById('export-monthly').addEventListener('click', ()=>{
      const csv = itemsToCSV(items);
      const d = new Date(); const name = `inventory-monthly-${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}.csv`;
      downloadCSV(name, csv);
    });

    // Enforce require-login on navigation
    const initialSettings = loadSettings(); applyDarkMode(initialSettings.dark);

    const originalShowPage = showPage;
    window.showPage = function(page){
      const s = loadSettings();
      if(s.requireAuth && window.auth && auth.isAuthenticated && !auth.isAuthenticated()){
        // redirect to login when auth required
        window.location.href = 'pages/login.html';
        return;
      }
      originalShowPage(page);
    };


    // Handle hash navigation
    function handleHashNavigation() {
      const hash = window.location.hash.substring(1);
      if (hash === 'items') {
        showPage('items');
      } else {
        showPage('dashboard');
      }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    // Initial load
    handleHashNavigation();



    // conecnt to items.js
    
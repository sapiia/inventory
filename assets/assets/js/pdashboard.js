    // Data storage
    let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
    let nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;

    // Charts
    let barChart, pieChart;

    // Navigation
    document.getElementById('nav-dashboard').addEventListener('click', () => showPage('dashboard'));
    document.getElementById('nav-items').addEventListener('click', () => showPage('items'));
    document.getElementById('nav-transactions').addEventListener('click', () => {
      window.location.href = 'pages/transection.html';
    });

    function showPage(page) {
      document.querySelectorAll('[id^="page-"]').forEach(el => el.classList.add('hidden'));
      document.getElementById(`page-${page}`).classList.remove('hidden');

      document.querySelectorAll('aside button').forEach(btn => btn.classList.remove('sidebar-active'));
      document.getElementById(`nav-${page}`).classList.add('sidebar-active');

      if (page === 'dashboard') updateDashboard();
      if (page === 'items') renderItemsTable();
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

    // Dashboard Update
    function updateDashboard() {
      const totalValue = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const lowStock = items.filter(i => i.quantity < 10).length;

      document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
      document.getElementById('total-items').textContent = totalItems;
      document.getElementById('low-stock').textContent = lowStock;

      // Bar Chart - Monthly movement (simulated with last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const inflows = months.map(() => Math.floor(Math.random() * 500));
      const outflows = months.map(() => Math.floor(Math.random() * 400));

      if (barChart) barChart.destroy();
      barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            { label: 'Stock In', data: inflows, backgroundColor: '#9333ea' },
            { label: 'Stock Out', data: outflows, backgroundColor: '#ec4899' }
          ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });

      // Pie Chart - Category value
      const categoryData = {};
      items.forEach(i => {
        categoryData[i.category] = (categoryData[i.category] || 0) + i.quantity * i.price;
      });
      const labels = Object.keys(categoryData);
      const data = Object.values(categoryData);

      if (pieChart) pieChart.destroy();
      pieChart = new Chart(document.getElementById('pieChart'), {
        type: 'doughnut',
        data: {
          labels: labels.length ? labels : ['No Data'],
          datasets: [{ data: data.length ? data : [1], backgroundColor: ['#9333ea', '#a855f7', '#c084fc', '#ddd6fe', '#f3e8ff'] }]
        },
        options: { responsive: true }
      });
    }

    function saveData() {
      localStorage.setItem('inventoryItems', JSON.stringify(items));
    }

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
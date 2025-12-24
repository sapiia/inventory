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
    localStorage.setItem('inventoryTransactions', JSON.stringify(transactions));
}

// Initial load
showPage('dashboard');
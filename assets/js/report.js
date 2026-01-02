// Sample sales data
let salesData = [
    { date: '2025-01-01', product: 'Laptop Pro', category: 'Electronics', quantity: 2, unitPrice: 999.99, status: 'Completed' },
    { date: '2025-01-02', product: 'USB Cable', category: 'Electronics', quantity: 5, unitPrice: 9.99, status: 'Completed' },
    { date: '2025-01-03', product: 'Office Chair', category: 'Furniture', quantity: 1, unitPrice: 299.99, status: 'Completed' },
    { date: '2025-01-04', product: 'Desk Lamp', category: 'Electronics', quantity: 3, unitPrice: 45.99, status: 'Completed' },
    { date: '2025-01-05', product: 'Python Book', category: 'Books', quantity: 4, unitPrice: 49.99, status: 'Completed' },
    { date: '2025-01-06', product: 'Laptop Pro', category: 'Electronics', quantity: 1, unitPrice: 999.99, status: 'Completed' },
    { date: '2025-01-07', product: 'Office Chair', category: 'Furniture', quantity: 2, unitPrice: 299.99, status: 'Pending' },
    { date: '2025-01-08', product: 'USB Cable', category: 'Electronics', quantity: 8, unitPrice: 9.99, status: 'Completed' },
];

let salesChart, categoryChart;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderReportTable();
    updateMetrics();
    initCharts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('reportType').addEventListener('change', handleReportChange);
    document.getElementById('exportBtn').addEventListener('click', exportReport);
}

// Update metrics
function updateMetrics() {
    const totalSales = salesData.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalOrders = salesData.length;
    const avgOrder = totalSales / totalOrders;
    const growthRate = 12.5; // Example percentage

    document.getElementById('totalSales').textContent = '$' + totalSales.toFixed(2);
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('avgOrder').textContent = '$' + avgOrder.toFixed(2);
    document.getElementById('growthRate').textContent = growthRate.toFixed(1) + '%';
}

// Render report table
function renderReportTable() {
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = '';

    salesData.forEach(item => {
        const total = (item.quantity * item.unitPrice).toFixed(2);
        const statusColor = item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

        const row = document.createElement('tr');
        row.className = 'hover:bg-purple-50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4">${item.date}</td>
            <td class="px-6 py-4 font-semibold">${item.product}</td>
            <td class="px-6 py-4">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">${item.category}</span>
            </td>
            <td class="px-6 py-4">${item.quantity}</td>
            <td class="px-6 py-4">$${item.unitPrice.toFixed(2)}</td>
            <td class="px-6 py-4 font-bold text-purple-600">$${total}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">${item.status}</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize charts
function initCharts() {
    // Sales Trend Chart
    const dates = salesData.map(item => item.date);
    const sales = salesData.map(item => item.quantity * item.unitPrice);

    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && salesCtx.getContext) {
        if (salesChart) salesChart.destroy();
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sales ($)',
                    data: sales,
                    borderColor: '#9333ea',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#9333ea'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    // Category Chart
    const categories = [...new Set(salesData.map(item => item.category))];
    const categoryData = categories.map(cat => {
        return salesData
            .filter(item => item.category === cat)
            .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    });

    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx && categoryCtx.getContext) {
        if (categoryChart) categoryChart.destroy();
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: categoryData,
                    backgroundColor: ['#9333ea', '#a855f7', '#c084fc', '#ddd6fe'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Handle report type change
function handleReportChange(e) {
    const reportType = e.target.value;
    console.log('Report type changed to:', reportType);
    // You can add logic here to filter or change the report
}

// Export report
function exportReport() {
    let csvContent = 'Date,Product,Category,Quantity,Unit Price,Total,Status\n';
    
    salesData.forEach(item => {
        const total = (item.quantity * item.unitPrice).toFixed(2);
        csvContent += `${item.date},${item.product},${item.category},${item.quantity},${item.unitPrice},${total},${item.status}\n`;
    });

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

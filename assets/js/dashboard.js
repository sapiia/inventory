// Initialize Charts
let barChart, pieChart;

function initCharts() {
    // Bar Chart - Sales by day
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sales = [12, 19, 3, 5, 2, 3, 9];

    const barCtx = document.getElementById('barChart');
    if (barCtx && barCtx.getContext) {
        if (barChart) barChart.destroy();
        barChart = new Chart(barCtx, {
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
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx && pieCtx.getContext) {
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(pieCtx, {
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

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initCharts();
<<<<<<< HEAD
});
=======
});
>>>>>>> channyven

// Initialize calendar
document.addEventListener('DOMContentLoaded', function () {
    // Set today's date in calendar
    const today = new Date();
    const calendarDays = document.querySelectorAll('.calendar-days .day');

    // Set today's date (5th in the calendar)
    calendarDays.forEach(day => {
        if (day.textContent === '5') {
            day.classList.add('today');
        }
    });

    // Add click event to calendar days
    document.querySelectorAll('.day:not(.other-month)').forEach(day => {
        day.addEventListener('click', function () {
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');

            // Update header with selected date
            const month = document.querySelector('.calendar-header span').textContent;
            const date = this.textContent;
            console.log(`Selected date: ${date} ${month}`);
        });
    });

    // Calendar navigation
    document.querySelectorAll('.calendar-nav button').forEach(button => {
        button.addEventListener('click', function () {
            const currentMonth = document.querySelector('.calendar-header span');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentIndex = months.indexOf(currentMonth.textContent.split(' ')[0]);

            if (this.querySelector('.fa-chevron-left')) {
                // Previous month
                if (currentIndex > 0) {
                    currentMonth.textContent = `${months[currentIndex - 1]} 2023`;
                }
            } else {
                // Next month
                if (currentIndex < 11) {
                    currentMonth.textContent = `${months[currentIndex + 1]} 2023`;
                }
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();

        // Filter customer table
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Update sales numbers with animation
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animate the sales numbers
    setTimeout(() => {
        const salesStats = document.querySelectorAll('.sales-stat h4');
        if (salesStats.length >= 1) animateValue(salesStats[0], 0, 350000, 2000);
        if (salesStats.length >= 2) animateValue(salesStats[1], 0, 50000, 2000);

        const welcomeStats = document.querySelectorAll('.stat-item h3');
        if (welcomeStats.length >= 1) animateValue(welcomeStats[0], 0, 20000, 1500);
        if (welcomeStats.length >= 2) animateValue(welcomeStats[1], 0, 750, 1500);
        if (welcomeStats.length >= 3) animateValue(welcomeStats[2], 0, 150, 1500);
    }, 1000);

    // Simulate real-time data updates
    setInterval(() => {
        // Randomly update orders count
        const ordersElement = document.querySelector('.stat-card:nth-child(2) h3');
        if (ordersElement) {
            const current = parseInt(ordersElement.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 10) - 3; // -3 to +6
            const newValue = Math.max(1200, current + change);
            ordersElement.textContent = newValue.toLocaleString();
        }

        // Update weekly balance
        const balanceElement = document.querySelector('.stat-item:nth-child(1) h3');
        if (balanceElement) {
            const current = parseInt(balanceElement.textContent.replace(/[$,]/g, ''));
            const change = Math.floor(Math.random() * 500) - 200; // -200 to +300
            const newValue = Math.max(18000, current + change);
            balanceElement.textContent = '$' + newValue.toLocaleString();
        }
    }, 10000); // Update every 10 seconds
});
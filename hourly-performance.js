// Hourly Performance Dashboard
class HourlyPerformanceDashboard {
    constructor() {
        this.charts = {};
        this.currentHour = new Date().getHours();
        this.todayData = null;
        this.lastYearData = null;

        this.init();
    }

    async init() {
        // Check authentication
        if (!this.checkAuth()) {
            window.location.href = '/login.html';
            return;
        }

        // Setup UI
        this.setupEventListeners();
        this.updateDateTime();
        this.setupUser();

        // Load data
        await this.loadDashboardData();

        // Start auto-refresh
        setInterval(() => this.updateDateTime(), 1000);
        setInterval(() => this.loadDashboardData(), 300000); // Refresh every 5 minutes
    }

    checkAuth() {
        const token = localStorage.getItem('sb_dashboard_token');
        return !!token;
    }

    setupUser() {
        const user = JSON.parse(localStorage.getItem('sb_dashboard_user') || '{}');
        const userName = user.username || 'User';
        const userRole = user.role || 'User';

        // Desktop user info
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.textContent = userName.charAt(0).toUpperCase() + userName.slice(1);
        if (userRoleEl) userRoleEl.textContent = userRole;
        if (userAvatarEl) userAvatarEl.textContent = userName.charAt(0).toUpperCase();

        // Mobile user info
        const mobileUserInitial = document.getElementById('mobileUserInitial');
        if (mobileUserInitial) mobileUserInitial.textContent = userName.charAt(0).toUpperCase();
    }

    setupEventListeners() {
        // Logout button
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.logout());
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');

        if (mobileMenuToggle && sidebar) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }

        // Mobile user button
        const mobileUserButton = document.getElementById('mobileUserButton');
        if (mobileUserButton) {
            mobileUserButton.addEventListener('click', () => this.logout());
        }
    }

    logout() {
        localStorage.removeItem('sb_dashboard_token');
        localStorage.removeItem('sb_dashboard_user');
        window.location.href = '/login.html';
    }

    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const currentDateEl = document.getElementById('currentDate');
        const currentTimeEl = document.getElementById('currentTime');

        if (currentDateEl) currentDateEl.textContent = dateStr;
        if (currentTimeEl) currentTimeEl.textContent = timeStr;
    }

    async loadDashboardData() {
        try {
            // For now, use mock data
            // TODO: Replace with actual API call when backend is ready
            const data = this.generateMockData();

            this.todayData = data.today;
            this.lastYearData = data.lastYear;

            this.updateComparisonInfo();
            this.updateKPIs();
            this.renderCharts();
            this.populateTable();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    generateMockData() {
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(lastYear.getFullYear() - 1);

        // Find same day of week last year
        const dayOfWeek = today.getDay();
        const daysToAdjust = today.getDay() - lastYear.getDay();
        lastYear.setDate(lastYear.getDate() + daysToAdjust);

        const currentHour = today.getHours();

        // Generate hourly data up to current hour
        const todayHourly = [];
        const lastYearHourly = [];

        for (let hour = 0; hour <= currentHour; hour++) {
            // Today's data (slightly better performance)
            todayHourly.push({
                hour: hour,
                revenue: Math.floor(Math.random() * 5000) + 2000,
                visitors: Math.floor(Math.random() * 500) + 200,
                orders: Math.floor(Math.random() * 50) + 10,
                conversionRate: (Math.random() * 3 + 1).toFixed(2)
            });

            // Last year's data (slightly lower)
            lastYearHourly.push({
                hour: hour,
                revenue: Math.floor(Math.random() * 4000) + 1500,
                visitors: Math.floor(Math.random() * 400) + 150,
                orders: Math.floor(Math.random() * 40) + 8,
                conversionRate: (Math.random() * 2.5 + 0.8).toFixed(2)
            });
        }

        return {
            today: {
                date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                hourly: todayHourly
            },
            lastYear: {
                date: lastYear.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                hourly: lastYearHourly
            }
        };
    }

    updateComparisonInfo() {
        const todayInfoEl = document.getElementById('todayInfo');
        const lastYearInfoEl = document.getElementById('lastYearInfo');

        if (todayInfoEl && this.todayData) {
            todayInfoEl.textContent = `Today: ${this.todayData.date}`;
        }

        if (lastYearInfoEl && this.lastYearData) {
            lastYearInfoEl.textContent = `Last Year: ${this.lastYearData.date}`;
        }
    }

    updateKPIs() {
        if (!this.todayData || !this.lastYearData) return;

        // Calculate totals
        const todayTotals = this.calculateTotals(this.todayData.hourly);
        const lastYearTotals = this.calculateTotals(this.lastYearData.hourly);

        // Update Revenue KPI
        this.updateKPI('revenue', todayTotals.revenue, lastYearTotals.revenue, true);

        // Update Visitors KPI
        this.updateKPI('visitors', todayTotals.visitors, lastYearTotals.visitors, false);

        // Update Orders KPI
        this.updateKPI('orders', todayTotals.orders, lastYearTotals.orders, false);

        // Update Conversion Rate KPI
        const todayConvRate = (todayTotals.orders / todayTotals.visitors * 100).toFixed(2);
        const lastYearConvRate = (lastYearTotals.orders / lastYearTotals.visitors * 100).toFixed(2);
        this.updateKPI('convRate', parseFloat(todayConvRate), parseFloat(lastYearConvRate), false, true);
    }

    calculateTotals(hourlyData) {
        return hourlyData.reduce((acc, hour) => {
            acc.revenue += hour.revenue;
            acc.visitors += hour.visitors;
            acc.orders += hour.orders;
            return acc;
        }, { revenue: 0, visitors: 0, orders: 0 });
    }

    updateKPI(name, todayValue, lastYearValue, isCurrency = false, isPercentage = false) {
        const valueEl = document.getElementById(`${name}Value`);
        const changeEl = document.getElementById(`${name}Change`);
        const todayEl = document.getElementById(`${name}Today`);
        const lastYearEl = document.getElementById(`${name}LastYear`);

        const change = ((todayValue - lastYearValue) / lastYearValue * 100).toFixed(1);
        const isPositive = change >= 0;

        if (valueEl) {
            if (isCurrency) {
                valueEl.textContent = `$${todayValue.toLocaleString()}`;
            } else if (isPercentage) {
                valueEl.textContent = `${todayValue}%`;
            } else {
                valueEl.textContent = todayValue.toLocaleString();
            }
        }

        if (changeEl) {
            changeEl.textContent = `${isPositive ? '+' : ''}${change}%`;
            changeEl.className = `kpi-change ${isPositive ? 'positive' : 'negative'}`;
        }

        if (todayEl) {
            if (isCurrency) {
                todayEl.textContent = `Today: $${todayValue.toLocaleString()}`;
            } else if (isPercentage) {
                todayEl.textContent = `Today: ${todayValue}%`;
            } else {
                todayEl.textContent = `Today: ${todayValue.toLocaleString()}`;
            }
        }

        if (lastYearEl) {
            if (isCurrency) {
                lastYearEl.textContent = `Last Yr: $${lastYearValue.toLocaleString()}`;
            } else if (isPercentage) {
                lastYearEl.textContent = `Last Yr: ${lastYearValue}%`;
            } else {
                lastYearEl.textContent = `Last Yr: ${lastYearValue.toLocaleString()}`;
            }
        }
    }

    renderCharts() {
        if (!this.todayData || !this.lastYearData) return;

        const labels = this.todayData.hourly.map(h => `${h.hour.toString().padStart(2, '0')}:00`);

        // Revenue Chart
        this.renderChart('revenueChart', 'Revenue', labels,
            this.todayData.hourly.map(h => h.revenue),
            this.lastYearData.hourly.map(h => h.revenue),
            true
        );

        // Visitors Chart
        this.renderChart('visitorsChart', 'Visitors', labels,
            this.todayData.hourly.map(h => h.visitors),
            this.lastYearData.hourly.map(h => h.visitors),
            false
        );

        // Orders Chart
        this.renderChart('ordersChart', 'Orders', labels,
            this.todayData.hourly.map(h => h.orders),
            this.lastYearData.hourly.map(h => h.orders),
            false
        );

        // Conversion Rate Chart
        this.renderChart('convRateChart', 'Conversion Rate (%)', labels,
            this.todayData.hourly.map(h => parseFloat(h.conversionRate)),
            this.lastYearData.hourly.map(h => parseFloat(h.conversionRate)),
            false
        );
    }

    renderChart(canvasId, label, labels, todayData, lastYearData, isCurrency = false) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Today',
                        data: todayData,
                        borderColor: '#F7931E',
                        backgroundColor: 'rgba(247, 147, 30, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#F7931E',
                        pointBorderColor: '#F7931E',
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Last Year',
                        data: lastYearData,
                        borderColor: '#999999',
                        backgroundColor: 'rgba(153, 153, 153, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#999999',
                        pointBorderColor: '#999999',
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#0a0a0a',
                        titleColor: '#F7931E',
                        bodyColor: '#e0e0e0',
                        borderColor: '#F7931E',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (isCurrency) {
                                    label += '$' + context.parsed.y.toLocaleString();
                                } else {
                                    label += context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#1a1a1a',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#999999',
                            font: {
                                family: 'Roboto Mono',
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#1a1a1a',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#999999',
                            font: {
                                family: 'Roboto Mono',
                                size: 10
                            },
                            callback: function(value) {
                                if (isCurrency) {
                                    return '$' + value.toLocaleString();
                                }
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    populateTable() {
        if (!this.todayData || !this.lastYearData) return;

        const tableBody = document.getElementById('hourlyTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        for (let i = 0; i < this.todayData.hourly.length; i++) {
            const today = this.todayData.hourly[i];
            const lastYear = this.lastYearData.hourly[i];

            const revenueChange = ((today.revenue - lastYear.revenue) / lastYear.revenue * 100).toFixed(1);
            const visitorsChange = ((today.visitors - lastYear.visitors) / lastYear.visitors * 100).toFixed(1);
            const ordersChange = ((today.orders - lastYear.orders) / lastYear.orders * 100).toFixed(1);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${today.hour.toString().padStart(2, '0')}:00</td>
                <td>$${today.revenue.toLocaleString()}</td>
                <td>$${lastYear.revenue.toLocaleString()}</td>
                <td class="${revenueChange >= 0 ? 'change-positive' : 'change-negative'}">
                    ${revenueChange >= 0 ? '+' : ''}${revenueChange}%
                </td>
                <td>${today.visitors.toLocaleString()}</td>
                <td>${lastYear.visitors.toLocaleString()}</td>
                <td class="${visitorsChange >= 0 ? 'change-positive' : 'change-negative'}">
                    ${visitorsChange >= 0 ? '+' : ''}${visitorsChange}%
                </td>
                <td>${today.orders.toLocaleString()}</td>
                <td>${lastYear.orders.toLocaleString()}</td>
                <td class="${ordersChange >= 0 ? 'change-positive' : 'change-negative'}">
                    ${ordersChange >= 0 ? '+' : ''}${ordersChange}%
                </td>
            `;

            tableBody.appendChild(row);
        }
    }

    // Method to fetch real data from API (to be implemented)
    async fetchHourlyData() {
        const token = localStorage.getItem('sb_dashboard_token');

        try {
            const response = await fetch('/api/ga4/hourly-performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    // API parameters will be added when backend is ready
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch hourly data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching hourly data:', error);
            // Fallback to mock data
            return this.generateMockData();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HourlyPerformanceDashboard();
});

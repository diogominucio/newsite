// SelectBlinds Bloomberg Terminal Dashboard

class BloombergDashboard {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Check authentication
        if (typeof authService === 'undefined') {
            console.error('AuthService not loaded');
            window.location.replace('login.html');
            return;
        }

        if (!authService.isAuthenticated()) {
            sessionStorage.removeItem('login_check_done');
            window.location.replace('login.html');
            return;
        }

        // Load user info
        this.loadUserInfo();

        // Setup event listeners
        this.setupEventListeners();

        // Load initial data
        this.loadDashboardData();

        // Update time
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Logout from terminal?')) {
                    authService.logout();
                }
            });
        }

        // Refresh
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadDashboardData();
            });
        }

        // Date range
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', () => {
                this.loadDashboardData();
            });
        }

        // Export CSV
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }

        // Navigation items - only add click handler to internal links
        document.querySelectorAll('.nav-item[href="#"], .nav-item[href^="#"], .nav-item[data-view]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                // Close mobile sidebar
                if (sidebar) {
                    sidebar.classList.remove('open');
                }
            });
        });

        // For external navigation links, just close sidebar
        document.querySelectorAll('.nav-item[href]:not([href="#"]):not([href^="#"]):not([data-view])').forEach(item => {
            item.addEventListener('click', () => {
                if (sidebar) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    loadUserInfo() {
        const user = authService.getUser();
        if (user) {
            const userNameEl = document.getElementById('userName');
            const userRoleEl = document.getElementById('userRole');
            const userInitialsEl = document.getElementById('userInitials');

            if (userNameEl) userNameEl.textContent = user.username.toUpperCase();
            if (userRoleEl) userRoleEl.textContent = user.role;
            if (userInitialsEl) {
                userInitialsEl.textContent = user.username.substring(0, 2).toUpperCase();
            }
        }
    }

    async loadDashboardData() {
        this.showLoading(true);

        try {
            await this.delay(800);

            // Generate mock data
            const data = this.generateMockData();

            // Update KPIs
            this.updateKPIs(data.kpis);

            // Render charts
            this.renderCharts(data);

            // Update transactions table
            this.updateTransactionsTable(data.transactions);

            this.showLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showLoading(false);
        }
    }

    generateMockData() {
        return {
            kpis: {
                revenue: 234567.89,
                revenueChange: 12.5,
                visitors: 45678,
                visitorsChange: 8.3,
                convRate: 3.45,
                convRateChange: 2.1,
                avgOrder: 287.50,
                avgOrderChange: 15.7,
                orders: 816,
                cartAband: 68.5,
                cartAbandChange: -5.2
            },
            revenue: {
                labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                data: [32450, 28900, 35200, 41300, 48900, 52100, 45600]
            },
            funnel: {
                labels: ['VISITORS', 'VIEWS', 'ADD TO CART', 'CHECKOUT', 'PURCHASE'],
                data: [45678, 28934, 12456, 5678, 1576]
            },
            traffic: {
                labels: ['ORGANIC', 'DIRECT', 'SOCIAL', 'EMAIL', 'REFERRAL'],
                data: [35, 28, 18, 12, 7]
            },
            products: {
                labels: ['Roller Shades', 'Cellular Shades', 'Roman Shades', 'Wood Blinds', 'Faux Wood'],
                data: [320, 280, 195, 165, 140]
            },
            transactions: [
                { id: 'ORD-12847', time: '14:32:15', customer: 'J. Smith', product: 'Roller Shades', amount: 245.00, status: 'completed' },
                { id: 'ORD-12846', time: '13:18:42', customer: 'S. Johnson', product: 'Cellular Shades', amount: 312.50, status: 'processing' },
                { id: 'ORD-12845', time: '11:45:23', customer: 'M. Williams', product: 'Wood Blinds', amount: 487.00, status: 'completed' },
                { id: 'ORD-12844', time: '10:22:08', customer: 'E. Davis', product: 'Roman Shades', amount: 198.75, status: 'completed' },
                { id: 'ORD-12843', time: '09:15:36', customer: 'D. Brown', product: 'Faux Wood Blinds', amount: 156.00, status: 'pending' },
                { id: 'ORD-12842', time: '18:40:51', customer: 'L. Anderson', product: 'Roller Shades', amount: 289.00, status: 'completed' },
                { id: 'ORD-12841', time: '16:55:12', customer: 'R. Taylor', product: 'Cellular Shades', amount: 345.50, status: 'completed' },
                { id: 'ORD-12840', time: '15:30:44', customer: 'J. Martinez', product: 'Wood Blinds', amount: 512.00, status: 'completed' }
            ]
        };
    }

    updateKPIs(kpis) {
        // Revenue
        document.getElementById('revenue').textContent = `$${this.formatNumber(kpis.revenue)}`;
        document.getElementById('revenueChange').textContent = `${kpis.revenueChange > 0 ? '+' : ''}${kpis.revenueChange}%`;

        // Visitors
        document.getElementById('visitors').textContent = this.formatNumber(kpis.visitors);
        document.getElementById('visitorsChange').textContent = `+${kpis.visitorsChange}%`;

        // Conversion Rate
        document.getElementById('convRate').textContent = `${kpis.convRate}%`;
        document.getElementById('convRateChange').textContent = `+${kpis.convRateChange}%`;

        // Average Order
        document.getElementById('avgOrder').textContent = `$${kpis.avgOrder.toFixed(2)}`;
        document.getElementById('avgOrderChange').textContent = `+${kpis.avgOrderChange}%`;

        // Orders
        document.getElementById('orders').textContent = this.formatNumber(kpis.orders);
        document.getElementById('ordersChange').textContent = '--';

        // Cart Abandonment
        document.getElementById('cartAband').textContent = `${kpis.cartAband}%`;
        const cartAbandChange = document.getElementById('cartAbandChange');
        cartAbandChange.textContent = `${kpis.cartAbandChange}%`;
        cartAbandChange.className = `kpi-change ${kpis.cartAbandChange > 0 ? 'negative' : 'positive'}`;
    }

    renderCharts(data) {
        this.renderRevenueChart(data.revenue);
        this.renderFunnelChart(data.funnel);
        this.renderTrafficChart(data.traffic);
        this.renderProductsChart(data.products);
    }

    renderRevenueChart(data) {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    borderColor: '#F7931E',
                    backgroundColor: 'rgba(247, 147, 30, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0,
                    pointRadius: 3,
                    pointBackgroundColor: '#F7931E',
                    pointBorderColor: '#000',
                    pointBorderWidth: 1
                }]
            },
            options: this.getChartOptions()
        });
    }

    renderFunnelChart(data) {
        const ctx = document.getElementById('funnelChart');
        if (!ctx) return;

        if (this.charts.funnel) {
            this.charts.funnel.destroy();
        }

        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: '#F7931E',
                    borderWidth: 0
                }]
            },
            options: {
                ...this.getChartOptions(),
                indexAxis: 'y'
            }
        });
    }

    renderTrafficChart(data) {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;

        if (this.charts.traffic) {
            this.charts.traffic.destroy();
        }

        this.charts.traffic = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: [
                        '#F7931E',
                        '#e88a1a',
                        '#d97f15',
                        '#ca7410',
                        '#bb690b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                ...this.getChartOptions(),
                cutout: '65%'
            }
        });
    }

    renderProductsChart(data) {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        if (this.charts.products) {
            this.charts.products.destroy();
        }

        this.charts.products = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: '#F7931E',
                    borderWidth: 0
                }]
            },
            options: this.getChartOptions()
        });
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#000',
                    titleColor: '#F7931E',
                    bodyColor: '#e0e0e0',
                    borderColor: '#222',
                    borderWidth: 1,
                    padding: 8,
                    titleFont: {
                        family: 'Roboto Mono',
                        size: 11,
                        weight: 600
                    },
                    bodyFont: {
                        family: 'Roboto Mono',
                        size: 11
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#222',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#808080',
                        font: {
                            family: 'Roboto Mono',
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: '#222',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#808080',
                        font: {
                            family: 'Roboto Mono',
                            size: 10
                        }
                    }
                }
            }
        };
    }

    updateTransactionsTable(transactions) {
        const tbody = document.getElementById('transactionsBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        transactions.forEach(t => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${t.id}</td>
                <td>${t.time}</td>
                <td>${t.customer}</td>
                <td>${t.product}</td>
                <td>$${t.amount.toFixed(2)}</td>
                <td><span class="status-badge ${t.status}">${t.status.toUpperCase()}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    exportToCSV() {
        const transactions = this.generateMockData().transactions;
        let csv = 'ID,TIME,CUSTOMER,PRODUCT,AMOUNT,STATUS\n';

        transactions.forEach(t => {
            csv += `${t.id},${t.time},${t.customer},${t.product},${t.amount},${t.status}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selectblinds-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    updateTime() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour12: false });
            lastUpdate.textContent = time;
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new BloombergDashboard();
});

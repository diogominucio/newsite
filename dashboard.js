// Dashboard Main Controller
class Dashboard {
    constructor() {
        this.charts = {};
        this.authService = new AuthService();
        this.init();
    }

    init() {
        // Verifica autenticação
        if (!this.authService.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        // Carrega informações do usuário
        this.loadUserInfo();

        // Configura event listeners
        this.setupEventListeners();

        // Carrega dados iniciais
        this.loadDashboardData();
    }

    loadUserInfo() {
        const user = this.authService.getUser();
        if (user) {
            document.getElementById('userName').textContent = user.username;
            document.getElementById('userRole').textContent = user.role;

            // Define iniciais do usuário
            const initials = user.username.substring(0, 2).toUpperCase();
            document.getElementById('userInitials').textContent = initials;
        }
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.authService.logout();
        });

        // Refresh data
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadDashboardData();
        });

        // Date range change
        document.getElementById('dateRange').addEventListener('change', () => {
            this.loadDashboardData();
        });

        // Export CSV
        document.querySelector('.btn-export')?.addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    async loadDashboardData() {
        this.showLoading(true);

        try {
            // Em produção, esses dados viriam do GA4
            // Por agora, vamos usar dados simulados
            await this.delay(1500);

            const mockData = this.generateMockData();

            this.updateKPIs(mockData.kpis);
            this.renderCharts(mockData);
            this.updateTransactionsTable(mockData.transactions);

            this.showLoading(false);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showLoading(false);
        }
    }

    generateMockData() {
        return {
            kpis: {
                totalRevenue: 234567.89,
                totalVisitors: 45678,
                conversionRate: 3.45,
                avgOrderValue: 287.50,
                totalOrders: 816,
                abandonedCart: 68.5
            },
            funnel: {
                labels: ['Visitantes', 'Visualizações', 'Add to Cart', 'Checkout', 'Compras'],
                data: [45678, 28934, 12456, 5678, 1576]
            },
            revenue: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                data: [32450, 28900, 35200, 41300, 48900, 52100, 45600]
            },
            traffic: {
                labels: ['Google Organic', 'Direct', 'Social Media', 'Email', 'Referral'],
                data: [35, 28, 18, 12, 7]
            },
            products: {
                labels: ['Roller Shades', 'Cellular Shades', 'Roman Shades', 'Wood Blinds', 'Faux Wood'],
                data: [320, 280, 195, 165, 140]
            },
            devices: {
                labels: ['Mobile', 'Desktop', 'Tablet'],
                data: [52, 38, 10]
            },
            transactions: [
                { id: 'ORD-12847', date: '2024-12-15 14:32', customer: 'John Smith', product: 'Roller Shades - White', amount: 245.00, status: 'completed' },
                { id: 'ORD-12846', date: '2024-12-15 13:18', customer: 'Sarah Johnson', product: 'Cellular Shades - Beige', amount: 312.50, status: 'processing' },
                { id: 'ORD-12845', date: '2024-12-15 11:45', customer: 'Mike Williams', product: 'Wood Blinds - Oak', amount: 487.00, status: 'completed' },
                { id: 'ORD-12844', date: '2024-12-15 10:22', customer: 'Emily Davis', product: 'Roman Shades - Gray', amount: 198.75, status: 'completed' },
                { id: 'ORD-12843', date: '2024-12-15 09:15', customer: 'David Brown', product: 'Faux Wood Blinds', amount: 156.00, status: 'pending' },
                { id: 'ORD-12842', date: '2024-12-14 18:40', customer: 'Lisa Anderson', product: 'Roller Shades - Black', amount: 289.00, status: 'completed' },
                { id: 'ORD-12841', date: '2024-12-14 16:55', customer: 'Robert Taylor', product: 'Cellular Shades - White', amount: 345.50, status: 'completed' },
                { id: 'ORD-12840', date: '2024-12-14 15:30', customer: 'Jennifer Martinez', product: 'Wood Blinds - Walnut', amount: 512.00, status: 'completed' }
            ]
        };
    }

    updateKPIs(kpis) {
        document.getElementById('totalRevenue').textContent = `$${kpis.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.getElementById('totalVisitors').textContent = kpis.totalVisitors.toLocaleString('en-US');
        document.getElementById('conversionRate').textContent = `${kpis.conversionRate}%`;
        document.getElementById('avgOrderValue').textContent = `$${kpis.avgOrderValue.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = kpis.totalOrders.toLocaleString('en-US');
        document.getElementById('abandonedCart').textContent = `${kpis.abandonedCart}%`;
    }

    renderCharts(data) {
        this.renderFunnelChart(data.funnel);
        this.renderRevenueChart(data.revenue);
        this.renderTrafficChart(data.traffic);
        this.renderProductsChart(data.products);
        this.renderDeviceChart(data.devices);
    }

    renderFunnelChart(data) {
        const ctx = document.getElementById('funnelChart');

        if (this.charts.funnel) {
            this.charts.funnel.destroy();
        }

        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Usuários',
                    data: data.data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(245, 87, 108, 0.8)',
                        'rgba(56, 239, 125, 0.8)'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.getChartDefaults(),
                indexAxis: 'y',
                plugins: {
                    ...this.getChartDefaults().plugins,
                    legend: { display: false }
                }
            }
        });
    }

    renderRevenueChart(data) {
        const ctx = document.getElementById('revenueChart');

        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Receita ($)',
                    data: data.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: this.getChartDefaults()
        });
    }

    renderTrafficChart(data) {
        const ctx = document.getElementById('trafficChart');

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
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(245, 87, 108, 0.8)',
                        'rgba(56, 239, 125, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                ...this.getChartDefaults(),
                cutout: '70%'
            }
        });
    }

    renderProductsChart(data) {
        const ctx = document.getElementById('productsChart');

        if (this.charts.products) {
            this.charts.products.destroy();
        }

        this.charts.products = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Vendas',
                    data: data.data,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.getChartDefaults(),
                plugins: {
                    ...this.getChartDefaults().plugins,
                    legend: { display: false }
                }
            }
        });
    }

    renderDeviceChart(data) {
        const ctx = document.getElementById('deviceChart');

        if (this.charts.device) {
            this.charts.device.destroy();
        }

        this.charts.device = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: this.getChartDefaults()
        });
    }

    getChartDefaults() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    titleColor: '#fff',
                    bodyColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: { size: 11 }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: { size: 11 }
                    }
                }
            }
        };
    }

    updateTransactionsTable(transactions) {
        const tbody = document.getElementById('transactionsBody');
        tbody.innerHTML = '';

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${transaction.id}</strong></td>
                <td>${transaction.date}</td>
                <td>${transaction.customer}</td>
                <td>${transaction.product}</td>
                <td><strong>$${transaction.amount.toFixed(2)}</strong></td>
                <td><span class="status-badge ${transaction.status}">${this.getStatusText(transaction.status)}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'completed': 'Concluído',
            'processing': 'Processando',
            'pending': 'Pendente'
        };
        return statusMap[status] || status;
    }

    exportToCSV() {
        const transactions = this.generateMockData().transactions;

        let csv = 'ID Pedido,Data/Hora,Cliente,Produto,Valor,Status\n';

        transactions.forEach(t => {
            csv += `${t.id},${t.date},${t.customer},${t.product},${t.amount},${this.getStatusText(t.status)}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selectblinds-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializa o dashboard quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

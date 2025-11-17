// Google Analytics 4 Integration Module
class GA4Integration {
    constructor() {
        this.apiEndpoint = '/api/ga4'; // Backend proxy endpoint
        this.propertyId = null; // Will be set from config
        this.isConnected = false;
        this.init();
    }

    async init() {
        // Tenta conectar com o GA4
        await this.testConnection();
    }

    async testConnection() {
        try {
            // Em produção, isso faria uma chamada real para o backend
            // que por sua vez chamaria a API do GA4
            const status = document.getElementById('ga4Status');

            // Simula conexão
            await this.delay(1000);

            this.isConnected = true;

            if (status) {
                status.querySelector('.status-text').textContent = 'Conectado ao GA4';
                status.querySelector('.status-indicator').style.background = '#38ef7d';
            }
        } catch (error) {
            console.error('Erro ao conectar com GA4:', error);
            this.showConnectionError();
        }
    }

    /**
     * Busca dados do GA4 para um período específico
     * @param {string} startDate - Data inicial (YYYY-MM-DD)
     * @param {string} endDate - Data final (YYYY-MM-DD)
     * @returns {Promise<Object>} Dados do GA4
     */
    async fetchAnalyticsData(startDate, endDate) {
        try {
            const response = await fetch(`${this.apiEndpoint}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    propertyId: this.propertyId,
                    dateRange: { startDate, endDate },
                    dimensions: ['date', 'deviceCategory', 'sourceMedium'],
                    metrics: [
                        'sessions',
                        'totalUsers',
                        'screenPageViews',
                        'conversions',
                        'totalRevenue',
                        'addToCarts',
                        'checkouts',
                        'ecommercePurchases'
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch GA4 data');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar dados do GA4:', error);
            throw error;
        }
    }

    /**
     * Busca dados do funil de conversão
     */
    async fetchConversionFunnel(startDate, endDate) {
        try {
            const response = await fetch(`${this.apiEndpoint}/funnel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    propertyId: this.propertyId,
                    dateRange: { startDate, endDate }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch funnel data');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar funil:', error);
            throw error;
        }
    }

    /**
     * Busca produtos mais vendidos
     */
    async fetchTopProducts(startDate, endDate, limit = 10) {
        try {
            const response = await fetch(`${this.apiEndpoint}/top-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    propertyId: this.propertyId,
                    dateRange: { startDate, endDate },
                    limit
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch top products');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    /**
     * Busca dados de tráfego por origem
     */
    async fetchTrafficSources(startDate, endDate) {
        try {
            const response = await fetch(`${this.apiEndpoint}/traffic-sources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    propertyId: this.propertyId,
                    dateRange: { startDate, endDate }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch traffic sources');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar origens de tráfego:', error);
            throw error;
        }
    }

    /**
     * Busca transações recentes
     */
    async fetchRecentTransactions(limit = 20) {
        try {
            const response = await fetch(`${this.apiEndpoint}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    propertyId: this.propertyId,
                    limit
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            throw error;
        }
    }

    /**
     * Busca métricas de ecommerce em tempo real
     */
    async fetchRealtimeData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/realtime`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    propertyId: this.propertyId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch realtime data');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar dados em tempo real:', error);
            throw error;
        }
    }

    /**
     * Configura o ID da propriedade do GA4
     */
    setPropertyId(propertyId) {
        this.propertyId = propertyId;
        localStorage.setItem('ga4_property_id', propertyId);
    }

    /**
     * Obtém o ID da propriedade armazenado
     */
    getPropertyId() {
        if (!this.propertyId) {
            this.propertyId = localStorage.getItem('ga4_property_id');
        }
        return this.propertyId;
    }

    /**
     * Obtém o token de autenticação
     */
    getAuthToken() {
        return localStorage.getItem('sb_dashboard_token');
    }

    /**
     * Mostra erro de conexão
     */
    showConnectionError() {
        const status = document.getElementById('ga4Status');
        if (status) {
            status.querySelector('.status-text').textContent = 'Erro na conexão com GA4';
            status.querySelector('.status-indicator').style.background = '#f5576c';
        }
        this.isConnected = false;
    }

    /**
     * Processa dados brutos do GA4 para o formato do dashboard
     */
    processGA4Data(rawData) {
        // Transforma os dados do GA4 no formato esperado pelo dashboard
        return {
            kpis: this.extractKPIs(rawData),
            funnel: this.extractFunnelData(rawData),
            revenue: this.extractRevenueData(rawData),
            traffic: this.extractTrafficData(rawData),
            products: this.extractProductsData(rawData),
            devices: this.extractDeviceData(rawData)
        };
    }

    extractKPIs(data) {
        // Extrai KPIs principais dos dados do GA4
        return {
            totalRevenue: data.totals?.totalRevenue || 0,
            totalVisitors: data.totals?.totalUsers || 0,
            conversionRate: data.totals?.conversionRate || 0,
            avgOrderValue: data.totals?.averageOrderValue || 0,
            totalOrders: data.totals?.ecommercePurchases || 0,
            abandonedCart: data.totals?.cartAbandonmentRate || 0
        };
    }

    extractFunnelData(data) {
        // Extrai dados do funil de conversão
        return {
            labels: ['Visitantes', 'Visualizações', 'Add to Cart', 'Checkout', 'Compras'],
            data: [
                data.funnel?.sessions || 0,
                data.funnel?.pageViews || 0,
                data.funnel?.addToCarts || 0,
                data.funnel?.checkouts || 0,
                data.funnel?.purchases || 0
            ]
        };
    }

    extractRevenueData(data) {
        // Extrai dados de receita por período
        const revenue = data.revenue || [];
        return {
            labels: revenue.map(r => r.date),
            data: revenue.map(r => r.amount)
        };
    }

    extractTrafficData(data) {
        // Extrai dados de tráfego por origem
        const traffic = data.trafficSources || [];
        return {
            labels: traffic.map(t => t.source),
            data: traffic.map(t => t.percentage)
        };
    }

    extractProductsData(data) {
        // Extrai dados dos produtos mais vendidos
        const products = data.topProducts || [];
        return {
            labels: products.map(p => p.name),
            data: products.map(p => p.quantity)
        };
    }

    extractDeviceData(data) {
        // Extrai distribuição por dispositivo
        const devices = data.devices || [];
        return {
            labels: devices.map(d => d.category),
            data: devices.map(d => d.percentage)
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Exporta a instância global
window.ga4Integration = new GA4Integration();

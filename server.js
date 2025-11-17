const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Middleware de compressão
app.use(compression());

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por janela
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

app.use('/api/', apiLimiter);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// ========================
// API Routes
// ========================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware de autenticação
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.substring(7);

    // Em produção, validar o token adequadamente
    // Por agora, apenas verifica se existe
    if (!token) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    next();
};

// ========================
// GA4 API Routes
// ========================

/**
 * Endpoint para buscar relatório do GA4
 */
app.post('/api/ga4/report', authenticate, async (req, res) => {
    try {
        const { propertyId, dateRange, dimensions, metrics } = req.body;

        // Aqui você integraria com a API do Google Analytics 4
        // usando a biblioteca googleapis
        const data = await fetchGA4Report(propertyId, dateRange, dimensions, metrics);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados do GA4:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do GA4' });
    }
});

/**
 * Endpoint para buscar funil de conversão
 */
app.post('/api/ga4/funnel', authenticate, async (req, res) => {
    try {
        const { propertyId, dateRange } = req.body;

        const data = await fetchConversionFunnel(propertyId, dateRange);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar funil:', error);
        res.status(500).json({ error: 'Erro ao buscar funil de conversão' });
    }
});

/**
 * Endpoint para buscar produtos mais vendidos
 */
app.post('/api/ga4/top-products', authenticate, async (req, res) => {
    try {
        const { propertyId, dateRange, limit } = req.body;

        const data = await fetchTopProducts(propertyId, dateRange, limit);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

/**
 * Endpoint para buscar origens de tráfego
 */
app.post('/api/ga4/traffic-sources', authenticate, async (req, res) => {
    try {
        const { propertyId, dateRange } = req.body;

        const data = await fetchTrafficSources(propertyId, dateRange);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar tráfego:', error);
        res.status(500).json({ error: 'Erro ao buscar origens de tráfego' });
    }
});

/**
 * Endpoint para buscar transações
 */
app.post('/api/ga4/transactions', authenticate, async (req, res) => {
    try {
        const { propertyId, limit } = req.body;

        const data = await fetchTransactions(propertyId, limit);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
});

/**
 * Endpoint para dados em tempo real
 */
app.post('/api/ga4/realtime', authenticate, async (req, res) => {
    try {
        const { propertyId } = req.body;

        const data = await fetchRealtimeData(propertyId);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados em tempo real:', error);
        res.status(500).json({ error: 'Erro ao buscar dados em tempo real' });
    }
});

/**
 * Endpoint para performance hora a hora
 */
app.post('/api/ga4/hourly-performance', authenticate, async (req, res) => {
    try {
        const { propertyId } = req.body;

        const data = await fetchHourlyPerformance(propertyId);

        res.json(data);
    } catch (error) {
        console.error('Erro ao buscar dados hora a hora:', error);
        res.status(500).json({ error: 'Erro ao buscar dados de performance hora a hora' });
    }
});

// ========================
// GA4 Integration Functions
// ========================

/**
 * Busca relatório do GA4 usando a API oficial
 */
async function fetchGA4Report(propertyId, dateRange, dimensions, metrics) {
    // Integração com Google Analytics Data API
    // Requer configuração de credenciais OAuth2 ou Service Account

    const { google } = require('googleapis');
    const analyticsdata = google.analyticsdata('v1beta');

    try {
        // Configurar autenticação
        const auth = await getGA4Auth();

        const response = await analyticsdata.properties.runReport({
            property: `properties/${propertyId}`,
            auth: auth,
            requestBody: {
                dateRanges: [
                    {
                        startDate: dateRange.startDate,
                        endDate: dateRange.endDate
                    }
                ],
                dimensions: dimensions.map(d => ({ name: d })),
                metrics: metrics.map(m => ({ name: m }))
            }
        });

        return processGA4Response(response.data);
    } catch (error) {
        console.error('Erro na API do GA4:', error);
        throw error;
    }
}

/**
 * Obtém autenticação para a API do GA4
 */
async function getGA4Auth() {
    const { google } = require('googleapis');

    // Opção 1: Service Account (recomendado para servidor)
    if (process.env.GA4_SERVICE_ACCOUNT_KEY) {
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GA4_SERVICE_ACCOUNT_KEY,
            scopes: ['https://www.googleapis.com/auth/analytics.readonly']
        });
        return auth;
    }

    // Opção 2: OAuth2 (para desenvolvimento)
    if (process.env.GA4_CLIENT_ID && process.env.GA4_CLIENT_SECRET) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GA4_CLIENT_ID,
            process.env.GA4_CLIENT_SECRET,
            process.env.GA4_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GA4_REFRESH_TOKEN
        });

        return oauth2Client;
    }

    throw new Error('Credenciais do GA4 não configuradas');
}

/**
 * Processa resposta da API do GA4
 */
function processGA4Response(data) {
    // Processa e formata os dados do GA4
    return {
        totals: extractTotals(data),
        rows: data.rows || [],
        dimensions: data.dimensionHeaders || [],
        metrics: data.metricHeaders || []
    };
}

function extractTotals(data) {
    const totals = {};

    if (data.totals && data.totals.length > 0) {
        data.metricHeaders.forEach((header, index) => {
            totals[header.name] = parseFloat(data.totals[0].metricValues[index].value);
        });
    }

    return totals;
}

async function fetchConversionFunnel(propertyId, dateRange) {
    // Implementar lógica para buscar dados do funil
    // Por enquanto, retorna dados simulados
    return {
        sessions: 45678,
        pageViews: 28934,
        addToCarts: 12456,
        checkouts: 5678,
        purchases: 1576
    };
}

async function fetchTopProducts(propertyId, dateRange, limit) {
    // Implementar lógica para buscar produtos mais vendidos
    return [];
}

async function fetchTrafficSources(propertyId, dateRange) {
    // Implementar lógica para buscar origens de tráfego
    return [];
}

async function fetchTransactions(propertyId, limit) {
    // Implementar lógica para buscar transações
    return [];
}

async function fetchRealtimeData(propertyId) {
    // Implementar lógica para buscar dados em tempo real
    return {};
}

async function fetchHourlyPerformance(propertyId) {
    // Implementar lógica para buscar dados hora a hora
    // Compara o dia atual com o mesmo dia da semana do ano passado

    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    // Ajusta para o mesmo dia da semana do ano passado
    const dayOfWeek = today.getDay();
    const daysToAdjust = today.getDay() - lastYear.getDay();
    lastYear.setDate(lastYear.getDate() + daysToAdjust);

    const currentHour = today.getHours();

    // Gera dados mock por enquanto
    // TODO: Integrar com GA4 API para dados reais
    const todayHourly = [];
    const lastYearHourly = [];

    for (let hour = 0; hour <= currentHour; hour++) {
        todayHourly.push({
            hour: hour,
            revenue: Math.floor(Math.random() * 5000) + 2000,
            visitors: Math.floor(Math.random() * 500) + 200,
            orders: Math.floor(Math.random() * 50) + 10,
            conversionRate: (Math.random() * 3 + 1).toFixed(2)
        });

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
            date: today.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            hourly: todayHourly
        },
        lastYear: {
            date: lastYear.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            hourly: lastYearHourly
        }
    };
}

// ========================
// Routes de páginas HTML
// ========================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   SelectBlinds Analytics Dashboard                   ║
║                                                       ║
║   🚀 Servidor rodando em http://localhost:${PORT}      ║
║                                                       ║
║   📊 Dashboard: http://localhost:${PORT}/dashboard     ║
║   🔐 Login: http://localhost:${PORT}/login             ║
║   ❤️  Health: http://localhost:${PORT}/api/health      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;

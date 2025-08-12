const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class BlindsPriceMonitor {
    constructor() {
        this.browser = null;
        this.page = null;
        this.priceHistory = [];
        this.outputFile = 'blinds_prices.json';
    }

    async initialize() {
        console.log('🚀 Iniciando monitor de preços do Blinds.com...');
        this.browser = await puppeteer.launch({
            headless: false, // Mostrar o navegador para debug
            defaultViewport: null,
            args: ['--start-maximized']
        });
        this.page = await this.browser.newPage();
        
        // Configurar user agent para parecer mais humano
        await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }

    async navigateToBlinds() {
        console.log('🌐 Navegando para Blinds.com...');
        await this.page.goto('https://www.blinds.com', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        // Aguardar carregamento da página
        await this.page.waitForTimeout(3000);
    }

    async searchForProduct(searchTerm) {
        console.log(`🔍 Procurando por: ${searchTerm}`);
        
        try {
            // Procurar campo de busca
            const searchSelector = 'input[type="search"], input[placeholder*="search"], input[name*="search"], .search-input, #search';
            await this.page.waitForSelector(searchSelector, { timeout: 10000 });
            
            // Limpar campo e digitar termo de busca
            await this.page.click(searchSelector);
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('A');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            await this.page.type(searchSelector, searchTerm);
            
            // Pressionar Enter para buscar
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(3000);
            
        } catch (error) {
            console.log('⚠️ Campo de busca não encontrado, tentando navegar diretamente...');
            // Tentar navegar diretamente para uma categoria
            await this.page.goto(`https://www.blinds.com/search?q=${encodeURIComponent(searchTerm)}`);
            await this.page.waitForTimeout(3000);
        }
    }

    async extractPrices() {
        console.log('💰 Extraindo preços...');
        
        const prices = await this.page.evaluate(() => {
            const priceElements = [];
            
            // Seletores comuns para preços
            const selectors = [
                '.price',
                '.product-price',
                '.price-current',
                '.sale-price',
                '[data-price]',
                '.price-value',
                '.product__price',
                '.price__current',
                '.price__sale',
                '.price__regular',
                '.product-price__current',
                '.product-price__sale',
                '.price-display',
                '.price-amount',
                '.price-text',
                '.product__price-current',
                '.product__price-sale'
            ];
            
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent.trim();
                    const price = text.replace(/[^\d.,]/g, '');
                    if (price && !isNaN(parseFloat(price))) {
                        priceElements.push({
                            text: text,
                            price: parseFloat(price),
                            selector: selector
                        });
                    }
                });
            });
            
            return priceElements;
        });
        
        return prices;
    }

    async extractProductInfo() {
        console.log('📦 Extraindo informações dos produtos...');
        
        const products = await this.page.evaluate(() => {
            const productElements = [];
            
            // Seletores para produtos
            const productSelectors = [
                '.product',
                '.product-item',
                '.product-card',
                '.product-tile',
                '.product-container',
                '[data-product]',
                '.item',
                '.card',
                '.tile'
            ];
            
            productSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el, index) => {
                    if (index < 10) { // Limitar a 10 produtos
                        const title = el.querySelector('h1, h2, h3, h4, .title, .product-title, .name')?.textContent?.trim();
                        const price = el.querySelector('.price, .product-price, .price-current, .sale-price')?.textContent?.trim();
                        const image = el.querySelector('img')?.src;
                        
                        if (title) {
                            productElements.push({
                                title: title,
                                price: price || 'Preço não encontrado',
                                image: image || 'Imagem não encontrada',
                                timestamp: new Date().toISOString()
                            });
                        }
                    }
                });
            });
            
            return productElements;
        });
        
        return products;
    }

    async saveData(data) {
        const timestamp = new Date().toISOString();
        const dataToSave = {
            timestamp: timestamp,
            url: this.page.url(),
            prices: data.prices,
            products: data.products
        };
        
        // Carregar dados existentes
        let existingData = [];
        if (fs.existsSync(this.outputFile)) {
            try {
                existingData = JSON.parse(fs.readFileSync(this.outputFile, 'utf8'));
            } catch (error) {
                console.log('⚠️ Erro ao carregar dados existentes, criando novo arquivo...');
            }
        }
        
        // Adicionar novos dados
        existingData.push(dataToSave);
        
        // Salvar arquivo
        fs.writeFileSync(this.outputFile, JSON.stringify(existingData, null, 2));
        console.log(`💾 Dados salvos em ${this.outputFile}`);
    }

    async monitorPrices(searchTerms = ['blinds', 'window blinds', 'roller shades']) {
        try {
            await this.initialize();
            await this.navigateToBlinds();
            
            for (const searchTerm of searchTerms) {
                console.log(`\n🔍 Monitorando: ${searchTerm}`);
                await this.searchForProduct(searchTerm);
                
                // Extrair dados
                const prices = await this.extractPrices();
                const products = await this.extractProductInfo();
                
                console.log(`💰 Encontrados ${prices.length} preços`);
                console.log(`📦 Encontrados ${products.length} produtos`);
                
                // Salvar dados
                await this.saveData({ prices, products });
                
                // Aguardar antes da próxima busca
                await this.page.waitForTimeout(2000);
            }
            
        } catch (error) {
            console.error('❌ Erro durante monitoramento:', error);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    async generateReport() {
        if (!fs.existsSync(this.outputFile)) {
            console.log('📊 Nenhum dado encontrado para gerar relatório');
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(this.outputFile, 'utf8'));
        
        console.log('\n📊 RELATÓRIO DE PREÇOS - BLINDS.COM');
        console.log('=====================================');
        
        data.forEach((entry, index) => {
            console.log(`\n📅 ${new Date(entry.timestamp).toLocaleString()}`);
            console.log(`🌐 URL: ${entry.url}`);
            console.log(`💰 Preços encontrados: ${entry.prices.length}`);
            console.log(`📦 Produtos encontrados: ${entry.products.length}`);
            
            if (entry.products.length > 0) {
                console.log('\n📋 Produtos:');
                entry.products.slice(0, 5).forEach(product => {
                    console.log(`  • ${product.title} - ${product.price}`);
                });
            }
        });
    }
}

// Função principal
async function main() {
    const monitor = new BlindsPriceMonitor();
    
    // Argumentos da linha de comando
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'monitor':
            const searchTerms = args.slice(1) || ['blinds', 'window blinds', 'roller shades'];
            await monitor.monitorPrices(searchTerms);
            break;
            
        case 'report':
            await monitor.generateReport();
            break;
            
        default:
            console.log('📖 Uso:');
            console.log('  node blinds_monitor.js monitor [termos de busca...]');
            console.log('  node blinds_monitor.js report');
            console.log('\n📝 Exemplos:');
            console.log('  node blinds_monitor.js monitor "cellular shades" "roman shades"');
            console.log('  node blinds_monitor.js report');
    }
}

// Executar se for o arquivo principal
if (require.main === module) {
    main().catch(console.error);
}

module.exports = BlindsPriceMonitor; 
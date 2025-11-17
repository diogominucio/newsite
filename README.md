# SelectBlinds Analytics Dashboard

Dashboard profissional de analytics e KPIs para ecommerce com integração ao Google Analytics 4.

## 🚀 Funcionalidades

- ✅ **Sistema de Autenticação** - Login seguro com usuário e senha
- 📊 **Dashboard Interativo** - KPIs em tempo real com visualizações modernas
- 🎯 **Funil de Conversão** - Análise completa do funil de vendas
- 💰 **Métricas de Receita** - Acompanhamento de vendas e ticket médio
- 🛒 **Análise de Carrinho** - Taxa de abandono e conversões
- 📈 **Gráficos Interativos** - Visualizações com Chart.js
- 🌐 **Origens de Tráfego** - Análise de canais de aquisição
- 📱 **Responsive Design** - Otimizado para desktop, tablet e mobile
- 🔗 **Integração GA4** - Conexão direta com Google Analytics 4

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta do Google Analytics 4 configurada
- Credenciais de API do Google Cloud Platform

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/diogominucio/newsite.git
cd newsite
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
PORT=3000
GA4_PROPERTY_ID=sua-propriedade-id
GA4_SERVICE_ACCOUNT_KEY=caminho/para/chave.json
```

### 4. Configure o Google Analytics 4

#### Opção A: Service Account (Recomendado)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Analytics Data API**
4. Crie uma Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Baixe a chave JSON
5. No Google Analytics, adicione o email da Service Account com permissão de **Viewer**
6. Coloque o caminho da chave JSON no `.env`

#### Opção B: OAuth2 (Desenvolvimento)

1. Configure OAuth2 no Google Cloud Console
2. Adicione as credenciais no `.env`
3. Execute o fluxo de OAuth para obter o refresh token

## 🚀 Executando o Dashboard

### Modo de Desenvolvimento

```bash
npm run dev
```

### Modo de Produção

```bash
npm start
```

O dashboard estará disponível em:
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Health Check**: http://localhost:3000/api/health

## 🔐 Credenciais de Login

Por padrão, as seguintes credenciais estão disponíveis (definidas em `auth.js`):

| Usuário   | Senha              | Perfil              |
|-----------|-------------------|---------------------|
| admin     | selectblinds2024  | Administrator       |
| analytics | analytics@sb      | Analytics Manager   |
| manager   | manager123        | Store Manager       |

**⚠️ IMPORTANTE**: Em produção, implemente autenticação adequada com banco de dados e hashing de senhas.

## 📊 KPIs Disponíveis

O dashboard rastreia as seguintes métricas:

1. **Receita Total** - Receita gerada no período
2. **Visitantes** - Total de usuários únicos
3. **Taxa de Conversão** - Percentual de visitantes que compram
4. **Ticket Médio** - Valor médio por pedido
5. **Total de Pedidos** - Quantidade de vendas concluídas
6. **Carrinho Abandonado** - Taxa de abandono de carrinho

## 🎨 Gráficos e Visualizações

- **Funil de Conversão** - Visualização do funil completo
- **Receita ao Longo do Tempo** - Gráfico de linha temporal
- **Origens de Tráfego** - Distribuição por canal
- **Produtos Mais Vendidos** - Top produtos por vendas
- **Distribuição por Dispositivo** - Desktop vs Mobile vs Tablet

## 🔌 API Endpoints

### Autenticação

Todos os endpoints da API requerem autenticação via Bearer Token.

```javascript
Authorization: Bearer <seu-token>
```

### Endpoints Disponíveis

```bash
POST /api/ga4/report          # Busca relatório do GA4
POST /api/ga4/funnel          # Busca dados do funil
POST /api/ga4/top-products    # Produtos mais vendidos
POST /api/ga4/traffic-sources # Origens de tráfego
POST /api/ga4/transactions    # Transações recentes
POST /api/ga4/realtime        # Dados em tempo real
```

## 🛠️ Estrutura do Projeto

```
newsite/
├── login.html              # Página de login
├── login.css              # Estilos do login
├── dashboard.html         # Dashboard principal
├── dashboard.css          # Estilos do dashboard
├── auth.js               # Sistema de autenticação
├── dashboard.js          # Lógica do dashboard
├── ga4-integration.js    # Integração com GA4
├── server.js             # Servidor Express
├── package.json          # Dependências
├── .env.example          # Exemplo de variáveis
└── README.md            # Documentação
```

## 🌐 Deploy

### GitHub Pages (Frontend Estático)

O dashboard pode ser servido estaticamente via GitHub Pages:

1. Configure os arquivos estáticos
2. Faça push para a branch `main`
3. Acesse: https://diogominucio.github.io/newsite

**Nota**: Para integração completa com GA4, você precisará hospedar o backend separadamente.

### Deploy do Backend

Opções recomendadas:
- **Heroku** - Deploy fácil para Node.js
- **Google Cloud Run** - Integração nativa com Google Cloud
- **AWS EC2** - Controle total do servidor
- **Vercel** - Deploy serverless

## 📝 Configuração Adicional

### Customização de Credenciais

Edite `auth.js` para adicionar/remover usuários:

```javascript
static CREDENTIALS = {
    'seu_usuario': 'sua_senha',
    // adicione mais usuários aqui
};
```

### Personalização de Métricas

Edite `ga4-integration.js` para customizar as métricas do GA4:

```javascript
metrics: [
    'sessions',
    'totalUsers',
    // adicione mais métricas aqui
]
```

## 🐛 Troubleshooting

### Erro de Autenticação GA4

```bash
Error: GA4 credentials not configured
```

**Solução**: Verifique se as credenciais do GA4 estão configuradas corretamente no `.env`

### Dados Não Carregam

1. Verifique a conexão com a API do GA4
2. Confirme que o Property ID está correto
3. Verifique as permissões da Service Account

### CORS Error

**Solução**: Adicione sua origem no `.env`:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://seu-dominio.com
```

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para mais detalhes.

## 👥 Suporte

Para questões e suporte:
- Abra uma issue no GitHub
- Email: suporte@selectblinds.com

## 🎯 Roadmap

- [ ] Autenticação com OAuth2
- [ ] Exportação de relatórios PDF
- [ ] Alertas personalizados por email
- [ ] Comparação de períodos
- [ ] Dashboard em tempo real com WebSockets
- [ ] Integração com outros analytics (Meta, TikTok)
- [ ] Multi-idiomas

---

**Desenvolvido com ❤️ para SelectBlinds**

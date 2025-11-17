# 🚀 Guia Rápido - SelectBlinds Dashboard

## Início Rápido em 3 Passos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Iniciar o Servidor

```bash
npm start
```

### 3️⃣ Acessar o Dashboard

Abra seu navegador em: **http://localhost:3000**

## 🔐 Login

Use uma das credenciais padrão:

```
Usuário: admin
Senha: selectblinds2024
```

ou

```
Usuário: analytics
Senha: analytics@sb
```

## 📊 Recursos Disponíveis

Após o login, você terá acesso a:

- ✅ KPIs em tempo real
- ✅ Funil de conversão
- ✅ Gráficos interativos
- ✅ Métricas de ecommerce
- ✅ Análise de tráfego
- ✅ Produtos mais vendidos

## ⚙️ Configuração do Google Analytics 4

Para integração real com GA4, configure o arquivo `.env`:

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais
nano .env
```

Adicione suas credenciais do GA4:

```env
GA4_PROPERTY_ID=seu-property-id
GA4_SERVICE_ACCOUNT_KEY=caminho/para/chave.json
```

## 🎨 Modo de Desenvolvimento

Com hot-reload automático:

```bash
npm run dev
```

## 📱 Acesso Remoto

Para testar em dispositivos móveis na mesma rede:

```bash
# Encontre seu IP local
ipconfig getifaddr en0  # Mac
hostname -I            # Linux
ipconfig              # Windows

# Acesse via: http://SEU-IP:3000
```

## 🐛 Problemas Comuns

### Porta já em uso

```bash
# Altere a porta no .env
PORT=3001
```

### Módulos não encontrados

```bash
rm -rf node_modules
npm install
```

## 📚 Documentação Completa

Veja [README.md](README.md) para documentação detalhada.

## 💡 Dica

Clique 5 vezes no logo da página de login para ver as credenciais no console!

---

**Pronto para começar!** 🎉

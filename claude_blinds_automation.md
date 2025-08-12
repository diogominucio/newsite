# Automação Blinds.com com Claude Code + MCP

## Como usar o Claude Code para monitorar preços no Blinds.com

### 1. Iniciar o Claude Code com MCP Browser
```bash
npx @anthropic-ai/claude-code
```

### 2. Comandos para automatizar o Blinds.com

#### Navegar para o site:
```
Abra o Chrome e navegue para https://www.blinds.com
```

#### Procurar por produtos específicos:
```
Procure por "cellular shades" no site
```

#### Extrair preços:
```
Extraia todos os preços visíveis na página atual
```

#### Monitorar categorias específicas:
```
Navegue para a seção de "roller shades" e extraia os preços
```

#### Salvar dados:
```
Salve os preços encontrados em um arquivo JSON
```

### 3. Scripts de Automação Completa

#### Monitoramento básico:
```
1. Abra o Chrome
2. Navegue para https://www.blinds.com
3. Procure por "cellular shades"
4. Extraia todos os preços
5. Salve em um arquivo chamado "prices.json"
6. Repita para "roman shades"
7. Repita para "roller shades"
```

#### Monitoramento avançado:
```
1. Abra o Chrome em modo headless
2. Navegue para https://www.blinds.com
3. Para cada categoria ["cellular shades", "roman shades", "roller shades", "venetian blinds"]:
   - Procure pela categoria
   - Extraia preços e nomes dos produtos
   - Salve com timestamp
   - Aguarde 2 segundos
4. Gere um relatório com todos os preços encontrados
```

### 4. Comandos úteis do Claude Code

#### Para extrair dados específicos:
```
Extraia o nome, preço e URL de imagem dos primeiros 10 produtos na página
```

#### Para navegar em categorias:
```
Clique no menu "Products" e depois em "Cellular Shades"
```

#### Para monitorar mudanças de preço:
```
Compare os preços atuais com os preços salvos anteriormente e me avise se houve mudanças
```

### 5. Exemplo de sessão completa:

```
Claude, vou te dar uma tarefa de automação:

1. Abra o Chrome
2. Vá para https://www.blinds.com
3. Procure por "cellular shades"
4. Extraia os preços dos primeiros 5 produtos
5. Salve os dados em um arquivo JSON com timestamp
6. Repita o processo para "roman shades"
7. Gere um relatório comparativo dos preços

Execute esta automação passo a passo e me mostre os resultados.
```

### 6. Dicas para melhor automação:

- **Use seletores específicos**: "Extraia preços dos elementos com classe 'price'"
- **Aguarde carregamento**: "Aguarde a página carregar completamente antes de extrair dados"
- **Trate erros**: "Se não encontrar o campo de busca, tente navegar diretamente para a URL de busca"
- **Salve dados incrementais**: "Adicione novos dados ao arquivo existente sem sobrescrever"

### 7. Monitoramento contínuo:

Para monitoramento contínuo, você pode:
1. Executar a automação periodicamente
2. Configurar alertas para mudanças de preço
3. Gerar relatórios diários/semanais
4. Comparar preços entre diferentes categorias

### 8. Arquivos gerados:

- `prices.json`: Dados dos preços extraídos
- `report.txt`: Relatório em texto
- `comparison.csv`: Comparação de preços em formato CSV 
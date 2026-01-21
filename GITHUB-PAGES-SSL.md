# Configuração de SSL/HTTPS no GitHub Pages

Este documento explica como garantir que o site QEL@0xpblab use HTTPS/SSL corretamente no GitHub Pages.

## SSL Automático do GitHub Pages

O GitHub Pages fornece SSL/HTTPS automaticamente para todos os sites. No entanto, é necessário habilitar a opção "Enforce HTTPS" nas configurações do repositório.

## Como Habilitar HTTPS

1. Acesse o repositório no GitHub: `https://github.com/0xpbl/0xpbl`

2. Vá em **Settings** (Configurações)

3. No menu lateral, clique em **Pages**

4. Na seção **Build and deployment**, procure pela opção **Enforce HTTPS**

5. Marque a caixa de seleção **Enforce HTTPS**

6. Aguarde alguns minutos para que as alterações sejam aplicadas

## O que o Código Faz

O código do site já implementa várias medidas de segurança:

### 1. Redirect Automático HTTP → HTTPS

O JavaScript redireciona automaticamente qualquer acesso via HTTP para HTTPS:

```javascript
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
  window.location.replace(window.location.href.replace(/^http:/, 'https:'));
}
```

### 2. Meta Tags de Segurança

O `index.html` inclui meta tags que forçam o uso de HTTPS:

- **Content-Security-Policy**: Força upgrade de requisições inseguras para HTTPS
- **Strict-Transport-Security**: Informa ao navegador para sempre usar HTTPS

### 3. Processamento de Recursos

O código processa automaticamente imagens e scripts para garantir que usem HTTPS:

- Imagens com `http://` são automaticamente convertidas para `https://`
- Scripts externos são verificados e forçados a usar HTTPS

## Verificação

Após habilitar "Enforce HTTPS", verifique:

1. Acesse o site via `https://0xpbl.github.io/0xpbl/`
2. Verifique se há um cadeado verde na barra de endereços
3. Tente acessar via `http://` - deve redirecionar automaticamente para `https://`
4. Abra o console do navegador (F12) e verifique se não há erros de "mixed content"

## Problemas Comuns

### Certificado SSL não aparece

- Aguarde alguns minutos após habilitar "Enforce HTTPS"
- Limpe o cache do navegador
- Verifique se o domínio está configurado corretamente

### Erros de "Mixed Content"

- Verifique se todos os recursos externos (imagens, scripts, CSS) usam HTTPS
- O código já força HTTPS automaticamente, mas verifique manualmente se necessário

### Redirect não funciona

- Certifique-se de que o JavaScript está carregando corretamente
- Verifique o console do navegador para erros
- O redirect funciona apenas em produção (não em localhost)

## Suporte

Se você encontrar problemas com SSL/HTTPS:

1. Verifique as configurações do GitHub Pages
2. Consulte a documentação oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
3. Verifique o console do navegador para mensagens de erro específicas

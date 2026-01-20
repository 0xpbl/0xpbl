# Configuração do Deploy com GitHub Actions

## Problema: Workflow não está disparando

Se o workflow não está disparando, verifique os seguintes pontos:

## 1. Verificar se o workflow foi commitado e enviado

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for deploy"
git push origin main
```

## 2. Configurar GitHub Pages para usar GitHub Actions

**IMPORTANTE:** Este é o passo mais crítico!

1. Acesse o repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione **"GitHub Actions"** (não "Deploy from a branch")
4. Salve as alterações

**Nota:** Se você não ver a opção "GitHub Actions", pode ser que:
- O repositório não tenha GitHub Pages habilitado
- Você precisa habilitar GitHub Pages primeiro em Settings > Pages

## 3. Verificar permissões do repositório

1. Vá em **Settings** > **Actions** > **General**
2. Em **Workflow permissions**, certifique-se de que está configurado como:
   - **Read and write permissions** (ou pelo menos **Read repository contents and packages permissions**)
   - Marque **"Allow GitHub Actions to create and approve pull requests"** se necessário

## 4. Verificar se o workflow aparece na aba Actions

1. Acesse a aba **Actions** no repositório
2. Você deve ver o workflow "Deploy to GitHub Pages" listado
3. Se não aparecer, pode ser que o arquivo não esteja na branch correta

## 5. Executar manualmente (teste)

Após configurar o GitHub Pages para usar "GitHub Actions", você pode:

1. Ir na aba **Actions**
2. Selecionar o workflow "Deploy to GitHub Pages"
3. Clicar em **"Run workflow"** > **"Run workflow"** (botão verde)
4. Isso deve disparar o deploy manualmente

## 6. Verificar logs em caso de erro

Se o workflow executar mas falhar:

1. Vá na aba **Actions**
2. Clique no workflow que falhou
3. Veja os logs de cada step para identificar o problema

## Checklist de Verificação

- [ ] Arquivo `.github/workflows/deploy.yml` existe e está commitado
- [ ] Arquivo foi enviado para o repositório remoto (`git push`)
- [ ] GitHub Pages está configurado para usar **"GitHub Actions"** (não "Deploy from a branch")
- [ ] Permissões do workflow estão configuradas corretamente
- [ ] Workflow aparece na aba Actions do GitHub

## Solução de Problemas Comuns

### Workflow não aparece na aba Actions
- Verifique se o arquivo está na branch `main`
- Verifique se o arquivo tem a extensão `.yml` (não `.yaml`)
- Verifique se a sintaxe YAML está correta

### Workflow executa mas falha no deploy
- Verifique se o GitHub Pages está configurado para usar "GitHub Actions"
- Verifique as permissões do repositório
- Verifique os logs do workflow para ver o erro específico

### Workflow não dispara em push
- Verifique se está fazendo push na branch `main`
- Verifique se o workflow tem o trigger `on: push: branches: - main`
- Tente executar manualmente via `workflow_dispatch` primeiro

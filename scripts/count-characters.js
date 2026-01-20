#!/usr/bin/env node

/**
 * Script para calcular caracteres e páginas de pocket book
 * dos documentos em português do QEL@0xpblab
 */

const fs = require('fs');
const path = require('path');

// Configurações
const HISTORY_DIR = path.join(__dirname, '..', 'thehistory');
const CHARS_PER_PAGE = 1500; // Caracteres por página em pocket book (estimativa conservadora)

// Função para contar caracteres e palavras
function countText(text) {
  const withSpaces = text.length;
  const withoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  return {
    withSpaces,
    withoutSpaces,
    words
  };
}

// Função para limpar conteúdo markdown (remover código, badges, etc.)
function cleanMarkdown(content) {
  // Remover blocos de código
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // Remover badges (imagens de shields.io)
  content = content.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '');
  content = content.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // Remover links markdown (manter apenas o texto)
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remover metadados YAML se houver
  if (content.startsWith('---')) {
    const yamlEnd = content.indexOf('---', 3);
    if (yamlEnd !== -1) {
      content = content.substring(yamlEnd + 3).trim();
    }
  }
  
  return content;
}

// Função para processar um arquivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const cleaned = cleanMarkdown(content);
    const stats = countText(cleaned);
    
    return {
      filename: path.basename(filePath),
      ...stats
    };
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error.message);
    return null;
  }
}

// Função principal
function main() {
  console.log('📊 Estatísticas dos Documentos em Português');
  console.log('===========================================\n');
  
  // Ler arquivos da pasta thehistory (exceto en/)
  const files = fs.readdirSync(HISTORY_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(HISTORY_DIR, file));
  
  if (files.length === 0) {
    console.log('❌ Nenhum arquivo .md encontrado em thehistory/');
    return;
  }
  
  // Processar cada arquivo
  const results = files
    .map(processFile)
    .filter(result => result !== null);
  
  // Calcular totais
  const totals = results.reduce((acc, file) => {
    acc.withSpaces += file.withSpaces;
    acc.withoutSpaces += file.withoutSpaces;
    acc.words += file.words;
    return acc;
  }, { withSpaces: 0, withoutSpaces: 0, words: 0 });
  
  // Ordenar por tamanho (maior primeiro)
  results.sort((a, b) => b.withSpaces - a.withSpaces);
  
  // Exibir estatísticas por arquivo
  console.log(`Arquivos processados: ${results.length}\n`);
  console.log('Estatísticas por arquivo:');
  results.forEach(file => {
    const chars = file.withSpaces.toLocaleString('pt-BR');
    const words = file.words.toLocaleString('pt-BR');
    console.log(`  - ${file.filename}: ${chars} caracteres (${words} palavras)`);
  });
  
  // Exibir totais
  console.log('\n📈 Totais:');
  console.log(`  - Total de caracteres (com espaços): ${totals.withSpaces.toLocaleString('pt-BR')}`);
  console.log(`  - Total de caracteres (sem espaços): ${totals.withoutSpaces.toLocaleString('pt-BR')}`);
  console.log(`  - Total de palavras: ${totals.words.toLocaleString('pt-BR')}`);
  
  // Calcular páginas
  const pages = Math.ceil(totals.withSpaces / CHARS_PER_PAGE);
  
  console.log('\n📖 Estimativa de Páginas (Pocket Book):');
  console.log(`  - Caracteres por página: ~${CHARS_PER_PAGE.toLocaleString('pt-BR')}`);
  console.log(`  - Total de páginas: ~${pages.toLocaleString('pt-BR')} páginas`);
  
  // Informações adicionais
  const avgWordsPerPage = Math.round(totals.words / pages);
  const avgCharsPerWord = (totals.withoutSpaces / totals.words).toFixed(2);
  
  console.log('\n📝 Informações Adicionais:');
  console.log(`  - Média de palavras por página: ~${avgWordsPerPage}`);
  console.log(`  - Média de caracteres por palavra: ~${avgCharsPerWord}`);
  
  console.log('\n✅ Análise concluída!');
}

// Executar
main();

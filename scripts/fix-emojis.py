#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para corrigir emojis quebrados nos documentos Markdown
"""

import os
import re
from pathlib import Path

# Mapeamento de padrões para emojis corretos
REPLACEMENTS = [
    # Padrões com caractere de substituição UTF-8 (U+FFFD) ou qualquer caractere não-ASCII inválido
    (r'##\s+[^\x20-\x7E📋ℹ️📄👔🌍📚🎖️❄️🌟🔮🏢🧾🍬🎻⚖️⚒️🕵️🥭👴🦹📺📚👶🚀📖🎨🤝👥⚠️📜📞🏢📧🗺️🎓🌌]\s+Índice', '## 📋 Índice'),
    (r'##\s+[^\x20-\x7E📋ℹ️📄👔🌍📚🎖️❄️🌟🔮🏢🧾🍬🎻⚖️⚒️🕵️🥭👴🦹📺📚👶🚀📖🎨🤝👥⚠️📜📞🏢📧🗺️🎓🌌]\s+Sobre', '## ℹ️ Sobre'),
    (r'###\s+[^\x20-\x7E📋ℹ️📄👔🌍📚🎖️❄️🌟🔮🏢🧾🍬🎻⚖️⚒️🕵️🥭👴🦹📺📚👶🚀📖🎨🤝👥⚠️📜📞🏢📧🗺️🎓🌌]\s+O Primeiro Documento', '### 📄 O Primeiro Documento'),
    (r'###\s+[^\x20-\x7E📋ℹ️📄👔🌍📚🎖️❄️🌟🔮🏢🧾🍬🎻⚖️⚒️🕵️🥭👴🦹📺📚👶🚀📖🎨🤝👥⚠️📜📞🏢📧🗺️🎓🌌]\s+Liderança Quântica', '### 👔 Liderança Quântica'),
    (r'##\s+[^\x20-\x7E📋ℹ️📄👔🌍📚🎖️❄️🌟🔮🏢🧾🍬🎻⚖️⚒️🕵️🥭👴🦹📺📚👶🚀📖🎨🤝👥⚠️📜📞🏢📧🗺️🎓🌌]\s+Participação em Eventos Históricos', '## 🌍 Participação em Eventos Históricos'),
]

def fix_file(filepath):
    """Corrige emojis quebrados em um arquivo"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Aplicar todas as substituições
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        # Se houve mudanças, salvar
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")
        return False

def main():
    """Processa todos os arquivos .md em thehistory/"""
    base_dir = Path('thehistory')
    if not base_dir.exists():
        print("Diretório thehistory/ não encontrado!")
        return
    
    fixed_count = 0
    total_count = 0
    
    # Processar todos os arquivos .md
    for md_file in base_dir.rglob('*.md'):
        total_count += 1
        if fix_file(md_file):
            fixed_count += 1
            print(f"Corrigido: {md_file}")
    
    print(f"\nProcessados: {total_count} arquivos")
    print(f"Corrigidos: {fixed_count} arquivos")

if __name__ == '__main__':
    main()

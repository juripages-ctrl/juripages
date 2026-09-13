import os
import shutil
import re

# Caminho absoluto da pasta public_html (com base no ambiente)
BASE_DIR = r"c:\Espaço de Trabalho\JuriPages\Interno\Portifólio-Felipe\public_html"
HTML_PATH = os.path.join(BASE_DIR, r"sites-e-landing-pages-para-advogados\index.html")

# Dicionário mapeando os nomes antigos para os novos com base na análise de palavras-chave
# Formato: "caminho_relativo_no_html": "novo_caminho_relativo_no_html"
image_mappings = {
    "../assets/imagem/faviicon.webp": "../assets/imagem/favicon-criacao-de-site-para-advogados.webp",
    "../assets/imagem/juripages.webp": "../assets/imagem/agencia-de-marketing-juridico-juripages.webp",
    "../assets/imagem/backg01.webp": "../assets/imagem/fundo-criacao-de-landing-page-para-advogados.webp",
    "../assets/imagem/perfis/01.enc": "../assets/imagem/perfis/advogado-cliente-satisfeito-1.enc",
    "../assets/imagem/perfis/02.enc": "../assets/imagem/perfis/advogado-cliente-satisfeito-2.enc",
    "../assets/imagem/perfis/03.enc": "../assets/imagem/perfis/advogado-cliente-satisfeito-3.enc",
    "../assets/imagem/perfis/04.enc": "../assets/imagem/perfis/advogado-cliente-satisfeito-4.enc",
    "../assets/imagem/screencapture-adv-ishiiadvogados-advogado-trabalhista-empresarial-2026-07-31-15_40_59.webp": "../assets/imagem/portfolio-site-para-escritorio-de-advocacia-trabalhista.webp",
    "../assets/imagem/screencapture-escritorioeulaliooliveira-br-advogado-bancario-2026-07-31-15_40_05.webp": "../assets/imagem/portfolio-site-para-escritorio-de-advocacia-bancario.webp",
    "../assets/imagem/bpsite.webp": "../assets/imagem/portfolio-landing-page-direito-de-familia.webp",
    "../assets/imagem/hmsite.webp": "../assets/imagem/portfolio-site-advocacia-hipolito-mourao.webp",
    "../assets/imagem/sbsite.webp": "../assets/imagem/portfolio-site-para-escritorio-de-advocacia-sb.webp",
    "../assets/imagem/iasite.webp": "../assets/imagem/portfolio-site-advogada-ingrhid.webp",
    "../assets/imagem/fbsite.webp": "../assets/imagem/portfolio-site-advocacia-fortuna-bacelar.webp",
    "../assets/imagem/rpsite.webp": "../assets/imagem/portfolio-site-advocacia-romanzini.webp",
    "../assets/imagem/logos/Alvaro-Alfredo_logotipo_horizontal-01-scaled-1-300x100-1.webp": "../assets/imagem/logos/cliente-advogado-alvaro-alfredo.webp",
    "../assets/imagem/logos/Copia_de_5-removebg-preview-2-2-e1745499268558-300x184-copiar.webp": "../assets/imagem/logos/cliente-advocacia-especializada.webp",
    "../assets/imagem/logos/DIREITO-copiar-3.webp": "../assets/imagem/logos/cliente-direito-de-familia.webp",
    "../assets/imagem/logos/IP-MKT-01-1.webp": "../assets/imagem/logos/parceiro-impetus-marketing.webp",
    "../assets/imagem/logos/Logo-Cleyton-Vertical-300x62-2.webp": "../assets/imagem/logos/cliente-advogado-cleyton.webp",
    "../assets/imagem/logos/Logotipo-Horizontal-1-1.webp": "../assets/imagem/logos/cliente-prospera-direito.webp",
    "../assets/imagem/logos/colorido_vertical-png-300x74-1.webp": "../assets/imagem/logos/cliente-advogada-karla-vaz.webp",
    "../assets/imagem/logos/logoHorizontal-1.webp": "../assets/imagem/logos/parceiro-mega-ads.webp",
    "../assets/imagem/logos/logoHorizontal.webp": "../assets/imagem/logos/cliente-nascimento-abbade.webp",
    "../assets/imagem/depoimentos/Print-01-708x1536.webp": "../assets/imagem/depoimentos/depoimento-criacao-de-site-para-advogado-1.webp",
    "../assets/imagem/depoimentos/Print-02-708x1536.webp": "../assets/imagem/depoimentos/depoimento-criacao-de-site-para-advogado-2.webp",
    "../assets/imagem/depoimentos/Print-03-1-708x1536.webp": "../assets/imagem/depoimentos/depoimento-criacao-de-site-para-advogado-3.webp",
    "../assets/imagem/depoimentos/WhatsApp-Image-2025-09-20-at-10.45.13-copiar-708x1536.webp": "../assets/imagem/depoimentos/avaliacao-criacao-de-landing-page-juridica.webp",
    "../assets/imagem/Planilha-de-teses-validadas-1536x864.webp": "../assets/imagem/estrategia-marketing-juridico-dados.webp"
}

def resolve_path(relative_path):
    # relative_path ex: "../assets/imagem/faviicon.webp"
    # O HTML está em sites-e-landing-pages-para-advogados/index.html
    # Portanto ".." aponta para public_html
    clean_path = relative_path.replace("../", "")
    return os.path.join(BASE_DIR, os.path.normpath(clean_path))

def main():
    print("Iniciando otimização de imagens SEO...")
    
    # Lendo o HTML
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()

    copiadas = 0
    substituidas = 0

    for old_rel, new_rel in image_mappings.items():
        old_abs = resolve_path(old_rel)
        new_abs = resolve_path(new_rel)

        # Copiar imagem se existir
        if os.path.exists(old_abs):
            # Criar diretórios destino caso não existam
            os.makedirs(os.path.dirname(new_abs), exist_ok=True)
            
            if not os.path.exists(new_abs):
                shutil.copy2(old_abs, new_abs)
                copiadas += 1
                print(f"[COPIADO] {os.path.basename(old_abs)} -> {os.path.basename(new_abs)}")
            else:
                print(f"[EXISTE] {os.path.basename(new_abs)} já existe, pulando cópia.")
                
            # Atualizar HTML (substituição simples de string)
            if old_rel in html_content:
                html_content = html_content.replace(old_rel, new_rel)
                substituidas += 1
        else:
            print(f"[ERRO] Arquivo antigo não encontrado: {old_abs}")
            
    # Salvar o HTML
    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"\nFinalizado! Imagens copiadas: {copiadas}. Substituições no HTML: {substituidas}.")

if __name__ == "__main__":
    main()

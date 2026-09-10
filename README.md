# Portugal Engenharia — pacote para GitHub

Este pacote contém a versão React/Vite da página institucional da Portugal Engenharia, com identidade editorial industrial, simulador preliminar de energia solar, formulário de diagnóstico, serviços, FAQ e documentação da próxima fase do produto.

## Instalação

Use Node.js 20 ou superior e o gerenciador de pacotes já adotado no projeto:

```bash
pnpm install
pnpm run check
pnpm run build
pnpm run dev
```

A aplicação pública está em `client/`. O servidor em `server/` é o servidor estático de produção incluído no template. A pasta `client/public/assets/` contém os quatro assets necessários e foi usada para tornar este pacote independente dos caminhos `/manus-storage/` do ambiente original.

## Arquivos principais

| Arquivo | Função |
|---|---|
| `client/src/pages/Home.tsx` | Landing page, simulador, formulário e interações. |
| `client/src/index.css` | Design system e responsividade. |
| `client/src/App.tsx` | Rota principal e provedores. |
| `client/index.html` | Metadados e idioma da página. |
| `client/public/assets/` | Hero, foto de inspeção, blueprint e logo. |
| `docs/simulador-financeiro.md` | Fórmulas, premissas e pontos de revisão. |
| `docs/guia-substituicao-repositorio.md` | Guia de integração. |
| `docs/arquitetura-plataforma-clientes.md` | Plano da área autenticada. |
| `docs/ia-automacao-e-infraestrutura.md` | Recomendações para IA, dados e hospedagem. |

## Atenção antes de publicar

O formulário atual demonstra o fluxo no navegador e mostra uma confirmação local. Ele ainda não envia dados para Google Sheets, CRM ou e-mail. Para produção, conecte-o a uma rota segura, Apps Script controlado ou backend com credenciais protegidas.

O simulador é uma prévia comercial. Antes de usar os resultados como proposta, revise tarifas, produtividade, preço por kWp, margem, custos de instalação, homologação, adequações elétricas e critérios de economia. As premissas estão documentadas em `docs/simulador-financeiro.md`.

Substitua o número de WhatsApp, e-mail, redes sociais, cidades atendidas, textos de experiência e referências técnicas pelos dados oficiais da empresa antes de publicar.

## Integração com repositório existente

Faça uma branch ou backup antes de substituir arquivos. Se o seu repositório já tiver uma aplicação React, copie os componentes e estilos de forma seletiva. Se estiver usando o template inteiro, copie `client/`, `server/`, `shared/`, os arquivos de configuração e `package.json`, preservando os seus segredos e variáveis de ambiente.

Não publique chaves do Google, tokens, credenciais de banco ou arquivos `.env` no GitHub.

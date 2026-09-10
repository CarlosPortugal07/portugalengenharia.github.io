# Guia de substituição no repositório

## O que foi alterado

A versão atual do site é uma aplicação React com Vite, TypeScript e Tailwind. A página principal concentra a experiência institucional em `client/src/pages/Home.tsx`. O sistema visual está em `client/src/index.css`, as rotas estão em `client/src/App.tsx` e os metadados estão em `client/index.html`.

A versão também usa quatro assets visuais gerados e armazenados no ciclo de vida do projeto:

```text
/manus-storage/portugal-engenharia-hero_0fc58bff.jpg
/manus-storage/portugal-engenharia-inspection_0d29b135.jpg
/manus-storage/portugal-engenharia-blueprint_3980b22d.png
/manus-storage/portugal-engenharia-logo_4a8a1aa8.png
```

Se o repositório externo não tiver acesso a esses caminhos, os arquivos originais devem ser exportados ou substituídos por cópias hospedadas no seu próprio armazenamento. Não coloque credenciais ou tokens em arquivos públicos do frontend.

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `client/src/pages/Home.tsx` | Conteúdo da página, formulário, simulador, FAQ e chamadas de ação. |
| `client/src/index.css` | Tipografia, paleta, layout, responsividade e componentes visuais. |
| `client/src/App.tsx` | Rota principal e provedores da aplicação. |
| `client/index.html` | Idioma, título, descrição e scripts básicos. |
| `ideas.md` | Direção visual e decisões de marca. |
| `docs/simulador-financeiro.md` | Fórmulas e premissas do simulador. |
| `docs/arquitetura-plataforma-clientes.md` | Plano da futura área autenticada. |

## Processo de substituição recomendado

Faça uma cópia ou branch do repositório antes de substituir qualquer arquivo. Depois, copie os arquivos da versão criada preservando a estrutura do projeto e instale as dependências declaradas no `package.json` usando o gerenciador já adotado pelo repositório.

Em seguida, rode a verificação de TypeScript e a build de produção:

```bash
pnpm install
pnpm run check
pnpm run build
```

Se a aplicação for hospedada em outro provedor, valide as regras de roteamento para que a rota `/` retorne o `index.html`. Também valide fontes externas, URLs dos assets, favicon, formulário, links de WhatsApp e comportamento em viewport mobile.

## Configurações que devem ser revisadas

Antes de publicar, substitua ou confirme os contatos exibidos no site, o número do WhatsApp, o e-mail comercial, o endereço de atendimento e as redes sociais. Os links atuais de Instagram e LinkedIn são destinos genéricos e devem ser trocados pelos perfis oficiais.

Confirme também o texto institucional, o número de anos de experiência, garantias de produto, cidades atendidas e qualquer referência a CREA, ART, certificações ou responsabilidade técnica. O site deve usar apenas informações comprováveis e atualizadas.

## Formulário e simulador

A versão atual do formulário demonstra o fluxo no navegador. O estado de sucesso é local e não grava o lead externamente. Para produção, conecte o envio a uma rota segura, Apps Script controlado ou backend com autenticação de serviço. Nunca coloque credenciais do Google no JavaScript público.

Os cálculos do simulador estão documentados em `docs/simulador-financeiro.md`. Não altere tarifa, produtividade ou preço por kWp sem registrar a data da revisão e a fonte interna usada pela empresa.

## Checklist antes da publicação

A publicação deve ser feita somente depois de confirmar o build, o carregamento das imagens, a responsividade, o envio do formulário, a acessibilidade básica, as políticas legais e os textos comerciais. É importante testar pelo menos uma conta residencial, uma comercial e uma industrial, além de valores mínimos e máximos do slider.

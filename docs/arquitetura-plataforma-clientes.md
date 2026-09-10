# Arquitetura de evolução — Portugal Engenharia

## Visão geral

A evolução recomendada é transformar o site institucional em duas camadas conectadas:

| Camada | Função |
|---|---|
| Site público | Captação, simulador, serviços, conteúdo técnico e entrada de novos leads. |
| Área autenticada | Projetos, cronograma, documentos, relatórios de campo, manutenções e histórico por cliente. |

O site público não deve expor dados de clientes. A área autenticada deve exigir login, aplicar permissões por perfil e registrar quem criou ou alterou cada documento relevante.

## Perfis de acesso

### Administrador
Gerencia clientes, projetos, etapas, usuários internos, parâmetros do simulador, documentos e relatórios. Pode corrigir dados, exportar histórico e controlar o que cada cliente visualiza.

### Equipe ou instalador
Acessa apenas os projetos atribuídos. Preenche checklists de instalação e manutenção, adiciona leituras, observações, fotos e pendências. Não deve alterar dados comerciais ou acessar clientes não atribuídos.

### Cliente
Visualiza somente os próprios projetos. Acompanha a linha do tempo, documentos liberados, pendências, relatórios emitidos e próximos passos. Pode confirmar recebimento ou deixar uma observação.

## Modelo de dados inicial

| Entidade | Campos principais |
|---|---|
| Cliente | id, nome, documento opcional, contatos, endereço, consentimentos, data de criação |
| Projeto | id, cliente, tipo, unidade consumidora, endereço, status, responsável, datas, observações |
| Etapa | id, projeto, nome, ordem, status, previsão, conclusão, visibilidade para cliente |
| Documento | id, projeto, tipo, arquivo, versão, autor, data, visibilidade, hash opcional |
| Relatório de campo | id, projeto, tipo, técnico, data, checklist, leituras, observações, pendências, fotos |
| Manutenção | id, projeto, data, tipo, itens verificados, recomendações, próxima data |
| Evento histórico | id, projeto, autor, ação, entidade, data, resumo e referência do documento |
| Lead | id, origem, dados do simulador, contato, status comercial e projeto associado |

## Linha do tempo do projeto

A linha do tempo pode começar com as seguintes etapas:

```text
Lead recebido
→ Diagnóstico e análise de fatura
→ Proposta enviada
→ Projeto aprovado
→ Documentação e homologação
→ Equipamentos em aquisição
→ Instalação agendada
→ Instalação executada
→ Vistoria e comissionamento
→ Sistema entregue
→ Monitoramento e manutenção
```

Cada etapa deve ter status, responsável, data prevista, data realizada, nota interna e uma versão resumida visível ao cliente. O cliente não precisa ver comentários internos, margem, dados de fornecedores ou problemas operacionais que não estejam prontos para comunicação.

## Relatório de instalação e manutenção

O formulário de campo deve aceitar checklist, texto, fotos e leituras. Para instalações fotovoltaicas, a estrutura pode incluir inversor, módulos, string box, DPS, disjuntores, aterramento, conectores, identificação, limpeza, comunicação, geração observada e pendências.

Para manutenção elétrica, o formulário deve aceitar tipo de serviço, quadro ou equipamento, condição encontrada, medição quando aplicável, ação realizada, recomendação, peças utilizadas, retorno necessário e assinatura/aceite do cliente.

O relatório enviado ao cliente deve ser uma versão congelada e identificada por data e número. Se houver correção, deve ser gerada uma nova versão, preservando a anterior no histórico.

## Evidências e concessionárias

Documentos relacionados à concessionária devem ser tratados como registros versionados: fatura de referência, protocolo, projeto, ART quando aplicável, solicitação, resposta, vistoria, parecer e comprovante de conclusão. O sistema deve registrar data, autor, arquivo e relação com o projeto.

Isso ajuda na organização e na reconstrução do histórico, mas não substitui a guarda dos documentos originais, obrigações profissionais, requisitos da concessionária ou orientação jurídica/contábil específica.

## Arquitetura técnica recomendada

Para a primeira versão da área autenticada, a escolha mais equilibrada é um projeto full-stack gerenciado com autenticação, banco relacional, API tipada e armazenamento de arquivos. Essa opção evita começar com um servidor próprio antes de existir volume suficiente para justificar manutenção de sistema operacional, backups, firewall, monitoramento e atualizações.

O banco deve guardar metadados e relações; fotos e PDFs devem ir para armazenamento de objetos. O histórico deve ser append-only para eventos críticos, e a aplicação deve usar permissões no servidor, não apenas esconder botões no navegador.

## Evolução por marcos

| Marco | Entrega |
|---|---|
| 1 | Site público, simulador revisado e leads organizados. |
| 2 | Cadastro de clientes e projetos com status interno. |
| 3 | Login do cliente e linha do tempo somente leitura. |
| 4 | Upload de documentos e compartilhamento controlado. |
| 5 | Relatório de campo com fotos, leituras e geração de PDF. |
| 6 | Manutenção recorrente, alertas, exportação e indicadores. |

## Princípio de segurança

A plataforma deve começar com o mínimo de dados necessários, separar dados comerciais de dados técnicos, restringir acesso por projeto, registrar eventos de alteração e possuir rotina de backup e restauração testada. Antes de colocar documentos pessoais, contratos ou dados de instalações em produção, é recomendável revisar os requisitos de proteção de dados e os contratos com fornecedores de armazenamento.

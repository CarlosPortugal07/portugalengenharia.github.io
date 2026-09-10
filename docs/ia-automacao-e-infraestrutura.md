# IA, automação e infraestrutura — recomendação inicial

## Agente de IA gratuito

É possível começar com uma automação de baixo custo ou gratuita, mas é importante distinguir **automação por regras** de **agente de IA**. Para organizar leads, atribuir status, criar tarefas, enviar lembretes e registrar datas, regras determinísticas são mais previsíveis e não precisam de IA.

Um agente de IA passa a ser útil quando precisa classificar mensagens, resumir relatórios de campo, transformar observações em pendências, sugerir respostas ou localizar informações no histórico. Nesse caso, a IA deve agir como assistente supervisionado, sem alterar silenciosamente o status de um projeto, enviar compromissos ao cliente ou emitir conclusões técnicas.

| Caminho | Uso recomendado | Vantagem | Cuidado |
|---|---|---|---|
| Planilha + automações simples | Leads, status e lembretes iniciais. | Baixo custo e implantação rápida. | Pode ficar desorganizado com muitos clientes e anexos. |
| Área administrativa no próprio sistema | Clientes, projetos, etapas e tarefas. | Dados estruturados e permissões. | Requer backend, autenticação e banco. |
| Assistente de IA supervisionado | Resumo, classificação e preparação de relatórios. | Economiza tempo operacional. | Deve ter revisão humana e controle de acesso. |

A opção mais segura é construir primeiro o fluxo determinístico e adicionar IA depois, quando existirem relatórios reais e um vocabulário consistente da empresa. Não faz sentido começar com um agente autônomo antes de definir clientes, projetos, status, documentos e responsáveis.

## Armazenamento

O banco de dados deve armazenar dados estruturados: clientes, projetos, etapas, status, relatórios, eventos e referências aos arquivos. Fotos, PDFs e anexos devem ser armazenados em serviço próprio de objetos, com acesso privado e URLs temporárias ou controladas.

Não é recomendável armazenar tudo em uma única planilha ou em pastas públicas. A planilha pode continuar sendo uma visão operacional ou uma exportação, mas não deve ser o único registro de uma plataforma com histórico, documentos e permissões.

## Servidor próprio

Um servidor próprio pode fazer sentido no futuro, mas não é o primeiro passo recomendado. Ele acrescenta responsabilidade por atualizações, firewall, backups, monitoramento, recuperação de desastre, controle de acesso e custos de operação. O problema central neste momento é de modelagem e processo, não de capacidade de servidor.

A melhor sequência é usar uma infraestrutura gerenciada para validar o produto e migrar apenas quando houver uma necessidade concreta, como dependência de Docker, controle de sistema operacional, IP fixo, volume de processamento ou exigência de uma ferramenta específica.

## Backup e histórico

O sistema deve ter cópias independentes do banco e dos arquivos, política de retenção, testes de restauração e registro de versões de documentos. O histórico de eventos críticos não deve ser apagado quando um usuário corrige um relatório; a correção deve gerar nova versão e manter a anterior identificada.

Para relatórios destinados a clientes ou concessionárias, o sistema deve registrar quem criou, quando criou, quais arquivos estavam anexados e qual versão foi enviada. Isso melhora a rastreabilidade, mas não substitui a responsabilidade técnica nem os requisitos específicos de cada processo.

## Sequência recomendada

1. Revisar os parâmetros do simulador e registrar a versão da composição financeira.
2. Conectar o formulário a um destino de leads com acesso controlado.
3. Criar cadastro de clientes, projetos e status internos.
4. Adicionar login do cliente e timeline somente leitura.
5. Adicionar documentos e relatórios de campo com versões.
6. Adicionar automações e IA supervisionada sobre dados estruturados.
7. Avaliar servidor próprio somente depois de identificar uma limitação concreta da hospedagem gerenciada.

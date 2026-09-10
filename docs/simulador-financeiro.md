# Simulador solar — composição financeira atual

> **Status:** versão preliminar para validação da Portugal Engenharia. Os valores abaixo não são uma proposta comercial nem um dimensionamento de engenharia. A finalidade é orientar o primeiro contato e gerar uma faixa inicial de investimento.

## 1. Entradas utilizadas

O simulador atual utiliza duas entradas do visitante: a conta média mensal de energia e o tipo de imóvel. O tipo de imóvel altera três premissas internas: tarifa média de referência, produtividade anual utilizada no dimensionamento e preço preliminar por kWp.

| Tipo de imóvel | Tarifa de referência | Produtividade anual | Preço preliminar |
|---|---:|---:|---:|
| Residencial | R$ 0,83/kWh | 1.300 kWh/kWp·ano | R$ 4.300/kWp |
| Comercial | R$ 0,89/kWh | 1.300 kWh/kWp·ano | R$ 3.950/kWp |
| Industrial | R$ 0,94/kWh | 1.250 kWh/kWp·ano | R$ 3.650/kWp |

Esses números foram incluídos como **parâmetros provisórios de interface**, e não como dados confirmados de tarifa, irradiação, preço de aquisição ou margem da Portugal Engenharia. Eles devem ser substituídos por premissas definidas pela empresa.

## 2. Fórmula de consumo mensal

O simulador transforma a conta em consumo estimado dividindo o valor da fatura pela tarifa de referência:

```text
consumo_mensal_kWh = conta_mensal_R$ / tarifa_R$_por_kWh
```

Exemplo residencial com conta média de R$ 650:

```text
R$ 650 / R$ 0,83 por kWh = 783,13 kWh/mês
```

A fórmula é uma aproximação. A conta real pode incluir iluminação pública, disponibilidade, demanda contratada, tributos, bandeiras, créditos, tarifas diferentes por horário e outras parcelas que não devem ser tratadas como consumo compensável sem análise da fatura.

## 3. Fórmula de potência estimada

O cálculo converte o consumo anual estimado em potência fotovoltaica:

```text
potência_kWp = (consumo_mensal_kWh × 12) / produtividade_anual_kWh_por_kWp
```

O código atual impõe limites operacionais para evitar resultados absurdos no formulário:

```text
potência mínima = 1,8 kWp
potência máxima = 250 kWp
```

Exemplo residencial com conta de R$ 650:

```text
consumo anual estimado = 783,13 × 12 = 9.397,56 kWh/ano
potência estimada = 9.397,56 / 1.300 = 7,23 kWp
```

A produtividade deve ser revisada com base na cidade, orientação, inclinação, perdas, sombreamento, temperatura, disponibilidade do telhado e estratégia de compensação. Para uma prévia comercial, é preferível mostrar uma faixa, por exemplo **6,8–7,7 kWp**, em vez de um único número com falsa precisão.

## 4. Fórmula do investimento preliminar

O investimento atual é calculado multiplicando a potência estimada pelo preço de referência por kWp:

```text
investimento_preliminar = potência_kWp × preço_R$_por_kWp
```

Exemplo residencial com conta de R$ 650:

```text
7,23 kWp × R$ 4.300/kWp = aproximadamente R$ 31.100
```

Esse resultado pode parecer alto porque o parâmetro atual de R$ 4.300/kWp é uma referência conservadora para o segmento residencial e não separa explicitamente equipamento, estrutura, mão de obra, projeto, homologação, logística, impostos, margem, adequações elétricas e contingência. Para melhorar a comunicação, o simulador deve exibir uma faixa e, internamente, registrar a composição.

Uma composição mais útil para a próxima versão seria:

| Componente | Forma de cálculo sugerida |
|---|---|
| Módulos e inversor | potência × custo de equipamentos por kWp |
| Estrutura e proteções | potência × custo médio por kWp ou valor mínimo |
| Projeto, homologação e documentação | valor fixo por tipo de imóvel |
| Instalação | potência × custo de mão de obra por kWp |
| Adequações elétricas | faixa adicional conforme diagnóstico |
| Logística e acesso | valor fixo ou faixa por região |
| Margem e contingência | percentual sobre o custo direto |

## 5. Economia anual estimada

O cálculo atual usa uma economia simplificada de 86% da conta anual:

```text
economia_anual = conta_mensal × 12 × 0,86
```

Para R$ 650 mensais:

```text
R$ 650 × 12 × 0,86 = R$ 6.708/ano
```

Esse percentual não deve ser apresentado como garantia. A economia real depende da parcela compensável, tarifa, regras vigentes, simultaneidade de consumo, créditos, disponibilidade, demanda, degradação e custos fixos.

## 6. Payback indicativo

O payback atual é uma divisão simples:

```text
payback_anos = investimento_preliminar / economia_anual_estimada
```

No exemplo residencial:

```text
R$ 31.100 / R$ 6.708 = aproximadamente 4,6 anos
```

O cálculo não considera financiamento, custo de capital, reajuste tarifário, degradação, limpeza, substituição de inversor, manutenção, seguros, tributos ou valor residual. Portanto, o rótulo correto no site é **“retorno indicativo”**, e não “retorno garantido”.

## 7. Alterações recomendadas antes de publicar como ferramenta comercial

A próxima revisão deve permitir que a Portugal Engenharia edite os parâmetros sem alterar a estrutura visual. O ideal é centralizar as premissas em um objeto de configuração, registrar a versão dos parâmetros utilizada em cada lead e devolver faixas de potência, investimento, economia e retorno.

Também é recomendável incluir uma opção “não sei o valor da conta”, permitindo que o visitante envie a fatura para análise. Para empresas e indústrias, a conta mensal isolada pode não ser suficiente: o formulário deve perguntar se existe demanda contratada, tarifa horo-sazonal ou consumo em mais de uma unidade.

## 8. Exemplo de configuração editável

```ts
const simulatorConfig = {
  residencial: {
    tariff: 0.83,
    productivity: 1300,
    pricePerKwp: 4300,
    savingRate: 0.86,
  },
  comercial: {
    tariff: 0.89,
    productivity: 1300,
    pricePerKwp: 3950,
    savingRate: 0.86,
  },
  industrial: {
    tariff: 0.94,
    productivity: 1250,
    pricePerKwp: 3650,
    savingRate: 0.86,
  },
};
```

A configuração acima reproduz a lógica atualmente implementada. Antes de usá-la como base de orçamento, a empresa deve substituir os valores por dados próprios e documentar a data de revisão, a área geográfica atendida e o escopo incluído no preço por kWp.

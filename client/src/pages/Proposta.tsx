import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Zap } from "lucide-react";

type Lead = { nome?: string; whatsapp?: string; cidade?: string; origem?: string };
type PropertyType = "Residencial" | "Comercial" | "Industrial";
type InverterConfig = { modelo: string; potencia: number; quantidade: number; precoTotal: number };

// Premissas técnicas alinhadas à aba "2. Calc de Potência do Sistema".
const TARIFFA_KWH = 1.03;
const HSP_DAILY = 5.137;
const SYSTEM_LOSSES = 0.2;
const MODULE_WATTS = 620;
const MODULE_LABEL = "JA Solar 620W";

// Premissas comerciais alinhadas à aba "3. Cotações".
const MODULE_PURCHASE_PRICE_PER_WATT = 565.8 / 615;
const MATERIAL_MARGIN = 0.10;
const SALES_COMMISSION = 0.06;
const PROFIT_MARGIN = 0.12;

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function getInversor(kWpArredondado: number): InverterConfig {
  if (kWpArredondado <= 5) return { modelo: "5 kW Sungrow", potencia: 5, quantidade: 1, precoTotal: 2959.32 * 1.18 };
  if (kWpArredondado === 6) return { modelo: "6 kW Sungrow", potencia: 6, quantidade: 1, precoTotal: 3248.02 * 1.18 };
  if (kWpArredondado === 7) return { modelo: "7,5 kW Sungrow", potencia: 7.5, quantidade: 1, precoTotal: 4258.52 * 1.18 };
  if (kWpArredondado <= 10) return { modelo: "10 kW Sungrow", potencia: 10, quantidade: 1, precoTotal: 4835.95 * 1.18 };
  if (kWpArredondado <= 15) return { modelo: "15 kW Sungrow", potencia: 15, quantidade: 1, precoTotal: 10826.76 * 1.18 };
  if (kWpArredondado <= 20) return { modelo: "20 kW Sungrow", potencia: 20, quantidade: 1, precoTotal: 12270.33 * 1.18 };
  if (kWpArredondado <= 25) return { modelo: "25 kW Sungrow", potencia: 25, quantidade: 1, precoTotal: 14002.61 * 1.18 };
  if (kWpArredondado <= 30) return { modelo: "30 kW Sungrow", potencia: 30, quantidade: 1, precoTotal: 11116 * 1.18 };
  const quantidade = Math.ceil(kWpArredondado / 20);
  return { modelo: `${quantidade}x 20 kW Sungrow`, potencia: 20, quantidade, precoTotal: quantidade * 12270.33 * 1.18 };
}

function getLead(): Lead {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = Object.fromEntries(params.entries()) as Lead;
  try {
    const fromStorage = JSON.parse(localStorage.getItem("portugal_lead") || "{}") as Lead;
    return { ...fromStorage, ...fromUrl };
  } catch {
    return fromUrl;
  }
}

function calculateComposition(modules: number, theoreticalKwp: number, realKwp: number, bill: number, monthlyKwh: number) {
  const kWpArredondado = Math.max(1, Math.ceil(theoreticalKwp));
  const inverter = getInversor(kWpArredondado);
  const scale = modules / 7;
  const material = (value: number) => value * scale;
  const materialWithMargin = (value: number) => value * (1 + MATERIAL_MARGIN);

  // Valores-base da cotação para 7 módulos. Quantidades variáveis escalam com os módulos.
  const variableMaterials = 51.66 + 314.44 + 314.44 + 314.44 + 502.18 + 273.32 + 6.98 + 15.85 + 54.90 + 42.07;
  const fixedMaterials = 180 + 95 + 220 + 139.20 + 185.60 + 139.20 + 95 + 18 + 50 + 500;
  const moduleCost = modules * MODULE_WATTS * MODULE_PURCHASE_PRICE_PER_WATT;
  const equipmentCost = materialWithMargin(inverter.precoTotal) + materialWithMargin(moduleCost) + materialWithMargin(material(variableMaterials)) + fixedMaterials;

  const installerHours = Math.max(1, kWpArredondado);
  const laborCost = installerHours * 412 + 20 * 6 + 100 + 60 + installerHours * 45 + 500 + 250 + 250;
  const subtotal = equipmentCost + laborCost;
  const commission = subtotal * SALES_COMMISSION;
  const investment = subtotal + commission + subtotal * PROFIT_MARGIN;
  const monthlySavings = bill > 0 ? bill * 0.9 : monthlyKwh * TARIFFA_KWH * 0.9;
  const annualSavings = monthlySavings * 12;

  return {
    inverter,
    kWpArredondado,
    equipmentCost,
    laborCost,
    subtotal,
    commission,
    investment,
    monthlySavings,
    annualSavings,
    payback: investment / Math.max(annualSavings, 1),
    realKwp,
  };
}

export default function Proposta() {
  const [lead, setLead] = useState<Lead>({});
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cidade, setCidade] = useState("");
  const [conta, setConta] = useState(0);
  const [consumo, setConsumo] = useState("");
  const [showConsumption, setShowConsumption] = useState(false);
  const [tipo, setTipo] = useState<PropertyType>("Residencial");

  useEffect(() => {
    const data = getLead();
    setLead(data);
    setNome(data.nome || "");
    setWhatsapp(data.whatsapp || "");
    setCidade(data.cidade || "");
    const location = (data.cidade || "").toLowerCase();
    if (location.includes("comér") || location.includes("comerc") || location.includes("loja") || location.includes("empresa")) setTipo("Comercial");
    if (location.includes("indust") || location.includes("fábrica") || location.includes("fabrica") || location.includes("galpão") || location.includes("galpao")) setTipo("Industrial");
  }, []);

  const estimate = useMemo(() => {
    const enteredKwh = Number(consumo);
    const hasKwh = Number.isFinite(enteredKwh) && enteredKwh > 0;
    const hasBill = conta > 0;
    const hasInput = hasKwh || hasBill;
    if (!hasInput) {
      return { hasInput: false, source: "", monthlyKwh: 0, theoreticalKwp: 0, realKwp: 0, modules: 0, inverter: getInversor(1), equipmentCost: 0, laborCost: 0, subtotal: 0, commission: 0, investment: 0, monthlySavings: 0, annualSavings: 0, payback: 0 };
    }

    const monthlyKwh = hasKwh ? enteredKwh : conta / TARIFFA_KWH;
    const theoreticalKwp = monthlyKwh / 30 / HSP_DAILY / (1 - SYSTEM_LOSSES);
    const modules = Math.ceil((theoreticalKwp * 1000) / MODULE_WATTS);
    const realKwp = modules * (MODULE_WATTS / 1000);
    const composition = calculateComposition(modules, theoreticalKwp, realKwp, conta, monthlyKwh);

    return { hasInput: true, source: hasKwh ? "kWh informado" : "estimado pela conta", monthlyKwh, theoreticalKwp, modules, ...composition };
  }, [conta, consumo]);

  function sendToWhatsApp() {
    const message = `Olá Portugal Engenharia! Sou ${nome || "cliente"} de ${cidade || "Valinhos"}. Vim do site, preenchi a análise e vi a proposta de ${estimate.realKwp.toFixed(2)} kWp com ${estimate.modules} módulos ${MODULE_LABEL}, inversor ${estimate.inverter.modelo}, por ${brl(estimate.investment)}. Quero tirar dúvidas.`;
    window.open(`https://wa.me/5519995454370?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="proposal-page">
      <header className="proposal-header"><a href="/" className="proposal-brand"><Zap size={18} /> <strong>PORTUGAL</strong> ENGENHARIA ELÉTRICA</a><span>CNPJ 53.142.037/0001-10 • CREA-SP 5071367686 • Valinhos-SP</span></header>
      {(lead.nome || lead.whatsapp) && <div className="proposal-lead-badge"><Zap size={18} /><span><b>Olá, {lead.nome || "cliente"}!</b> Já preenchemos seus dados para você não digitar de novo. <a href="/">← voltar ao site</a></span></div>}
      <main className="proposal-container">
        <section className="proposal-card proposal-input-card">
          <p className="proposal-eyebrow">PRÉVIA AUTOMÁTICA</p><h1>Quanto pode custar um sistema para você?</h1>
          <p className="proposal-muted">Informe o valor médio da conta. Se você souber o consumo em kWh, pode informar esse dado opcionalmente para deixar a estimativa mais precisa.</p>
          <label>Seu nome<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos chamar você?" /></label>
          <label>WhatsApp<input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(19) 99999-9999" /></label>
          <label>Cidade e tipo de imóvel<input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex.: Valinhos • comércio" /></label>
          <label>Valor da conta média (R$)<input type="number" min="0" value={conta} onChange={(e) => setConta(Number(e.target.value))} /></label>
          <button className="proposal-optional-toggle" type="button" onClick={() => setShowConsumption((value) => !value)} aria-expanded={showConsumption}>{showConsumption ? "− Ocultar consumo em kWh" : "+ Sei meu consumo em kWh (opcional)"}</button>
          {showConsumption && <label>Consumo mensal (kWh) — opcional<input type="number" min="0" value={consumo} onChange={(e) => setConsumo(e.target.value)} placeholder="Ex.: 485" /></label>}
          <label>Tipo<select value={tipo} onChange={(e) => setTipo(e.target.value as PropertyType)}><option>Residencial</option><option>Comercial</option><option>Industrial</option></select></label>
          <button className="proposal-button" type="button" onClick={sendToWhatsApp}><span>ENVIAR PARA A ENGENHARIA</span><ArrowRight size={18} /></button>
        </section>
        <section>
          <div className="proposal-result"><h2>{estimate.hasInput ? "Sistema recomendado para você" : "Informe a conta ou o consumo para simular"}</h2><p className="proposal-small">Tarifa: R$ {TARIFFA_KWH.toFixed(2).replace(".", ",")}/kWh • HSP: {HSP_DAILY.toFixed(3).replace(".", ",")} h/dia • Perdas: {SYSTEM_LOSSES * 100}% • Composição por custos</p><div className="proposal-kpis"><div><span>Potência</span><b>{estimate.hasInput ? `${estimate.realKwp.toFixed(2)} kWp` : "-"}</b><small>{estimate.hasInput ? `${estimate.modules}x ${MODULE_LABEL}` : "Aguardando dados"}</small></div><div><span>Consumo mensal</span><b>{estimate.hasInput ? `${estimate.monthlyKwh.toFixed(0)} kWh` : "-"}</b><small>{estimate.hasInput ? estimate.source : "Informe um dos campos"}</small></div><div><span>Investimento</span><b>{estimate.hasInput ? brl(estimate.investment) : "-"}</b><small>{estimate.hasInput ? `${brl(estimate.investment / Math.max(estimate.realKwp, 0.001))}/kWp` : "Aguardando dados"}</small></div><div><span>Payback</span><b>{estimate.hasInput ? `${estimate.payback.toFixed(1)} anos` : "-"}</b><small>{estimate.hasInput ? `${(estimate.realKwp * 1.2).toFixed(1)}t CO₂/ano evitado` : "Aguardando dados"}</small></div></div></div>
          <div className="proposal-commercial"><div className="proposal-commercial-title"><h2>Proposta Comercial</h2><span>PRÉVIA TÉCNICA</span></div><p>Cliente: <b>{nome || "-"}</b> • {cidade || "-"} • {whatsapp || "-"}</p><p><b>Sistema:</b> {estimate.hasInput ? `${estimate.realKwp.toFixed(2)} kWp — ${estimate.modules} módulos ${MODULE_LABEL} + ${estimate.inverter.quantidade}x ${estimate.inverter.modelo} — ${tipo}` : "Aguardando o valor da conta para dimensionar"}</p><div className="proposal-tags"><span>JA SOLAR 620W</span><span>{estimate.hasInput ? estimate.inverter.modelo.toUpperCase() : "SUNGROW"}</span><span>ESTRUTURA AL</span><span>STRING BOX + DPS</span><span>CABO SOLAR 6mm²</span></div><div className="proposal-benefits"><div><b>Composição</b><br />Equipamentos + materiais + instalação + projeto + ART + custos operacionais</div><div><b>Margens aplicadas</b><br />Materiais 10% • Comissão 6% • Margem de lucro 12%</div></div><p className="proposal-footnote">*Esta é uma prévia calculada com os parâmetros da planilha de precificação. O orçamento definitivo depende da vistoria, padrão de entrada, telhado, sombreamento, concessionária e escopo final.</p><button className="proposal-whatsapp" type="button" onClick={sendToWhatsApp}><MessageCircle size={18} /> Falar com a engenharia pelo WhatsApp</button></div>
          <a className="proposal-back" href="/"><ArrowLeft size={16} /> Voltar para o diagnóstico</a>
        </section>
      </main>
    </div>
  );
}

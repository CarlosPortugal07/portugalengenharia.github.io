import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Zap } from "lucide-react";

type Lead = { nome?: string; whatsapp?: string; cidade?: string; origem?: string };
type PropertyType = "Residencial" | "Comercial" | "Industrial";

const TARIFFA_KWH = 1.03;
const HSP_DAILY = 5.137;
const SYSTEM_LOSSES = 0.2;
const MODULE_WATTS = 620;
const MODULE_LABEL = "JA Solar 620W";
const PRICE_PER_KWP = 4300;

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
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
      return { hasInput: false, theoreticalKwp: 0, monthlyKwh: 0, realKwp: 0, modules: 0, monthlySavings: 0, annualSavings: 0, investment: 0, payback: 0 };
    }
    const monthlyKwh = hasKwh ? enteredKwh : conta / TARIFFA_KWH;
    const theoreticalKwp = monthlyKwh / 30 / HSP_DAILY / (1 - SYSTEM_LOSSES);
    const modules = Math.ceil((theoreticalKwp * 1000) / MODULE_WATTS);
    const realKwp = modules * (MODULE_WATTS / 1000);
    const monthlySavings = hasBill ? conta * 0.9 : monthlyKwh * TARIFFA_KWH * 0.9;
    const annualSavings = monthlySavings * 12;
    const investment = realKwp * PRICE_PER_KWP;
    return { hasInput: true, source: hasKwh ? "kWh informado" : "estimado pela conta", realKwp, theoreticalKwp, monthlyKwh, modules, monthlySavings, annualSavings, investment, payback: investment / Math.max(annualSavings, 1) };
  }, [conta, consumo]);

  function sendToWhatsApp() {
    const message = `Olá Portugal Engenharia! Sou ${nome || "cliente"} de ${cidade || "Valinhos"}. Vim do site, já preenchi a análise e vi a proposta de ${estimate.realKwp.toFixed(2)} kWp com ${MODULE_LABEL} por ${brl(estimate.investment)}. Quero tirar dúvidas.`;
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
          <div className="proposal-result"><h2>{estimate.hasInput ? "Sistema recomendado para você" : "Informe a conta ou o consumo para simular"}</h2><p className="proposal-small">Tarifa: R$ {TARIFFA_KWH.toFixed(2).replace(".", ",")}/kWh • HSP: {HSP_DAILY.toFixed(3).replace(".", ",")} h/dia • Perdas: {SYSTEM_LOSSES * 100}% • Referência: R$ {PRICE_PER_KWP.toLocaleString("pt-BR")}/kWp</p><div className="proposal-kpis"><div><span>Potência</span><b>{estimate.hasInput ? `${estimate.realKwp.toFixed(2)} kWp` : "-"}</b><small>{estimate.hasInput ? `${estimate.modules}x ${MODULE_LABEL}` : "Aguardando dados"}</small></div><div><span>Consumo mensal</span><b>{estimate.hasInput ? `${estimate.monthlyKwh.toFixed(0)} kWh` : "-"}</b><small>{estimate.hasInput ? estimate.source : "Informe um dos campos"}</small></div><div><span>Investimento</span><b>{estimate.hasInput ? brl(estimate.investment) : "-"}</b><small>{estimate.hasInput ? "Financiamento 60x disponível" : "Aguardando dados"}</small></div><div><span>Payback</span><b>{estimate.hasInput ? `${estimate.payback.toFixed(1)} anos` : "-"}</b><small>{estimate.hasInput ? `${(estimate.realKwp * 1.2).toFixed(1)}t CO₂/ano evitado` : "Aguardando dados"}</small></div></div></div>
          <div className="proposal-commercial"><div className="proposal-commercial-title"><h2>Proposta Comercial</h2><span>PRÉVIA TÉCNICA</span></div><p>Cliente: <b>{nome || "-"}</b> • {cidade || "-"} • {whatsapp || "-"}</p><p><b>Sistema:</b> {estimate.hasInput ? `${estimate.realKwp.toFixed(2)} kWp — ${estimate.modules} módulos ${MODULE_LABEL} + inversor ${Math.ceil(estimate.realKwp)} kW — ${tipo}` : "Aguardando o valor da conta para dimensionar"}</p><div className="proposal-tags"><span>JA SOLAR 620W</span><span>SOLIS / DEYE</span><span>ESTRUTURA AL</span><span>STRING BOX + DPS</span><span>CABO SOLAR 6mm²</span></div><div className="proposal-benefits"><div><b>Garantias</b><br />25 anos painéis* • 10 anos inversor • 1 ano instalação • Monitoramento</div><div><b>Incluso</b><br />Projeto + ART + Homologação CPFL + Instalação + Comissionamento</div></div><p className="proposal-footnote">*Condições conforme fabricante e escopo final. A proposta definitiva depende da análise da fatura, localização, telhado, sombreamento, padrão de entrada e vistoria técnica.</p><button className="proposal-whatsapp" type="button" onClick={sendToWhatsApp}><MessageCircle size={18} /> Falar com a engenharia pelo WhatsApp</button></div>
          <a className="proposal-back" href="/"><ArrowLeft size={16} /> Voltar para o diagnóstico</a>
        </section>
      </main>
    </div>
  );
}

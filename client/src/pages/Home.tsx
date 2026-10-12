/*
 * Estilo: Energia Editorial Industrial.
 * Esta página usa uma composição assimétrica, tipografia editorial e cor Amarelo Sol PE
 * para transformar uma empresa de instalação solar em uma marca de engenharia próxima,
 * precisa e resolutiva.
 */
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BatteryCharging,
  Building2,
  Check,
  ChevronDown,
  CircuitBoard,
  ClipboardCheck,
  Download,
  Factory,
  FileCheck2,
  Headphones,
  Leaf,
  Menu,
  MessageCircle,
  MoveUpRight,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Thermometer,
  X,
  Zap,
} from "lucide-react";

const symbolUrl = "/assets/portugal-engenharia-7pe.png";
const heroUrl = "/manus-storage/portugal-engenharia-hero_0fc58bff.jpg";
const inspectionUrl = "/manus-storage/portugal-engenharia-inspection_0d29b135.jpg";
const blueprintUrl = "/manus-storage/portugal-engenharia-blueprint_3980b22d.png";

const whatsappUrl = "https://wa.me/5519995454370?text=Ol%C3%A1%2C%20quero%20falar%20com%20um%20engenheiro%20da%20Portugal%20Engenharia.";

const routes = [
  {
    number: "01",
    eyebrow: "Para casas e pequenos negócios",
    title: "Quero reduzir minha conta de energia",
    text: "Analisamos sua fatura, o imóvel e o perfil de consumo para indicar a solução certa — com ou sem energia solar.",
    cta: "Analisar minha conta",
    href: "#diagnostico",
    icon: SunMedium,
    tone: "sun",
  },
  {
    number: "02",
    eyebrow: "Para empresas e condomínios",
    title: "Preciso de segurança e previsibilidade",
    text: "Projetos, laudos, SPDA, qualidade de energia e manutenção para evitar falhas e decisões no escuro.",
    cta: "Solicitar diagnóstico técnico",
    href: "#servicos",
    icon: ShieldCheck,
    tone: "mint",
  },
  {
    number: "03",
    eyebrow: "Para obras e indústria",
    title: "Preciso tirar um projeto do papel",
    text: "Engenharia elétrica, compatibilização, fornecedores e implantação com uma visão prática de obra.",
    cta: "Falar com um engenheiro",
    href: "#contato",
    icon: Factory,
    tone: "ink",
  },
];

const services = [
  {
    index: "A1",
    icon: SunMedium,
    title: "Energia solar",
    description: "Dimensionamento, projeto, homologação, instalação e acompanhamento para residências, empresas, propriedades rurais e indústrias.",
    deliverable: "Estudo de geração + proposta técnica",
  },
  {
    index: "B2",
    icon: BarChart3,
    title: "Diagnóstico energético",
    description: "Leitura de faturas, demanda, tarifa e perfil de consumo para encontrar economias antes de investir.",
    deliverable: "Relatório de oportunidades + plano de ação",
  },
  {
    index: "C3",
    icon: CircuitBoard,
    title: "Projetos elétricos",
    description: "Projetos de baixa tensão, iluminação, infraestrutura, quadros e apoio à implantação de empreendimentos.",
    deliverable: "Documentação técnica compatibilizada",
  },
  {
    index: "D4",
    icon: FileCheck2,
    title: "Laudos, SPDA e aterramento",
    description: "Inspeção técnica e documentação para reduzir risco, orientar adequações e manter a instalação segura.",
    deliverable: "Laudo técnico + recomendações priorizadas",
  },
  {
    index: "E5",
    icon: Headphones,
    title: "Manutenção e monitoramento",
    description: "Acompanhamento preventivo de sistemas fotovoltaicos e instalações elétricas, com atenção aos desvios.",
    deliverable: "Plano recorrente + relatório de desempenho",
  },
  {
    index: "F6",
    icon: BatteryCharging,
    title: "Carregadores veiculares",
    description: "Avaliação da rede, proteção, circuito e instalação de wallbox para casas, condomínios, empresas e frotas.",
    deliverable: "Avaliação de capacidade + instalação segura",
  },
];

const faqs = [
  {
    question: "A Portugal Engenharia atende apenas energia solar?",
    answer: "Não. A energia solar é uma das nossas principais frentes, mas também atuamos com diagnóstico energético, projetos elétricos, laudos, SPDA, aterramento, manutenção, iluminação e carregadores veiculares.",
  },
  {
    question: "Preciso ter uma conta de energia muito alta para começar?",
    answer: "Não. O primeiro passo é entender o seu consumo, imóvel e objetivo. Uma análise preliminar ajuda a decidir se a melhor alternativa é energia solar, adequação elétrica, eficiência ou apenas monitoramento.",
  },
  {
    question: "Vocês fazem o acompanhamento depois da instalação?",
    answer: "Sim. Podemos estruturar manutenção preventiva e monitoramento do sistema para acompanhar geração, alertas, desempenho e necessidades de intervenção.",
  },
  {
    question: "Atendem empresas e obras fora de Valinhos?",
    answer: "Atendemos Valinhos e região e avaliamos demandas em outras cidades conforme o escopo. Entre em contato para verificarmos a viabilidade técnica e logística do atendimento.",
  },
];

type PropertyType = "residencial" | "comercial" | "rural";

function estimateSolar(bill: number, propertyType: PropertyType) {
  // 1. Tarifa dinâmica alinhada com a tabela PROCV da planilha (CPFL 2026)
  const tariff = propertyType === "comercial" ? 1.08 : 1.05; // Residencial e Rural utilizam R$ 1,05/kWh
  const productivity = 1450; // Produtividade real em Valinhos (kWh/kWp/ano)

  // 2. Consumo total e abatimento de taxa mínima (100 kWh trifásico) + Fio B (Lei 14.300)
  const totalKwh = bill / tariff;
  const minimumKwh = 100;
  const compensableKwh = Math.max(0, (totalKwh - minimumKwh) * 0.90);

  // 3. Potência sugerida em kWp
  const kwp = Math.max(1.8, Math.min(250, (compensableKwh * 12) / productivity));

  // 4. Preço de venda progressivo e custo fixo de engenharia (ART + Projeto + Homologação CPFL)
  const fixedCost = 1850;
  let ratePerKwp = 0;

  if (propertyType === "comercial") {
    if (kwp <= 4) ratePerKwp = 4450;
    else if (kwp <= 6) ratePerKwp = 4150;
    else if (kwp <= 10) ratePerKwp = 3950;
    else if (kwp <= 20) ratePerKwp = 3550;
    else ratePerKwp = 3200;
  } else {
    // Residencial e Rural
    if (kwp <= 2.5) ratePerKwp = 5200;
    else if (kwp <= 4) ratePerKwp = 4600;
    else if (kwp <= 6) ratePerKwp = 4441; // Alinhado aos R$ 4.44/Wp da planilha 7PE
    else if (kwp <= 10) ratePerKwp = 3900;
    else if (kwp <= 20) ratePerKwp = 3550;
    else ratePerKwp = 3150;
  }

  const investment = (kwp * ratePerKwp) + fixedCost;

  // 5. Economia Anual Estimada e Payback
  const annualSavings = bill * 12 * 0.88;
  const payback = investment / Math.max(annualSavings, 1);

  return { kwp, investment, annualSavings, payback };
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function SolarSimulator() {
  const [bill, setBill] = useState(650);
  const [propertyType, setPropertyType] = useState<PropertyType>("residencial");
  const estimate = estimateSolar(bill, propertyType);
  const typeLabel = propertyType === "residencial" ? "residencial" : propertyType === "comercial" ? "comercial" : "rural";

  return (
    <div className="solar-simulator">
      <div className="simulator-top"><span className="form-label">PRÉVIA AUTOMÁTICA</span><Zap size={18} /></div>
      <h3>Quanto pode custar um sistema para você?</h3>
      <p className="simulator-intro">Ajuste a conta média e veja uma primeira faixa de investimento em poucos segundos.</p>
      <label className="simulator-label">Conta média mensal <strong>{formatBRL(bill)}</strong><input type="range" min="200" max="30000" step="50" value={bill} onChange={(event) => setBill(Number(event.target.value))} /></label>
      <div className="simulator-range"><span>R$ 200</span><span>R$ 30 mil</span></div>
      <div className="simulator-types"><span className="simulator-label">Tipo de imóvel</span><div className="simulator-options">{(["residencial", "comercial", "rural"] as PropertyType[]).map((type) => <button type="button" key={type} className={propertyType === type ? "simulator-option active" : "simulator-option"} onClick={() => setPropertyType(type)}>{type}</button>)}</div></div>
      <div className="simulator-result"><div><span>Potência estimada</span><strong>{estimate.kwp.toFixed(1)} kWp</strong></div><div><span>Investimento preliminar</span><strong>{formatBRL(estimate.investment)}</strong></div><div><span>Economia anual estimada</span><strong>{formatBRL(estimate.annualSavings)}</strong></div><div><span>Retorno indicativo</span><strong>{estimate.payback.toFixed(1)} anos</strong></div></div>
      <p className="simulator-disclaimer">Estimativa inicial para imóvel {typeLabel}. O dimensionamento final depende da fatura, localização, telhado, sombreamento, padrão de entrada, concessionária e vistoria técnica.</p>
    </div>
  );
}

function SectionKicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`section-kicker ${light ? "section-kicker-light" : ""}`}>
      <span className="kicker-line" />
      <span>{children}</span>
    </div>
  );
}

function ArrowButton({ children, href = "#diagnostico", light = false }: { children: React.ReactNode; href?: string; light?: boolean }) {
  return (
    <a href={href} className={`arrow-button ${light ? "arrow-button-light" : ""}`}>
      <span>{children}</span>
      <span className="arrow-button-icon"><ArrowRight size={17} strokeWidth={2.2} /></span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lead = {
      nome: String(formData.get("name") || ""),
      whatsapp: String(formData.get("phone") || ""),
      cidade: String(formData.get("location") || ""),
      origem: String(formData.get("need") || ""),
    };
    window.localStorage.setItem("portugal_lead", JSON.stringify(lead));
    if (lead.origem === "Quero energia solar" || lead.origem === "Quero analisar minha conta") {
      window.location.href = `/proposta.html?${new URLSearchParams(lead).toString()}`;
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand-lockup" href="#top" onClick={closeMenu} aria-label="Portugal Engenharia — início">
            <span className="brand-symbol"><img src={symbolUrl} alt="7PE" /></span>
            <span className="brand-wordmark-block">
              <strong className="brand-wordmark">Portugal Engenharia Elétrica</strong>
              <span className="brand-services"><span>Energia</span><i>/</i><span>Projeto</span><i>/</i><span>Manutenção</span></span>
            </span>
          </a>

          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Navegação principal">
            <a href="#rotas" onClick={closeMenu}>Soluções</a>
            <a href="#servicos" onClick={closeMenu}>Serviços</a>
            <a href="#processo" onClick={closeMenu}>Como fazemos</a>
            <a href="#sobre" onClick={closeMenu}>A Portugal</a>
            <a className="header-cta" href="#diagnostico" onClick={closeMenu}>Falar com engenharia <MoveUpRight size={15} /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-image" style={{ backgroundImage: `url(${hero

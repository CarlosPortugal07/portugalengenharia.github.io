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

const logoUrl = "/assets/portugal-engenharia-logo.png";
const heroUrl = "/assets/portugal-engenharia-hero.jpg";
const inspectionUrl = "/assets/portugal-engenharia-inspection.jpg";
const blueprintUrl = "/assets/portugal-engenharia-blueprint.png";

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
    description: "Dimensionamento, projeto, homologação, instalação e acompanhamento para residências, empresas e indústrias.",
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

type PropertyType = "residencial" | "comercial" | "industrial";

function estimateSolar(bill: number, propertyType: PropertyType) {
  const tariff = propertyType === "industrial" ? 0.94 : propertyType === "comercial" ? 0.89 : 0.83;
  const productivity = propertyType === "industrial" ? 1250 : 1300;
  const pricePerKwp = propertyType === "industrial" ? 3650 : propertyType === "comercial" ? 3950 : 4300;
  const monthlyKwh = bill / tariff;
  const kwp = Math.max(1.8, Math.min(250, (monthlyKwh * 12) / productivity));
  const investment = kwp * pricePerKwp;
  const annualSavings = bill * 12 * 0.86;
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
  const typeLabel = propertyType === "residencial" ? "residencial" : propertyType === "comercial" ? "comercial" : "industrial";

  return (
    <div className="solar-simulator">
      <div className="simulator-top"><span className="form-label">PRÉVIA AUTOMÁTICA</span><Zap size={18} /></div>
      <h3>Quanto pode custar um sistema para você?</h3>
      <p className="simulator-intro">Ajuste a conta média e veja uma primeira faixa de investimento em poucos segundos.</p>
      <label className="simulator-label">Conta média mensal <strong>{formatBRL(bill)}</strong><input type="range" min="200" max="30000" step="50" value={bill} onChange={(event) => setBill(Number(event.target.value))} /></label>
      <div className="simulator-range"><span>R$ 200</span><span>R$ 30 mil</span></div>
      <div className="simulator-types"><span className="simulator-label">Tipo de imóvel</span><div className="simulator-options">{(["residencial", "comercial", "industrial"] as PropertyType[]).map((type) => <button type="button" key={type} className={propertyType === type ? "simulator-option active" : "simulator-option"} onClick={() => setPropertyType(type)}>{type}</button>)}</div></div>
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
    setSubmitted(true);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand-lockup" href="#top" onClick={closeMenu} aria-label="Portugal Engenharia — início">
            <span className="brand-mark"><img src={logoUrl} alt="" /></span>
            <span className="brand-copy">
              <strong>Portugal Engenharia</strong>
              <small>energia • projeto • manutenção</small>
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
          <div className="hero-image" style={{ backgroundImage: `url(${heroUrl})` }} />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-copy">
              <SectionKicker light>Engenharia elétrica em Valinhos e região</SectionKicker>
              <h1>Energia e infraestrutura para decisões <em>mais seguras.</em></h1>
              <p className="hero-lead">Da análise da sua conta ao projeto, instalação e manutenção: uma engenharia que continua depois da entrega.</p>
              <div className="hero-actions">
                <ArrowButton href="#diagnostico">Começar pelo diagnóstico</ArrowButton>
                <a className="text-link light-link" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a>
              </div>
            </div>

            <div className="hero-aside">
              <div className="hero-aside-label">PE / 2026</div>
              <div className="hero-stat">
                <span className="stat-value">+3</span>
                <span className="stat-label">anos conectando<br />engenharia e obra</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">360°</span>
                <span className="stat-label">visão para projeto,<br />execução e operação</span>
              </div>
              <div className="hero-note"><span /> Atendimento próximo, responsabilidade técnica e clareza em cada etapa.</div>
            </div>
          </div>
          <div className="hero-bottom-line"><span>01</span><span>Medir • projetar • instalar • acompanhar</span><span>↓</span></div>
        </section>

        <section className="intro-band" id="sobre">
          <div className="container intro-grid">
            <div className="intro-title">
              <SectionKicker>O próximo passo começa pelos dados</SectionKicker>
              <h2>Sua conta de energia tem uma história. <span>A gente lê o que ela está dizendo.</span></h2>
            </div>
            <div className="intro-copy">
              <p>Somos uma empresa de engenharia elétrica dedicada a transformar consumo, infraestrutura e manutenção em decisões práticas para casas, empresas e obras.</p>
              <p>O resultado não é uma promessa genérica: é um caminho técnico para reduzir desperdícios, aumentar a segurança e fazer o investimento funcionar no mundo real.</p>
              <ArrowButton href="#processo">Conhecer nosso processo</ArrowButton>
            </div>
          </div>
        </section>

        <section className="routes-section" id="rotas">
          <div className="container">
            <div className="section-heading split-heading">
              <div><SectionKicker>Escolha sua rota</SectionKicker><h2>Por onde a gente pode ajudar?</h2></div>
              <p>Você não precisa chegar com o diagnóstico pronto. Conte o que está acontecendo e nós indicamos o melhor ponto de partida.</p>
            </div>
            <div className="routes-grid">
              {routes.map((route) => {
                const Icon = route.icon;
                return (
                  <a className={`route-card route-${route.tone}`} href={route.href} key={route.number}>
                    <div className="route-top"><span>{route.number}</span><Icon size={25} strokeWidth={1.7} /></div>
                    <div className="route-eyebrow">{route.eyebrow}</div>
                    <h3>{route.title}</h3>
                    <p>{route.text}</p>
                    <span className="route-link">{route.cta} <ArrowRight size={16} /></span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="services-section" id="servicos">
          <div className="container">
            <div className="section-heading services-heading">
              <div><SectionKicker light>Portfólio técnico</SectionKicker><h2>Soluções que cabem no seu momento.</h2></div>
              <p>Do primeiro diagnóstico à manutenção recorrente, cada serviço tem um escopo claro e um próximo passo definido.</p>
            </div>
            <div className="services-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article className="service-card" key={service.index}>
                    <div className="service-card-top"><span>{service.index}</span><Icon size={25} strokeWidth={1.6} /></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="deliverable"><Check size={15} /> {service.deliverable}</div>
                    <a href="#diagnostico" className="service-action" aria-label={`Solicitar ${service.title}`}>Solicitar análise <ArrowRight size={16} /></a>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="blueprint-stamp" style={{ backgroundImage: `url(${blueprintUrl})` }} aria-hidden="true" />
        </section>

        <section className="process-section" id="processo">
          <div className="container process-grid">
            <div className="process-image-wrap">
              <img src={inspectionUrl} alt="Engenheiro avaliando um painel elétrico" className="process-image" />
              <div className="image-caption"><span>PE / CAMPO</span><strong>Precisão antes da execução.</strong></div>
              <div className="image-index">04</div>
            </div>
            <div className="process-content">
              <SectionKicker>Como fazemos</SectionKicker>
              <h2>Menos improviso.<br /><em>Mais controle.</em></h2>
              <p className="process-lead">Uma boa solução elétrica começa antes do orçamento e continua depois da instalação. É por isso que o nosso processo é dividido em quatro momentos simples.</p>
              <div className="process-list">
                {[
                  ["01", "Entender", "Consumo, contexto, imóvel e o problema que precisa ser resolvido."],
                  ["02", "Projetar", "Dimensionamento, especificações e documentação para uma decisão segura."],
                  ["03", "Entregar", "Implantação coordenada, homologação e atenção aos detalhes de campo."],
                  ["04", "Acompanhar", "Manutenção, monitoramento e suporte para a solução continuar funcionando."],
                ].map(([number, title, text]) => (
                  <div className="process-item" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="proof-section">
          <div className="container proof-grid">
            <div className="proof-copy">
              <SectionKicker>O que você leva</SectionKicker>
              <h2>Clareza para investir.<br /><span>Segurança para operar.</span></h2>
              <p>Um sistema solar ou uma instalação elétrica não termina no equipamento. Ele precisa fazer sentido para a sua rotina, para a sua conta e para o seu plano de crescimento.</p>
              <div className="proof-points">
                <div><ShieldCheck size={20} /><span>Projeto dimensionado para o seu contexto</span></div>
                <div><Ruler size={20} /><span>Entregáveis técnicos e próximos passos claros</span></div>
                <div><Thermometer size={20} /><span>Olhar preventivo para falhas e desperdícios</span></div>
              </div>
              <ArrowButton href="#diagnostico">Receber uma análise</ArrowButton>
            </div>
            <div className="metric-board">
              <div className="metric-board-label">PAINEL DE DECISÃO / PE</div>
              <div className="metric-row"><strong>01</strong><span>Diagnóstico antes da proposta</span><em>sim</em></div>
              <div className="metric-row"><strong>02</strong><span>Engenharia própria</span><em>sim</em></div>
              <div className="metric-row"><strong>03</strong><span>Atendimento depois da entrega</span><em>sim</em></div>
              <div className="metric-highlight"><span className="metric-number">25</span><span>anos de garantia de produto*<small>*Conforme fabricante e condições de fornecimento.</small></span></div>
              <div className="metric-footer"><span>Valinhos • Campinas • Região</span><span>PE / 04</span></div>
            </div>
          </div>
        </section>

        <section className="maintenance-section">
          <div className="container maintenance-grid">
            <div><SectionKicker light>Receita recorrente para o seu negócio</SectionKicker><h2>A instalação é o começo.<br /><em>A performance vem depois.</em></h2></div>
            <div><p>Para empresas, condomínios e proprietários de sistemas solares, criamos planos de manutenção e monitoramento que acompanham geração, alertas, inspeções e prioridades de intervenção.</p><ArrowButton light href="#diagnostico">Conhecer plano de acompanhamento</ArrowButton></div>
          </div>
        </section>

        <section className="diagnostic-section" id="diagnostico">
          <div className="container diagnostic-grid">
            <div className="diagnostic-copy">
              <SectionKicker>Primeiro passo</SectionKicker>
              <h2>Conte o que está acontecendo. <span>A gente organiza o caminho.</span></h2>
              <p>Envie alguns dados e retornaremos com a melhor rota para o seu caso. Sem compromisso e sem orçamento genérico.</p>
              <SolarSimulator />
              <div className="diagnostic-contact"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> (19) 99545-4370</a><a href="mailto:vendas@portugalengenharia.com.br"><Phone size={18} /> vendas@portugalengenharia.com.br</a></div>
              <div className="download-note"><Download size={17} /> Você pode anexar sua última conta de energia na conversa.</div>
            </div>
            <div className="diagnostic-form-wrap">
              {submitted ? (
                <div className="form-success"><div className="success-icon"><Check size={28} /></div><span className="form-label">Recebemos seu sinal</span><h3>O próximo passo está organizado.</h3><p>Obrigado pelo contato. Em breve a Portugal Engenharia retorna para entender melhor o seu cenário.</p><button type="button" onClick={() => setSubmitted(false)}>Enviar outro diagnóstico</button></div>
              ) : (
                <form className="diagnostic-form" onSubmit={handleSubmit}>
                  <div className="form-label">PRÓXIMO PASSO</div>
                  <h3>Receba uma análise personalizada.</h3>
                  <div className="form-row"><label>Seu nome<input required name="name" placeholder="Como podemos chamar você?" /></label><label>WhatsApp<input required name="phone" placeholder="(19) 99999-9999" /></label></div>
                  <label>Cidade e tipo de imóvel<input required name="location" placeholder="Ex.: Valinhos • comércio" /></label>
                  <label>O que você precisa?<select name="need" defaultValue=""><option value="" disabled>Escolha uma opção</option><option>Quero analisar minha conta</option><option>Quero energia solar</option><option>Preciso de projeto ou laudo</option><option>Quero manutenção ou monitoramento</option><option>Preciso de carregador veicular</option></select></label>
                  <label>Uma breve descrição<textarea name="message" placeholder="Pode escrever do seu jeito. O que está acontecendo?" rows={3} /></label>
                  <button className="form-submit" type="submit">Enviar para a engenharia <ArrowRight size={18} /></button>
                  <small>Se preferir, fale diretamente pelo WhatsApp. Seus dados serão usados apenas para retornar o contato.</small>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container faq-grid">
            <div><SectionKicker>Dúvidas frequentes</SectionKicker><h2>Antes de começar,<br /><span>vamos deixar claro.</span></h2></div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className={`faq-item ${openFaq === index ? "faq-open" : ""}`} key={faq.question}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{faq.question}</span><ChevronDown size={19} /></button>
                  <div className="faq-answer"><p>{faq.answer}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contato">
        <div className="container footer-top">
          <div className="footer-brand"><a className="brand-lockup" href="#top"><span className="brand-mark"><img src={logoUrl} alt="" /></span><span className="brand-copy"><strong>Portugal Engenharia</strong><small>energia • projeto • manutenção</small></span></a><p>Engenharia elétrica para reduzir custos, aumentar a segurança e fazer a energia trabalhar melhor.</p></div>
          <div className="footer-column"><span className="footer-label">Navegue</span><a href="#rotas">Soluções</a><a href="#servicos">Serviços</a><a href="#processo">Como fazemos</a><a href="#diagnostico">Diagnóstico</a></div>
          <div className="footer-column"><span className="footer-label">Fale com a gente</span><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a><a href="mailto:vendas@portugalengenharia.com.br">E-mail</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></div>
          <div className="footer-cta"><span className="footer-label">Seu próximo passo</span><h3>Uma boa decisão começa por uma boa pergunta.</h3><a href="#diagnostico">Iniciar conversa <ArrowRight size={16} /></a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Portugal Engenharia Elétrica</span><span>Valinhos • Campinas • Região</span><span>Projetar melhor. Operar com confiança.</span></div>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp"><MessageCircle size={23} /></a>
    </div>
  );
}

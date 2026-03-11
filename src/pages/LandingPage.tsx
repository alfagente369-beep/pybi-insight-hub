import { useNavigate } from "react-router-dom";
import { Trophy, Target, Zap, BarChart3, Shield, Star, ChevronRight, Check, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Fechamento Inteligente",
    description: "Selecione seus números com base em análises estatísticas dos últimos concursos. Maximize suas chances com dados reais.",
    color: "text-primary",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Análise de Frequência",
    description: "Identifique números quentes, frios e os que nunca saíram. Tome decisões baseadas em estatísticas concretas.",
    color: "text-secondary",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Geração Automática",
    description: "Gere múltiplos jogos otimizados com um clique. Balanceamento automático de ímpares e pares para cada cartão.",
    color: "text-accent",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Palpite de Fechamento",
    description: "Os 5 números com maior probabilidade são incluídos automaticamente em todos os seus cartões gerados.",
    color: "text-primary",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Jogos de 15, 16 ou 17",
    description: "Escolha o tamanho do seu jogo e aumente sua cobertura. Mais números significam mais combinações vencedoras.",
    color: "text-secondary",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Exportação CSV",
    description: "Baixe seus jogos gerados em formato CSV para conferência fácil e organização dos seus bilhetes.",
    color: "text-accent",
  },
];

const steps = [
  { num: "01", title: "Acesse o Gerador", desc: "Entre na ferramenta e veja os últimos resultados carregados automaticamente." },
  { num: "02", title: "Selecione sua Estratégia", desc: "Escolha entre Fechamento Inteligente ou Palpite de Fechamento." },
  { num: "03", title: "Configure seus Jogos", desc: "Defina quantidade, tamanho e números fixos para personalizar." },
  { num: "04", title: "Gere e Jogue", desc: "Clique em gerar e receba seus cartões otimizados prontos para apostar." },
];

const testimonials = [
  {
    stars: 5,
    text: "Acertei 13 pontos na semana passada usando o fechamento inteligente. A análise de frequência realmente faz diferença!",
    name: "Carlos M.",
    avatar: "C",
  },
  {
    stars: 5,
    text: "Uso há 3 meses e meus resultados melhoraram muito. O palpite de fechamento sempre inclui pelo menos 3 números certos.",
    name: "Ana Paula",
    avatar: "A",
  },
  {
    stars: 5,
    text: "Ferramenta incrível! Consigo gerar 50 jogos otimizados em segundos. O balanceamento automático é perfeito.",
    name: "Roberto S.",
    avatar: "R",
  },
];

const faqs = [
  { q: "O Fechamento LotoFacil garante premiação?", a: "Não garantimos premiação, mas nossas análises estatísticas aumentam significativamente suas chances ao selecionar números com maior probabilidade baseado em dados históricos reais." },
  { q: "Como funciona a análise de frequência?", a: "Analisamos os últimos 66 concursos para identificar padrões de números quentes (mais sorteados), frios (menos sorteados) e os que nunca apareceram nesse período." },
  { q: "Posso escolher quantos números por jogo?", a: "Sim! Oferecemos opções de 15, 16 ou 17 números por jogo. Mais números aumentam sua cobertura de combinações." },
  { q: "O que é o Palpite de Fechamento?", a: "São os 5 números com maior probabilidade de serem sorteados, calculados automaticamente com base nos últimos concursos e incluídos em todos os seus cartões." },
  { q: "Preciso pagar para usar?", a: "Atualmente a ferramenta é gratuita. Em breve teremos planos premium com funcionalidades avançadas." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-primary tracking-wider">FECHAMENTO LOTOFACIL</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Recursos</a>
            <a href="#how" className="hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preços</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <button onClick={() => navigate("/app")} className="glow-button !py-2 !px-5 !text-sm">
            Acessar Agora
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent font-medium mb-6">
              🎯 Gerador Inteligente de Fechamentos
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-black leading-tight mb-6">
              <span className="text-foreground">A Ferramenta Mais </span>
              <span className="text-primary">Inteligente</span>
              <span className="text-foreground"> para Jogar na LotoFacil</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Análise estatística avançada dos últimos 66 concursos. Gere fechamentos otimizados com números quentes, frios e palpites inteligentes. 
              <span className="text-secondary font-medium"> Aumente suas chances de acerto.</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/app")} className="glow-button flex items-center gap-2">
                Começar Agora <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#how" className="border border-border bg-card hover:bg-muted text-foreground font-heading font-bold tracking-wider px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2">
                Ver Demonstração
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="w-3 h-3 rounded-full bg-secondary/60" />
                <span className="text-xs text-muted-foreground ml-2">Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Acertos", value: "14/15", color: "bg-primary/20 text-primary" },
                  { label: "Jogos", value: "47", color: "bg-secondary/20 text-secondary" },
                  { label: "Taxa", value: "62%", color: "bg-accent/20 text-accent" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-lg p-3 text-center`}>
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[2, 5, 7, 9, 11, 13, 14, 16, 18, 19, 20, 21, 22, 24, 25].map((n) => (
                  <span key={n} className="number-ball number-ball-selected text-xs !w-8 !h-8">{String(n).padStart(2, "0")}</span>
                ))}
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Próximo sorteio</span>
                  <span className="text-primary font-bold">Concurso 3.299</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-secondary rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 text-xs text-secondary font-medium mb-4">
              🚀 Recursos Profissionais
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-3">
              O que o <span className="text-primary">Fechamento LotoFacil</span> Entrega
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transforme dados em decisões inteligentes. Aqui está tudo que você precisa para jogar com estratégia.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
                <div className={`${f.color} mb-4 group-hover:scale-110 transition-transform`}>{f.icon}</div>
                <h3 className="font-heading text-sm font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-3">
              Como <span className="text-secondary">Funciona</span>
            </h2>
            <p className="text-muted-foreground">Comece a gerar seus fechamentos em 4 passos simples</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-card border border-border flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-primary">{s.num}</span>
                </div>
                <h3 className="font-heading text-sm font-bold mb-2 text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-3">
              Planos e <span className="text-primary">Preços</span>
            </h2>
            <p className="text-muted-foreground">Escolha o plano ideal para suas apostas</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="font-heading text-sm font-bold mb-1 text-foreground">Plano Gratuito</h3>
              <div className="mb-6">
                <span className="font-heading text-4xl font-black text-foreground">R$ 0</span>
                <span className="text-muted-foreground text-sm">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Até 10 jogos por geração", "Análise básica de frequência", "Palpite de Fechamento", "Exportação CSV"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/app")} className="w-full border border-border bg-muted hover:bg-border text-foreground font-heading font-bold text-sm tracking-wider py-3 rounded-full transition-colors">
                Começar Grátis
              </button>
            </div>
            {/* Pro */}
            <div className="bg-card border-2 border-primary/60 rounded-2xl p-8 relative shadow-lg shadow-primary/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-heading font-bold px-4 py-1 rounded-full">
                MAIS POPULAR
              </div>
              <h3 className="font-heading text-sm font-bold mb-1 text-foreground">Plano Pro</h3>
              <div className="mb-6">
                <span className="font-heading text-4xl font-black text-primary">R$ 19,90</span>
                <span className="text-muted-foreground text-sm">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Até 50 jogos por geração", "Análise completa de frequência", "Números quentes e frios", "Fechamento Inteligente avançado", "Suporte prioritário", "Jogos de 15, 16 e 17 números"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button className="glow-button w-full !rounded-full flex items-center justify-center gap-2">
                Assinar Agora <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-3">
              O que nossos <span className="text-secondary">Jogadores</span> dizem
            </h2>
            <p className="text-muted-foreground">Jogadores de todo o Brasil usam o Fechamento LotoFacil</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {t.avatar}
                  </div>
                  <span className="text-sm font-medium text-foreground">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-3">
              Dúvidas <span className="text-primary">Frequentes</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {f.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-accent/20 via-card to-secondary/20 border border-border rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4">
                Pronto para <span className="text-primary">Aumentar suas Chances</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Comece agora e descubra como o Fechamento LotoFacil pode transformar sua estratégia de jogo.
              </p>
              <button onClick={() => navigate("/app")} className="glow-button flex items-center gap-2 mx-auto">
                Começar Agora <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-heading text-sm font-bold text-primary tracking-wider">FECHAMENTO LOTOFACIL</span>
          <p className="text-xs text-muted-foreground">© 2026 Fechamento LotoFacil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

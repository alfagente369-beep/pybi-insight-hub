import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Target, TrendingUp, Calendar, Download, Star } from "lucide-react";

// Dados fictícios para demonstração
const mockHistorico = [
  {
    id: 1,
    data: "28/02/2026 14:32",
    jogos: 10,
    tamanho: 15,
    concurso: "3245",
    melhorAcerto: 13,
    premio: "R$ 1.200,00",
  },
  {
    id: 2,
    data: "25/02/2026 09:15",
    jogos: 8,
    tamanho: 16,
    concurso: "3244",
    melhorAcerto: 12,
    premio: "R$ 30,00",
  },
  {
    id: 3,
    data: "22/02/2026 20:45",
    jogos: 15,
    tamanho: 15,
    concurso: "3243",
    melhorAcerto: 11,
    premio: "R$ 6,00",
  },
  {
    id: 4,
    data: "18/02/2026 11:00",
    jogos: 5,
    tamanho: 17,
    concurso: "3242",
    melhorAcerto: 14,
    premio: "R$ 12.500,00",
  },
  {
    id: 5,
    data: "14/02/2026 16:20",
    jogos: 12,
    tamanho: 15,
    concurso: "3241",
    melhorAcerto: 10,
    premio: null,
  },
];

const mockEstatisticas = {
  totalJogos: 50,
  totalConcursos: 5,
  melhorAcerto: 14,
  mediaAcertos: 11.2,
  premioTotal: "R$ 13.736,00",
  taxaAcerto11: 68,
  taxaAcerto12: 40,
  taxaAcerto13: 20,
  taxaAcerto14: 4,
  taxaAcerto15: 0,
  numerosFrequentes: [3, 7, 10, 14, 18, 21, 24],
};

const PerfilPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-black text-primary tracking-wider">
              MEU PERFIL
            </h1>
            <p className="text-sm text-muted-foreground">
              Histórico de jogos e estatísticas de acertos
            </p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="card-gold">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-heading font-black text-primary">14</p>
              <p className="text-xs text-muted-foreground">Melhor Acerto</p>
            </CardContent>
          </Card>
          <Card className="card-cyan">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-1 text-secondary" />
              <p className="text-2xl font-heading font-black text-secondary">50</p>
              <p className="text-xs text-muted-foreground">Jogos Gerados</p>
            </CardContent>
          </Card>
          <Card className="card-purple">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-1 text-accent" />
              <p className="text-2xl font-heading font-black text-accent">11.2</p>
              <p className="text-xs text-muted-foreground">Média Acertos</p>
            </CardContent>
          </Card>
          <Card className="card-orange">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-1 text-orange" />
              <p className="text-lg font-heading font-black text-orange">R$ 13.7K</p>
              <p className="text-xs text-muted-foreground">Prêmios Total</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="historico" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="historico" className="font-heading text-xs tracking-wider">
              HISTÓRICO
            </TabsTrigger>
            <TabsTrigger value="estatisticas" className="font-heading text-xs tracking-wider">
              ESTATÍSTICAS
            </TabsTrigger>
          </TabsList>

          {/* Aba Histórico */}
          <TabsContent value="historico">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-heading tracking-wider text-muted-foreground">
                  ÚLTIMOS FECHAMENTOS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockHistorico.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.data}</span>
                        <Badge variant="outline" className="text-xs">
                          Concurso {item.concurso}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground">
                          {item.jogos} jogos de {item.tamanho} números
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span
                          className={`text-lg font-heading font-black ${
                            item.melhorAcerto >= 14
                              ? "text-primary"
                              : item.melhorAcerto >= 12
                              ? "text-secondary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.melhorAcerto}
                        </span>
                        <span className="text-xs text-muted-foreground">acertos</span>
                      </div>
                      {item.premio && (
                        <span className="text-xs font-bold text-primary">{item.premio}</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Estatísticas */}
          <TabsContent value="estatisticas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Taxa de acertos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-heading tracking-wider text-muted-foreground">
                    TAXA DE ACERTOS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "11+ acertos", pct: mockEstatisticas.taxaAcerto11, color: "bg-muted-foreground" },
                    { label: "12+ acertos", pct: mockEstatisticas.taxaAcerto12, color: "bg-secondary" },
                    { label: "13+ acertos", pct: mockEstatisticas.taxaAcerto13, color: "bg-primary" },
                    { label: "14+ acertos", pct: mockEstatisticas.taxaAcerto14, color: "bg-primary" },
                    { label: "15 acertos", pct: mockEstatisticas.taxaAcerto15, color: "bg-destructive" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground">{item.label}</span>
                        <span className="text-muted-foreground font-bold">{item.pct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Números mais usados */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-heading tracking-wider text-muted-foreground">
                    NÚMEROS MAIS FREQUENTES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockEstatisticas.numerosFrequentes.map((n) => (
                      <div
                        key={n}
                        className="number-ball number-ball-selected"
                      >
                        {String(n).padStart(2, "0")}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Números que mais apareceram nos seus fechamentos com melhor desempenho.
                  </p>
                </CardContent>
              </Card>

              {/* Resumo geral */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-heading tracking-wider text-muted-foreground">
                    RESUMO GERAL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-heading font-black text-foreground">
                        {mockEstatisticas.totalConcursos}
                      </p>
                      <p className="text-xs text-muted-foreground">Concursos Jogados</p>
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-black text-foreground">
                        {mockEstatisticas.totalJogos}
                      </p>
                      <p className="text-xs text-muted-foreground">Jogos Conferidos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-black text-primary">
                        {mockEstatisticas.melhorAcerto}
                      </p>
                      <p className="text-xs text-muted-foreground">Recorde de Acertos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-black text-secondary">
                        {mockEstatisticas.premioTotal}
                      </p>
                      <p className="text-xs text-muted-foreground">Prêmios Acumulados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
          ⚠️ Dados fictícios para demonstração. Para funcionalidade real, ative o Lovable Cloud.
        </p>
      </div>
    </div>
  );
};

export default PerfilPage;

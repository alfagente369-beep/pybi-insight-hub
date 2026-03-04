import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Target, TrendingUp, Star, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface JogoHistorico {
  id: string;
  concurso: string | null;
  total_jogos: number;
  tamanho_jogo: number;
  created_at: string;
}

interface ResultadoHistorico {
  id: string;
  concurso: string;
  melhor_acerto: number;
  premio_estimado: string | null;
  created_at: string;
  jogo_id: string | null;
}

const PerfilPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [jogos, setJogos] = useState<JogoHistorico[]>([]);
  const [resultados, setResultados] = useState<ResultadoHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [jogosRes, resultadosRes] = await Promise.all([
        supabase.from("jogos_gerados").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("resultados_conferencia").select("*").order("created_at", { ascending: false }).limit(20),
      ]);
      setJogos((jogosRes.data as JogoHistorico[]) ?? []);
      setResultados((resultadosRes.data as ResultadoHistorico[]) ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalJogos = jogos.reduce((acc, j) => acc + j.total_jogos, 0);
  const melhorAcerto = resultados.length > 0 ? Math.max(...resultados.map((r) => r.melhor_acerto)) : 0;
  const mediaAcertos = resultados.length > 0
    ? (resultados.reduce((acc, r) => acc + r.melhor_acerto, 0) / resultados.length).toFixed(1)
    : "0";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
                {user?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="card-gold">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-heading font-black text-primary">{melhorAcerto}</p>
              <p className="text-xs text-muted-foreground">Melhor Acerto</p>
            </CardContent>
          </Card>
          <Card className="card-cyan">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-1 text-secondary" />
              <p className="text-2xl font-heading font-black text-secondary">{totalJogos}</p>
              <p className="text-xs text-muted-foreground">Jogos Gerados</p>
            </CardContent>
          </Card>
          <Card className="card-purple">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-1 text-accent" />
              <p className="text-2xl font-heading font-black text-accent">{mediaAcertos}</p>
              <p className="text-xs text-muted-foreground">Média Acertos</p>
            </CardContent>
          </Card>
          <Card className="card-orange">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-1 text-orange" />
              <p className="text-lg font-heading font-black text-orange">{jogos.length}</p>
              <p className="text-xs text-muted-foreground">Fechamentos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="historico" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="historico" className="font-heading text-xs tracking-wider">
              HISTÓRICO
            </TabsTrigger>
            <TabsTrigger value="resultados" className="font-heading text-xs tracking-wider">
              RESULTADOS
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
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Carregando...</p>
                ) : jogos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum fechamento realizado ainda. Vá ao app e gere seus jogos!
                  </p>
                ) : (
                  jogos.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString("pt-BR")}
                          </span>
                          {item.concurso && (
                            <Badge variant="outline" className="text-xs">
                              Concurso {item.concurso}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-foreground">
                          {item.total_jogos} jogos de {item.tamanho_jogo} números
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Resultados */}
          <TabsContent value="resultados">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-heading tracking-wider text-muted-foreground">
                  CONFERÊNCIAS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Carregando...</p>
                ) : resultados.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma conferência realizada ainda.
                  </p>
                ) : (
                  resultados.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString("pt-BR")}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Concurso {item.concurso}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-lg font-heading font-black ${
                            item.melhor_acerto >= 14
                              ? "text-primary"
                              : item.melhor_acerto >= 12
                              ? "text-secondary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.melhor_acerto}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">acertos</span>
                        {item.premio_estimado && (
                          <p className="text-xs font-bold text-primary">{item.premio_estimado}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerfilPage;

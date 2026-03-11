import { useMemo } from "react";
import { type JogoGerado } from "@/lib/lotofacil";

interface ConferenciaRapidaProps {
  jogos: JogoGerado[];
  resultadoSorteado: number[];
}

const ConferenciaRapida = ({ jogos, resultadoSorteado }: ConferenciaRapidaProps) => {
  const conferencia = useMemo(() => {
    if (jogos.length === 0 || resultadoSorteado.length === 0) return [];
    return jogos.map((jogo) => {
      const acertos = jogo.numeros.filter((n) => resultadoSorteado.includes(n));
      return { id: jogo.id, acertos: acertos.length, numerosAcertados: acertos };
    });
  }, [jogos, resultadoSorteado]);

  const melhor = conferencia.length > 0
    ? conferencia.reduce((a, b) => (a.acertos > b.acertos ? a : b))
    : null;

  const getPremio = (acertos: number) => {
    if (acertos >= 15) return "💰 15 ACERTOS - PRÊMIO MÁXIMO!";
    if (acertos >= 14) return "🥈 14 acertos";
    if (acertos >= 13) return "🥉 13 acertos";
    if (acertos >= 12) return "🎟️ 12 acertos";
    if (acertos >= 11) return "🎫 11 acertos";
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-4 card-purple">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Conferência Rápida</h3>

      {melhor ? (
        <>
          <p className="text-sm text-muted-foreground mb-2">Melhor Jogo (#{melhor.id})</p>
          <div className="bg-muted rounded-lg p-4 mb-3 flex items-baseline gap-2 justify-center">
            <span className="text-5xl font-heading font-black text-primary">{melhor.acertos}</span>
            <span className="text-lg font-heading font-bold text-foreground">PONTOS</span>
          </div>

          {getPremio(melhor.acertos) && (
            <p className="text-center text-sm text-primary font-bold mb-1">
              {getPremio(melhor.acertos)}
            </p>
          )}
          <p className="text-center text-xs text-muted-foreground mb-3">
            {conferencia.filter(c => c.acertos > 10).length} de {conferencia.length} jogos com mais de 10 acertos
          </p>

          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
            {conferencia.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm bg-muted rounded px-3 py-1.5">
                <span className="text-muted-foreground">Jogo #{String(c.id).padStart(2, "0")}</span>
                <span className={`font-bold font-heading ${c.acertos >= 11 ? "text-primary" : "text-muted-foreground"}`}>
                  {c.acertos} acertos
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Gere jogos e aguarde o resultado para conferir seus acertos automaticamente.
        </p>
      )}
    </div>
  );
};

export default ConferenciaRapida;

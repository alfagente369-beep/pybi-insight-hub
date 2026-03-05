interface AcertoJogo {
  jogoId: number;
  acertos: number;
}

interface ConferenciaRapidaProps {
  melhorJogo: number | null;
  melhorAcerto: number;
  acertosPorJogo: AcertoJogo[];
}

export function ConferenciaRapida({ melhorJogo, melhorAcerto, acertosPorJogo }: ConferenciaRapidaProps) {
  const jogosAcima10 = acertosPorJogo.filter((j) => j.acertos >= 10).length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
      <h3 className="font-heading text-sm font-bold text-foreground mb-3">Conferência Rápida</h3>

      {melhorJogo === null ? (
        <p className="text-muted-foreground text-xs text-center py-8">
          Gere jogos e aguarde o resultado para conferir seus acertos automaticamente.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-2">
            Melhor Jogo (<span className="text-gold">#{String(melhorJogo).padStart(2, "0")}</span>)
          </p>

          <div className="bg-secondary rounded-lg py-4 text-center mb-2">
            <span className="font-heading text-4xl font-black text-foreground">{melhorAcerto}</span>
            <span className="font-heading text-sm font-bold text-foreground ml-2">PONTOS</span>
          </div>

          <p className="text-xs text-center mb-3">
            <span className="text-gold">🎯 {melhorAcerto} acertos</span>
          </p>

          <div className="flex-1 overflow-y-auto space-y-1 max-h-[160px]">
            {acertosPorJogo.map((j) => (
              <div key={j.jogoId} className="flex justify-between text-xs px-1">
                <span className="text-muted-foreground">Jogo #{String(j.jogoId).padStart(2, "0")}</span>
                <span className={j.acertos >= 11 ? "text-gold font-bold" : "text-foreground"}>
                  {j.acertos} acertos
                </span>
              </div>
            ))}
          </div>

          {jogosAcima10 > 0 && (
            <p className="text-[10px] text-cyan text-center mt-2">
              {jogosAcima10} jogo(s) com 10+ acertos
            </p>
          )}
        </>
      )}
    </div>
  );
}

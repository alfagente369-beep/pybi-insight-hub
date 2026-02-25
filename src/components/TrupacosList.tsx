import { type JogoGerado } from "@/lib/lotofacil";
import { calcularEstatisticas } from "@/lib/lotofacil";

interface TrupacosListProps {
  jogos: JogoGerado[];
}

const TrupacosList = ({ jogos }: TrupacosListProps) => {
  return (
    <div className="bg-card rounded-lg p-4 card-gold border-muted">
      <h3 className="font-heading text-lg font-bold mb-2 text-foreground">Gerador</h3>

      {jogos.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Clique em "GERAR JOGOS" para criar combinações.
        </p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {jogos.map((jogo) => {
            const stats = calcularEstatisticas(jogo.numeros);
            return (
              <div key={jogo.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold text-xs min-w-[28px] text-center">
                    {String(jogo.id).padStart(2, "0")}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {jogo.numeros.map((n) => (
                      <span
                        key={n}
                        className="number-ball number-ball-selected !w-7 !h-7 text-xs"
                      >
                        {String(n).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-9">
                  P:{stats.pares} I:{stats.impares} Σ:{stats.soma}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrupacosList;

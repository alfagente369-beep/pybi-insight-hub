import { type JogoGerado } from "@/lib/lotofacil";
import { calcularEstatisticas, downloadCSV } from "@/lib/lotofacil";

interface TrupacosListProps {
  jogos: JogoGerado[];
  onSalvarModelo?: () => void;
}

const TrupacosList = ({ jogos, onSalvarModelo }: TrupacosListProps) => {
  return (
    <div className="bg-card rounded-lg p-4 card-gold border-muted">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-lg font-bold text-foreground">Gerador</h3>
        <div className="flex gap-2">
          <button
            onClick={() => jogos.length > 0 && downloadCSV(jogos)}
            disabled={jogos.length === 0}
            className="bg-muted hover:bg-border text-foreground text-xs px-4 py-1.5 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            BAIXAR CSV
          </button>
          <button
            onClick={onSalvarModelo}
            className="bg-muted hover:bg-border text-foreground text-xs px-4 py-1.5 rounded font-medium transition-colors"
          >
            SALVAR MODELO
          </button>
        </div>
      </div>

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

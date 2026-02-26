import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ResultadoLotofacil } from "@/lib/lotofacil";

interface UltimosResultadosProps {
  resultados: ResultadoLotofacil[];
  loading: boolean;
  onSincronizar: () => void;
}

const VISIBLE_COUNT = 2;

const UltimosResultados = ({ resultados, loading, onSincronizar }: UltimosResultadosProps) => {
  const [offset, setOffset] = useState(0);

  const maxOffset = Math.max(0, resultados.length - VISIBLE_COUNT);
  const visibleResultados = resultados.slice(offset, offset + VISIBLE_COUNT);

  const scrollUp = () => setOffset((prev) => Math.max(0, prev - 1));
  const scrollDown = () => setOffset((prev) => Math.min(maxOffset, prev + 1));

  return (
    <div className="bg-card rounded-lg p-4 card-yellow h-full">
      <h3 className="font-heading text-sm font-bold mb-3 text-foreground">
        <span className="text-primary">Últimos Resultados</span>
        {resultados.length > 0 && (
          <span className="text-xs text-muted-foreground ml-2 font-normal">
            {offset + 1}–{Math.min(offset + VISIBLE_COUNT, resultados.length)} de {resultados.length}
          </span>
        )}
      </h3>

      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
      ) : resultados.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Nenhum resultado carregado.</p>
      ) : (
        <div className="space-y-3">
          {resultados.length > VISIBLE_COUNT && (
            <button
              onClick={scrollUp}
              disabled={offset === 0}
              className="w-full flex justify-center py-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {visibleResultados.map((r) => (
            <div key={r.concurso}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-heading text-primary font-bold">#{r.concurso}</span>
                <span className="text-xs text-muted-foreground">{r.data}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {r.numeros.map((n) => (
                  <span key={n} className="number-ball number-ball-selected !w-7 !h-7 text-xs">
                    {String(n).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {resultados.length > VISIBLE_COUNT && (
            <button
              onClick={scrollDown}
              disabled={offset >= maxOffset}
              className="w-full flex justify-center py-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <button
        onClick={onSincronizar}
        disabled={loading}
        className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
      >
        <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
        {loading ? "Sincronizando..." : "Sincronizar Dados"}
      </button>
    </div>
  );
};

export default UltimosResultados;

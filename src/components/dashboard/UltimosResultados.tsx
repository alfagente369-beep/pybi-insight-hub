import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { NumberSphere } from "./NumberSphere";

interface Resultado {
  concurso: string;
  data: string;
  numeros: number[];
}

interface UltimosResultadosProps {
  resultados: Resultado[];
  fonte: string;
}

export function UltimosResultados({ resultados, fonte }: UltimosResultadosProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visible = resultados.slice(startIndex, startIndex + 2);
  const total = resultados.length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-sm font-bold text-foreground">
          Últimos Resultados{" "}
          <span className="text-muted-foreground text-[10px] font-body">
            {startIndex + 1}–{Math.min(startIndex + 2, total)} de {total}
          </span>
        </h3>
        <div className="flex items-center gap-1">
          <input
            placeholder="Ex: 3200,3199,3198"
            className="bg-secondary border border-border text-foreground text-[10px] rounded px-2 py-1 w-28"
          />
          <button className="bg-secondary hover:bg-muted text-foreground p-1 rounded text-xs">→</button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden">
        {visible.map((r) => (
          <div key={r.concurso}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan font-heading text-xs font-bold">#{r.concurso}</span>
              <span className="text-muted-foreground text-[10px]">{r.data}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {r.numeros.map((n) => (
                <NumberSphere key={n} number={n} small />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1 mt-2">
        <button
          onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
          disabled={startIndex === 0}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => setStartIndex(Math.min(total - 2, startIndex + 1))}
          disabled={startIndex >= total - 2}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-cyan">
        <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-glow" />
        Sincronizar Dados
      </div>
    </div>
  );
}

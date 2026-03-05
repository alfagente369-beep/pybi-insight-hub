import { NumberSphere } from "./NumberSphere";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useRef } from "react";

interface Jogo {
  id: number;
  numeros: number[];
  pares: number;
  impares: number;
  soma: number;
}

interface GeradorPanelProps {
  jogos: Jogo[];
  onDownloadCSV: () => void;
  onSalvarModelo: () => void;
}

export function GeradorPanel({ jogos, onDownloadCSV, onSalvarModelo }: GeradorPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "up" | "down") => {
    scrollRef.current?.scrollBy({ top: dir === "up" ? -120 : 120, behavior: "smooth" });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-sm font-bold text-foreground">Gerador</h3>
        {jogos.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onDownloadCSV}
              className="bg-secondary hover:bg-muted text-foreground font-heading text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-md transition-colors"
            >
              Baixar CSV
            </button>
            <button
              onClick={onSalvarModelo}
              className="bg-secondary hover:bg-muted text-foreground font-heading text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-md transition-colors"
            >
              Salvar Modelo
            </button>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[280px]">
        {jogos.length === 0 ? (
          <p className="text-muted-foreground text-xs text-center py-8">
            Clique em "GERAR JOGOS" para criar combinações.
          </p>
        ) : (
          jogos.map((j) => (
            <div key={j.id} className="flex items-start gap-2">
              <span className="font-heading text-[10px] text-cyan font-bold mt-1 min-w-[20px]">
                {String(j.id).padStart(2, "0")}
              </span>
              <div>
                <div className="flex flex-wrap gap-1">
                  {j.numeros.map((n) => (
                    <NumberSphere key={n} number={n} small />
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  P:{j.pares} I:{j.impares} Σ:{j.soma}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {jogos.length > 3 && (
        <div className="flex justify-center gap-1 mt-2">
          <button onClick={() => scroll("up")} className="text-muted-foreground hover:text-foreground">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("down")} className="text-muted-foreground hover:text-foreground">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

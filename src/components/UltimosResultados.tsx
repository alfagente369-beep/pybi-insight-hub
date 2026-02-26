import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ResultadoLotofacil, type FontePalpite } from "@/lib/lotofacil";

interface UltimosResultadosProps {
  resultados: ResultadoLotofacil[];
  loading: boolean;
  onSincronizar: () => void;
  fonte: FontePalpite;
}

const VISIBLE_COUNT = 2;

const fonteToQty = (fonte: FontePalpite) =>
  fonte === "ultimos3" ? 3 : fonte === "ultimos5" ? 5 : 10;

const UltimosResultados = ({ resultados, loading, onSincronizar, fonte }: UltimosResultadosProps) => {
  const [offset, setOffset] = useState(0);
  const [manualInput, setManualInput] = useState("");
  const [manualResultados, setManualResultados] = useState<ResultadoLotofacil[]>([]);
  const [loadingManual, setLoadingManual] = useState(false);

  const qty = fonteToQty(fonte);
  const filteredResultados = useMemo(() => resultados.slice(0, qty), [resultados, qty]);

  // If manual results exist, show ONLY those; otherwise use fonte-filtered
  const allResultados = useMemo(() => {
    if (manualResultados.length > 0) {
      return [...manualResultados].sort((a, b) => b.concurso - a.concurso);
    }
    return filteredResultados;
  }, [filteredResultados, manualResultados]);

  const maxOffset = Math.max(0, allResultados.length - VISIBLE_COUNT);
  const visibleResultados = allResultados.slice(offset, offset + VISIBLE_COUNT);

  // Reset offset when fonte changes
  useState(() => setOffset(0));

  const scrollUp = () => setOffset((prev) => Math.max(0, prev - 1));
  const scrollDown = () => setOffset((prev) => Math.min(maxOffset, prev + 1));

  const handleManualSearch = async () => {
    const concursos = manualInput
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)
      .slice(0, 3);

    if (concursos.length === 0) return;

    setLoadingManual(true);
    const results: ResultadoLotofacil[] = [];
    for (const c of concursos) {
      // Check if already in resultados
      const existing = resultados.find((r) => r.concurso === c);
      if (existing) {
        results.push(existing);
        continue;
      }
      try {
        const res = await fetch(`https://loteriascaixa-api.herokuapp.com/api/lotofacil/${c}`);
        if (res.ok) {
          const data = await res.json();
          results.push({
            concurso: data.concurso,
            data: data.data,
            numeros: (data.dezenas as string[]).map(Number).sort((a, b) => a - b),
          });
        }
      } catch {
        // skip
      }
    }
    setManualResultados(results);
    setOffset(0);
    setLoadingManual(false);
  };

  return (
    <div className="bg-card rounded-lg p-4 card-yellow h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-sm font-bold text-foreground">
          <span className="text-primary">Últimos Resultados</span>
          {allResultados.length > 0 && (
            <span className="text-xs text-muted-foreground ml-2 font-normal">
              {offset + 1}–{Math.min(offset + VISIBLE_COUNT, allResultados.length)} de {allResultados.length}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
            placeholder="Ex: 3200,3199,3198"
            className="w-36 h-7 text-[11px] bg-yellow-500/10 border border-yellow-500/40 rounded px-1.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleManualSearch}
            disabled={loadingManual || !manualInput.trim()}
            className="h-7 px-2 text-[11px] bg-yellow-500/20 border border-yellow-500/40 rounded text-foreground hover:bg-yellow-500/30 transition-colors disabled:opacity-40"
          >
            {loadingManual ? "..." : "Ir"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
      ) : allResultados.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Nenhum resultado carregado.</p>
      ) : (
        <div className="space-y-3">
          {allResultados.length > VISIBLE_COUNT && (
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
                {manualResultados.some((m) => m.concurso === r.concurso) && (
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-600 px-1 rounded">manual</span>
                )}
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

          {allResultados.length > VISIBLE_COUNT && (
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

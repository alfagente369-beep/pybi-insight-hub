import { type ResultadoLotofacil } from "@/lib/lotofacil";

interface UltimosResultadosProps {
  resultados: ResultadoLotofacil[];
  loading: boolean;
  onSincronizar: () => void;
}

const UltimosResultados = ({ resultados, loading, onSincronizar }: UltimosResultadosProps) => {
  return (
    <div className="bg-card rounded-lg p-4 card-yellow">
      <h3 className="font-heading text-sm font-bold mb-3 text-foreground">
        <span className="text-primary">Últimos Resultados</span>
      </h3>

      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
      ) : resultados.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Nenhum resultado carregado.</p>
      ) : (
        <div className="space-y-3">
          {resultados.map((r) => (
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

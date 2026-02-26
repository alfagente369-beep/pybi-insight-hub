import { useState, useEffect } from "react";
import { calcularTop5, calcularQuentesFrios, type ResultadoLotofacil, type FontePalpite, type EstatisticasNumeros } from "@/lib/lotofacil";

interface PalpiteSectionProps {
  resultados: ResultadoLotofacil[];
  onPalpiteChange: (palpites: number[]) => void;
}

const FONTES: { value: FontePalpite; label: string }[] = [
  { value: "ultimos3", label: "3 últimos jogos" },
  { value: "ultimos5", label: "5 últimos jogos" },
  { value: "ultimos10", label: "10 últimos jogos" },
];

type OverlayType = "quentes" | "frios" | null;

const PalpiteSection = ({ resultados, onPalpiteChange }: PalpiteSectionProps) => {
  const [fonte, setFonte] = useState<FontePalpite>("ultimos3");
  const [palpites, setPalpites] = useState<number[]>([]);
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasNumeros>({ quentes: [], frios: [], nunca: [] });

  useEffect(() => {
    if (resultados.length === 0) return;
    setEstatisticas(calcularQuentesFrios(resultados.slice(0, 33)));
  }, [resultados]);

  useEffect(() => {
    if (resultados.length === 0) return;
    const top5 = calcularTop5(resultados, fonte);
    setPalpites(top5);
  }, [resultados, fonte]);

  useEffect(() => {
    if (palpites.length > 0) {
      onPalpiteChange(palpites);
    }
  }, [palpites, onPalpiteChange]);

  const handleOverlayChange = (newOverlay: OverlayType) => {
    setOverlay(overlay === newOverlay ? null : newOverlay);
  };

  const getBallClass = (num: number) => {
    if (overlay === "quentes" && estatisticas.quentes.includes(num)) return "number-ball number-ball-hot";
    if (overlay === "frios") {
      if (estatisticas.nunca.includes(num)) return "number-ball number-ball-never";
      if (estatisticas.frios.includes(num)) return "number-ball number-ball-cold";
    }
    return "";
  };

  const overlays: { key: OverlayType; label: string }[] = [
    { key: "quentes", label: "Números Quentes" },
    { key: "frios", label: "Números Frios" },
  ];

  return (
    <div className="bg-card rounded-lg p-4 card-red h-full">
      <h3 className="font-heading text-sm font-bold mb-3 text-foreground text-center uppercase tracking-wider">
        Palpite de Fechamento
      </h3>

      <div className="mb-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-1">
          Fonte dos dados
        </label>
        <select
          value={fonte}
          onChange={(e) => setFonte(e.target.value as FontePalpite)}
          className="w-full h-9 bg-muted border border-border rounded text-sm text-foreground px-2 focus:ring-2 focus:ring-primary outline-none"
        >
          {FONTES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Overlay toggles - Quentes/Frios */}
      <div className="flex flex-wrap gap-2 mb-3">
        {overlays.map((o) => (
          <label key={o.key} className="flex items-center gap-1.5 cursor-pointer text-sm" onClick={() => handleOverlayChange(o.key)}>
            <span
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                overlay === o.key
                  ? o.key === "quentes" ? "border-orange bg-orange" : "border-cyan bg-cyan"
                  : "border-muted-foreground"
              }`}
            >
              {overlay === o.key && <span className="w-2 h-2 bg-primary-foreground rounded-sm" />}
            </span>
            <span className="text-muted-foreground">{o.label}</span>
          </label>
        ))}
      </div>

      {overlay && (
        <p className="text-xs text-muted-foreground mb-2 italic">
          {overlay === "quentes" && "🔴 Quentes: mais sorteados nos últimos 33 concursos."}
          {overlay === "frios" && "🔵 Frios: até 6x em 33 concursos. 🟣 Nunca saíram."}
        </p>
      )}

      <div className="grid grid-cols-5 gap-2 mb-4">
        {palpites.map((p, i) => {
          const extraClass = getBallClass(p);
          return (
            <div
              key={i}
              className={extraClass || "w-full h-12 bg-primary/20 border border-primary/40 rounded flex items-center justify-center text-primary font-bold text-lg"}
            >
              {String(p).padStart(2, "0")}
            </div>
          );
        })}
        {palpites.length === 0 && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-muted border border-border rounded flex items-center justify-center text-muted-foreground">
            --
          </div>
        ))}
      </div>
    </div>
  );
};

export default PalpiteSection;

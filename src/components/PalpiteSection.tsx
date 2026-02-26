import { useState, useEffect } from "react";
import { calcularMaisSaidos, calcularMenosSaidos, type ResultadoLotofacil, type FontePalpite, type NumeroFrio, type NumeroQuente } from "@/lib/lotofacil";

interface PalpiteSectionProps {
  resultados: ResultadoLotofacil[];
  onPalpiteChange: (palpites: number[]) => void;
  fonte: FontePalpite;
  onFonteChange: (fonte: FontePalpite) => void;
}

const FONTES: { value: FontePalpite; label: string }[] = [
  { value: "ultimos3", label: "3 últimos jogos" },
  { value: "ultimos5", label: "5 últimos jogos" },
  { value: "ultimos10", label: "10 últimos jogos" },
];

const PalpiteSection = ({ resultados, onPalpiteChange, fonte, onFonteChange }: PalpiteSectionProps) => {
  const [palpites, setPalpites] = useState<number[]>([]);
  const [maisSaidos, setMaisSaidos] = useState<NumeroQuente[]>([]);
  const [menosSaidos, setMenosSaidos] = useState<NumeroFrio[]>([]);

  useEffect(() => {
    if (resultados.length === 0) return;
    const mais = calcularMaisSaidos(resultados, fonte);
    setMaisSaidos(mais);
    setPalpites(mais.map(m => m.numero));
    setMenosSaidos(calcularMenosSaidos(resultados, fonte));
  }, [resultados, fonte]);

  useEffect(() => {
    if (palpites.length > 0) {
      onPalpiteChange(palpites);
    }
  }, [palpites, onPalpiteChange]);

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
          onChange={(e) => onFonteChange(e.target.value as FontePalpite)}
          className="w-full h-9 bg-muted border border-border rounded text-sm text-foreground px-2 focus:ring-2 focus:ring-primary outline-none"
        >
          {FONTES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted-foreground mb-1 font-heading uppercase tracking-wider">Mais sorteados</p>
      <div className="grid grid-cols-5 gap-2 mb-2">
        {maisSaidos.map((item, i) => (
          <div
            key={i}
            className="w-full h-12 bg-orange/20 border border-orange/60 rounded flex flex-col items-center justify-center"
          >
            <span className="text-orange font-bold text-lg leading-none">{String(item.numero).padStart(2, "0")}</span>
            <span className="text-[10px] text-orange/70 leading-none mt-0.5">{item.frequencia}x</span>
          </div>
        ))}
        {maisSaidos.length === 0 && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-muted border border-border rounded flex items-center justify-center text-muted-foreground">
            --
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-1 font-heading uppercase tracking-wider">Menos sorteados</p>
      <div className="grid grid-cols-5 gap-2 mb-2">
        {menosSaidos.map((item, i) => (
          <div
            key={i}
            className="w-full h-12 bg-cyan/20 border border-cyan/60 rounded flex flex-col items-center justify-center"
          >
            <span className="text-cyan font-bold text-lg leading-none">{String(item.numero).padStart(2, "0")}</span>
            <span className="text-[10px] text-cyan/70 leading-none mt-0.5">{item.frequencia}x</span>
          </div>
        ))}
        {menosSaidos.length === 0 && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-muted border border-border rounded flex items-center justify-center text-muted-foreground">
            --
          </div>
        ))}
      </div>
    </div>
  );
};

export default PalpiteSection;

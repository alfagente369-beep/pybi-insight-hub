import { useState, useEffect } from "react";
import { calcularTop5, type ResultadoLotofacil, type FontePalpite } from "@/lib/lotofacil";

interface PalpiteSectionProps {
  resultados: ResultadoLotofacil[];
  onPalpiteChange: (palpites: number[], qtdImpar: number, qtdPar: number) => void;
}

const FONTES: { value: FontePalpite; label: string }[] = [
  { value: "primeiros33de66", label: "Primeiros 33 dos últimos 66" },
  { value: "ultimos33", label: "Últimos 33 concursos" },
  { value: "todos66", label: "Todos os 66 concursos" },
];

const PalpiteSection = ({ resultados, onPalpiteChange }: PalpiteSectionProps) => {
  const [fonte, setFonte] = useState<FontePalpite>("primeiros33de66");
  const [palpites, setPalpites] = useState<number[]>([]);
  const [qtdImpar, setQtdImpar] = useState(0);
  const [qtdPar, setQtdPar] = useState(0);

  useEffect(() => {
    if (resultados.length === 0) return;
    const top5 = calcularTop5(resultados, fonte);
    setPalpites(top5);

    const impares = top5.filter((n) => n % 2 !== 0).length;
    const pares = top5.filter((n) => n % 2 === 0).length;
    // Para um jogo de 15: distribuir proporcionalmente
    const totalImpar = Math.round((impares / 5) * 15);
    const totalPar = 15 - totalImpar;
    setQtdImpar(totalImpar);
    setQtdPar(totalPar);
  }, [resultados, fonte]);

  useEffect(() => {
    if (palpites.length > 0) {
      onPalpiteChange(palpites, qtdImpar, qtdPar);
    }
  }, [palpites, qtdImpar, qtdPar, onPalpiteChange]);

  return (
    <div className="bg-card rounded-lg p-4 card-red">
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

      <div className="grid grid-cols-5 gap-2 mb-4">
        {palpites.map((p, i) => (
          <div
            key={i}
            className="w-full h-12 bg-primary/20 border border-primary/40 rounded flex items-center justify-center text-primary font-bold text-lg"
          >
            {String(p).padStart(2, "0")}
          </div>
        ))}
        {palpites.length === 0 && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-12 bg-muted border border-border rounded flex items-center justify-center text-muted-foreground">
            --
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-1 text-center">
            Quantidade de Ímpar
          </label>
          <div className="w-full h-10 bg-muted border border-border rounded flex items-center justify-center text-foreground font-bold">
            {qtdImpar}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-1 text-center">
            Quantidade de Par
          </label>
          <div className="w-full h-10 bg-muted border border-border rounded flex items-center justify-center text-foreground font-bold">
            {qtdPar}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalpiteSection;

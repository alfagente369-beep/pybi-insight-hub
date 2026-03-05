import { useState } from "react";
import { NumberSphere } from "./NumberSphere";
import { X } from "lucide-react";

interface FechamentoInteligenteProps {
  selectedNumbers: number[];
  fixedNumbers: number[];
  mode: "numeros" | "fixos";
  onModeChange: (mode: "numeros" | "fixos") => void;
  onToggleNumber: (n: number) => void;
  onClear: () => void;
}

export function FechamentoInteligente({
  selectedNumbers,
  fixedNumbers,
  mode,
  onModeChange,
  onToggleNumber,
  onClear,
}: FechamentoInteligenteProps) {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  const activeList = mode === "numeros" ? selectedNumbers : fixedNumbers;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
      <h3 className="font-heading text-sm font-bold text-foreground mb-3">Fechamento Inteligente</h3>

      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <input
            type="radio"
            checked={mode === "numeros"}
            onChange={() => onModeChange("numeros")}
            className="accent-primary"
          />
          Números
        </label>
        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <input
            type="radio"
            checked={mode === "fixos"}
            onChange={() => onModeChange("fixos")}
            className="accent-orange"
          />
          Números Fixos
        </label>
      </div>

      <p className="text-[10px] text-muted-foreground mb-3">
        {mode === "numeros"
          ? "Selecione números para distribuição probabilística inteligente."
          : "Selecione números fixos obrigatórios em todos os jogos."}
      </p>

      <div className="grid grid-cols-9 gap-1.5 mb-3">
        {numbers.map((n) => (
          <NumberSphere
            key={n}
            number={n}
            selected={mode === "numeros" && selectedNumbers.includes(n)}
            fixed={mode === "fixos" && fixedNumbers.includes(n)}
            onClick={() => onToggleNumber(n)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
        <span>Selecionados: <strong className="text-gold">{activeList.length}</strong></span>
        {activeList.length > 0 && (
          <button onClick={onClear} className="text-destructive hover:text-destructive/80">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

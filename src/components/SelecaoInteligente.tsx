import { useState } from "react";
import { X } from "lucide-react";

const allNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

type ModeType = "numeros" | "fixos";

interface SelecaoInteligenteProps {
  selectedNumbers: number[];
  fixedNumbers: number[];
  onToggleSelected: (n: number) => void;
  onToggleFixed: (n: number) => void;
  onModeChange?: (mode: ModeType) => void;
  onClearSelected?: () => void;
  onClearFixed?: () => void;
}

const SelecaoInteligente = ({
  selectedNumbers,
  fixedNumbers,
  onToggleSelected,
  onToggleFixed,
  onModeChange,
  onClearSelected,
  onClearFixed,
}: SelecaoInteligenteProps) => {
  const [mode, setMode] = useState<ModeType>("numeros");

  const handleModeChange = (newMode: ModeType) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const handleNumberClick = (num: number) => {
    if (mode === "numeros") {
      onToggleSelected(num);
    } else {
      onToggleFixed(num);
    }
  };

  const getBallClass = (num: number) => {
    if (mode === "numeros" && selectedNumbers.includes(num)) return "number-ball number-ball-selected";
    if (mode === "fixos" && fixedNumbers.includes(num)) return "number-ball number-ball-selected";
    return "number-ball number-ball-default";
  };

  const modes: { key: ModeType; label: string }[] = [
    { key: "numeros", label: "Números" },
    { key: "fixos", label: "Números Fixos" },
  ];

  const currentCount = mode === "numeros" ? selectedNumbers.length : fixedNumbers.length;
  const currentLabel = mode === "numeros" ? "Selecionados" : "Fixos";
  const onClear = mode === "numeros" ? onClearSelected : onClearFixed;

  return (
    <div className="bg-card rounded-lg p-4 card-orange h-full">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Fechamento Inteligente</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {modes.map((m) => (
          <label
            key={m.key}
            className="flex items-center gap-1.5 text-sm cursor-pointer"
            onClick={() => handleModeChange(m.key)}
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                mode === m.key ? "border-primary bg-primary" : "border-muted-foreground"
              }`}
            >
              {mode === m.key && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
            </span>
            <span className="text-muted-foreground">{m.label}</span>
          </label>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-2 italic">
        {mode === "numeros"
          ? "Selecione números para distribuição probabilística inteligente."
          : "Selecione números fixos que aparecerão em todos os jogos gerados."}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {allNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={getBallClass(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>{currentLabel}: <span className="text-primary font-bold">{currentCount}</span></span>
        {currentCount > 0 && (
          <button
            onClick={() => onClear?.()}
            className="w-5 h-5 rounded-full bg-destructive/80 hover:bg-destructive text-destructive-foreground flex items-center justify-center transition-colors"
            title={`Limpar ${currentLabel.toLowerCase()}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SelecaoInteligente;

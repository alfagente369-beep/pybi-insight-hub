import { useState } from "react";

const allNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

type ModeType = "numeros" | "fixos";

interface SelecaoInteligenteProps {
  selectedNumbers: number[];
  fixedNumbers: number[];
  onToggleSelected: (n: number) => void;
  onToggleFixed: (n: number) => void;
}

const SelecaoInteligente = ({
  selectedNumbers,
  fixedNumbers,
  onToggleSelected,
  onToggleFixed,
}: SelecaoInteligenteProps) => {
  const [mode, setMode] = useState<ModeType>("numeros");

  const handleNumberClick = (num: number) => {
    if (mode === "numeros") {
      onToggleSelected(num);
    } else {
      onToggleFixed(num);
    }
  };

  const getBallClass = (num: number) => {
    const isSelected = mode === "numeros" && selectedNumbers.includes(num);
    const isFixed = mode === "fixos" && fixedNumbers.includes(num);
    if (isSelected || isFixed) return "number-ball number-ball-selected";
    return "number-ball number-ball-default";
  };

  const modes: { key: ModeType; label: string }[] = [
    { key: "numeros", label: "Números" },
    { key: "fixos", label: "Números Fixos" },
  ];

  return (
    <div className="bg-card rounded-lg p-4 card-orange h-full">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Fechamento Inteligente</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {modes.map((m) => (
          <label key={m.key} className="flex items-center gap-1.5 cursor-pointer text-sm" onClick={() => setMode(m.key)}>
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
          ? "Selecione números para aumentar as probabilidades."
          : "Selecione números fixos para todos os jogos gerados."}
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

      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        {mode === "numeros" && <span>Selecionados: <span className="text-primary font-bold">{selectedNumbers.length}</span></span>}
        {mode === "fixos" && <span>Fixos: <span className="text-primary font-bold">{fixedNumbers.length}</span></span>}
      </div>
    </div>
  );
};

export default SelecaoInteligente;

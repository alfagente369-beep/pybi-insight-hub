import { useState } from "react";

const allNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

type ModeType = "numeros" | "fixos";
type OverlayType = "quentes" | "frios" | null;

// Números quentes: saíram muitas vezes nos últimos 33 resultados
const hotNumbers = [1, 3, 4, 7, 8, 10, 13, 16, 20, 25];
// Números frios: saíram em até 6 jogos dos últimos 33
const coldNumbers = [2, 5, 9, 12, 14, 17, 19, 22, 23, 24];
// Números que não saíram nenhuma vez nos últimos 33
const neverNumbers = [6, 11, 15];

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
  const [overlay, setOverlay] = useState<OverlayType>(null);

  const handleModeChange = (newMode: ModeType) => {
    setMode(newMode);
  };

  const handleOverlayChange = (newOverlay: OverlayType) => {
    if (overlay === newOverlay) {
      setOverlay(null);
    } else {
      setOverlay(newOverlay);
    }
  };

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

    if (overlay === "quentes" && hotNumbers.includes(num)) return "number-ball number-ball-hot";
    if (overlay === "frios") {
      if (neverNumbers.includes(num)) return "number-ball number-ball-never";
      if (coldNumbers.includes(num)) return "number-ball number-ball-cold";
    }

    return "number-ball number-ball-default";
  };

  const modes: { key: ModeType; label: string }[] = [
    { key: "numeros", label: "Números" },
    { key: "fixos", label: "Números Fixos" },
  ];

  const overlays: { key: OverlayType; label: string }[] = [
    { key: "quentes", label: "Números Quentes" },
    { key: "frios", label: "Números Frios" },
  ];

  return (
    <div className="bg-card rounded-lg p-4 card-orange">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Seleção Inteligente</h3>

      {/* Mode selection */}
      <div className="flex flex-wrap gap-2 mb-2">
        {modes.map((m) => (
          <label key={m.key} className="flex items-center gap-1.5 cursor-pointer text-sm" onClick={() => handleModeChange(m.key)}>
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

      {/* Overlay toggles */}
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

      {/* Info text */}
      <p className="text-xs text-muted-foreground mb-2 italic">
        {mode === "numeros"
          ? "Selecione números para aumentar as probabilidades."
          : "Selecione números fixos para todos os jogos gerados."}
        {overlay === "quentes" && " | 🔴 Quentes: mais sorteados nos últimos 33 concursos."}
        {overlay === "frios" && " | 🔵 Frios: até 6x em 33 concursos. 🟣 Nunca saíram."}
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

      {/* Counters */}
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        {mode === "numeros" && <span>Selecionados: <span className="text-primary font-bold">{selectedNumbers.length}</span></span>}
        {mode === "fixos" && <span>Fixos: <span className="text-primary font-bold">{fixedNumbers.length}</span></span>}
      </div>
    </div>
  );
};

export default SelecaoInteligente;

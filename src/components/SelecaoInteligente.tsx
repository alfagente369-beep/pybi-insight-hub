import { useState } from "react";

const allNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

type FilterType = "todos" | "fixos" | "fixosCores" | "quentes" | "frios";

const hotNumbers = [1, 3, 4, 7, 8, 10, 13, 16, 20, 25];
const coldNumbers = [2, 5, 9, 12, 14, 17, 19, 22, 23, 24];

const SelecaoInteligente = ({
  selected,
  onToggle,
}: {
  selected: number[];
  onToggle: (n: number) => void;
}) => {
  const [filter, setFilter] = useState<FilterType>("todos");

  const filters: { key: FilterType; label: string }[] = [
    { key: "todos", label: "Números" },
    { key: "fixos", label: "Números Fixos" },
    { key: "fixosCores", label: "Fixos Cores" },
    { key: "quentes", label: "Números Quentes" },
    { key: "frios", label: "Números Frios" },
  ];

  const getBallClass = (num: number) => {
    if (selected.includes(num)) return "number-ball number-ball-selected";
    if (filter === "quentes" && hotNumbers.includes(num)) return "number-ball number-ball-hot";
    if (filter === "frios" && coldNumbers.includes(num)) return "number-ball number-ball-cold";
    return "number-ball number-ball-default";
  };

  return (
    <div className="bg-card rounded-lg p-4 card-orange">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Seleção Inteligente</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {filters.map((f) => (
          <label key={f.key} className="flex items-center gap-1.5 cursor-pointer text-sm">
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                filter === f.key
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }`}
            >
              {filter === f.key && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
            </span>
            <span className="text-muted-foreground">{f.label}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onToggle(num)}
            className={getBallClass(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelecaoInteligente;

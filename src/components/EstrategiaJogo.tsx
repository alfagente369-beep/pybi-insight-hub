import { useState } from "react";
import { downloadCSV, type JogoGerado } from "@/lib/lotofacil";

interface EstrategiaJogoProps {
  onGerarJogos: (quantidade: number, balancear: boolean) => void;
  jogosGerados: JogoGerado[];
}

const EstrategiaJogo = ({ onGerarJogos, jogosGerados }: EstrategiaJogoProps) => {
  const [quantidade, setQuantidade] = useState(5);
  const [balancear, setBalancear] = useState(true);

  return (
    <div className="bg-card rounded-lg p-4 card-cyan">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Estratégia de Jogo</h3>

      <p className="text-sm text-muted-foreground mb-2">Quantidade de Jogos: <span className="text-foreground font-bold">{quantidade}</span></p>

      <input
        type="range"
        min={1}
        max={50}
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary mb-4"
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Balancear Ímpares/Pares</p>
        <button
          onClick={() => setBalancear(!balancear)}
          className={`w-12 h-6 rounded-full relative transition-colors ${
            balancear ? "bg-secondary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
              balancear ? "left-6" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <button className="glow-button" onClick={() => onGerarJogos(quantidade, balancear)}>
          GERAR JOGOS
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => jogosGerados.length > 0 && downloadCSV(jogosGerados)}
          disabled={jogosGerados.length === 0}
          className="flex-1 bg-muted hover:bg-border text-foreground text-sm py-2 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          BAIXAR CSV
        </button>
        <button className="flex-1 bg-muted hover:bg-border text-foreground text-sm py-2 rounded font-medium transition-colors">
          SALVAR MODELO
        </button>
      </div>
    </div>
  );
};

export default EstrategiaJogo;

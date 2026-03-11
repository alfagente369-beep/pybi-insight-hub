import { useState } from "react";
import { type JogoGerado } from "@/lib/lotofacil";

interface EstrategiaJogoProps {
  onGerarJogos: (quantidade: number, balancear: boolean, fonte: "selecao" | "palpite", tamanho: number) => void;
  jogosGerados: JogoGerado[];
}

const TAMANHOS = [15, 16, 17] as const;

const EstrategiaJogo = ({ onGerarJogos, jogosGerados }: EstrategiaJogoProps) => {
  const [quantidade, setQuantidade] = useState(5);
  const [balancear, setBalancear] = useState(true);
  const [tamanho, setTamanho] = useState<number>(15);

  return (
    <div className="bg-card rounded-lg p-4 card-cyan">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Estratégia de Jogo</h3>

      {/* Quantidade de números */}
      <div className="mb-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-1">
          Números por Jogo
        </label>
        <div className="flex gap-2">
          {TAMANHOS.map((t) => (
            <button
              key={t}
              onClick={() => setTamanho(t)}
              className={`flex-1 py-1.5 rounded text-sm font-bold transition-colors ${
                tamanho === t
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

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
        <button className="glow-button" onClick={() => onGerarJogos(quantidade, balancear, "selecao", tamanho)}>
          GERAR JOGOS
        </button>
      </div>

    </div>
  );
};

export default EstrategiaJogo;

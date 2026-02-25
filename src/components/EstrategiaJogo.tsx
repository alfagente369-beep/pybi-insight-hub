import { useState } from "react";

interface EstrategiaJogoProps {
  onGerarJogos: (quantidade: number, balancear: boolean) => void;
}

const EstrategiaJogo = ({ onGerarJogos }: EstrategiaJogoProps) => {
  const [quantidade, setQuantidade] = useState(1);
  const [balancear, setBalancear] = useState(true);

  return (
    <div className="bg-card rounded-lg p-4 card-cyan">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Estratégia de Jogo</h3>

      <p className="text-sm text-muted-foreground mb-2">Quantidade de Jogos</p>

      <div className="flex items-center gap-2 mb-4">
        <span className="flex-1 h-9 bg-muted border border-border rounded px-3 text-sm text-foreground flex items-center font-bold">
          {quantidade}
        </span>
        <button
          onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
          className="w-8 h-8 rounded bg-muted border border-border text-foreground flex items-center justify-center hover:bg-border transition-colors"
        >
          −
        </button>
        <button
          onClick={() => setQuantidade(quantidade + 1)}
          className="w-8 h-8 rounded bg-muted border border-border text-foreground flex items-center justify-center hover:bg-border transition-colors"
        >
          +
        </button>
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

      <p className="text-sm text-muted-foreground mb-4">Balancear Ímpares/Pares</p>

      <div className="flex justify-center mb-4">
        <button className="glow-button" onClick={() => onGerarJogos(quantidade, balancear)}>
          GERAR JOGOS
        </button>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-muted hover:bg-border text-foreground text-sm py-2 rounded font-medium transition-colors">
          BAIXAR EXCEL
        </button>
        <button className="flex-1 bg-muted hover:bg-border text-foreground text-sm py-2 rounded font-medium transition-colors">
          SALVAR MODELO
        </button>
      </div>
    </div>
  );
};

export default EstrategiaJogo;

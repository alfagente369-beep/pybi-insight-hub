interface EstrategiaJogoProps {
  tamanho: 15 | 16 | 17;
  onTamanhoChange: (t: 15 | 16 | 17) => void;
  quantidade: number;
  onQuantidadeChange: (q: number) => void;
  balancear: boolean;
  onBalancearChange: (b: boolean) => void;
  onGerar: () => void;
}

export function EstrategiaJogo({
  tamanho,
  onTamanhoChange,
  quantidade,
  onQuantidadeChange,
  balancear,
  onBalancearChange,
  onGerar,
}: EstrategiaJogoProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
      <h3 className="font-heading text-sm font-bold text-foreground mb-3">Estratégia de Jogo</h3>

      <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Números por Jogo</label>
      <div className="flex bg-secondary rounded-lg overflow-hidden mb-4">
        {([15, 16, 17] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTamanhoChange(t)}
            className={`flex-1 py-2 text-sm font-heading font-bold transition-colors ${
              tamanho === t ? "bg-cyan text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Quantidade de Jogos:</span>
          <strong className="text-foreground">{quantidade}</strong>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={quantidade}
          onChange={(e) => onQuantidadeChange(Number(e.target.value))}
          className="w-full accent-cyan"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">Balancear Ímpares/Pares</span>
        <button
          onClick={() => onBalancearChange(!balancear)}
          className={`w-11 h-6 rounded-full transition-colors relative ${balancear ? "bg-cyan" : "bg-secondary"}`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
              balancear ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <button onClick={onGerar} className="glow-button w-full text-center mt-auto">
        GERAR JOGOS
      </button>
    </div>
  );
}

import { NumberSphere } from "./NumberSphere";

interface PalpiteFechamentoProps {
  fonte: string;
  onFonteChange: (f: string) => void;
  hotNumbers: { number: number; count: number }[];
  coldNumbers: { number: number; count: number }[];
}

export function PalpiteFechamento({ fonte, onFonteChange, hotNumbers, coldNumbers }: PalpiteFechamentoProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
      <h3 className="font-heading text-xs font-bold text-foreground text-center mb-3 uppercase tracking-wider">
        Palpite de Fechamento
      </h3>

      <div className="mb-3">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Fonte dos Dados</label>
        <select
          value={fonte}
          onChange={(e) => onFonteChange(e.target.value)}
          className="w-full bg-secondary border border-border text-foreground text-xs rounded-md px-2 py-1.5"
        >
          <option value="3">3 últimos jogos</option>
          <option value="5">5 últimos jogos</option>
          <option value="10">10 últimos jogos</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">Mais Sorteados</label>
        <div className="flex flex-wrap gap-1.5">
          {hotNumbers.slice(0, 6).map((h) => (
            <NumberSphere key={h.number} number={h.number} hot subtitle={`${h.count}x`} />
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">Menos Sorteados</label>
        <div className="flex flex-wrap gap-1.5">
          {coldNumbers.slice(0, 4).map((c) => (
            <NumberSphere key={c.number} number={c.number} cold subtitle={`${c.count}x`} />
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-3">
        <button className="flex-1 bg-secondary hover:bg-muted text-foreground font-heading text-[10px] font-bold uppercase tracking-wider py-2 rounded-md transition-colors">
          Baixar CSV
        </button>
        <button className="flex-1 bg-secondary hover:bg-muted text-foreground font-heading text-[10px] font-bold uppercase tracking-wider py-2 rounded-md transition-colors">
          Salvar Modelo
        </button>
      </div>
    </div>
  );
}

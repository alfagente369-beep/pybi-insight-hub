import { useState } from "react";

const PalpiteSection = () => {
  const [palpites, setPalpites] = useState<string[]>(["", "", "", "", ""]);
  const [qtdImpar, setQtdImpar] = useState("");
  const [qtdPar, setQtdPar] = useState("");

  return (
    <div className="bg-card rounded-lg p-4 card-red">
      <h3 className="font-heading text-sm font-bold mb-3 text-foreground text-center uppercase tracking-wider">
        Palpite
      </h3>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {palpites.map((p, i) => (
          <input
            key={i}
            type="text"
            value={p}
            onChange={(e) => {
              const next = [...palpites];
              next[i] = e.target.value;
              setPalpites(next);
            }}
            className="w-full h-12 bg-muted border border-border rounded text-center text-foreground font-bold focus:ring-2 focus:ring-primary outline-none"
            maxLength={2}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-1 text-center">
            Quantidade de Ímpar
          </label>
          <input
            type="text"
            value={qtdImpar}
            onChange={(e) => setQtdImpar(e.target.value)}
            className="w-full h-10 bg-muted border border-border rounded text-center text-foreground font-bold focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-heading block mb-1 text-center">
            Quantidade de Par
          </label>
          <input
            type="text"
            value={qtdPar}
            onChange={(e) => setQtdPar(e.target.value)}
            className="w-full h-10 bg-muted border border-border rounded text-center text-foreground font-bold focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PalpiteSection;

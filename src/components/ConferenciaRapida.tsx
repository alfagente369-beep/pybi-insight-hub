import { useState } from "react";

const ConferenciaRapida = () => {
  const [pontos] = useState(11);
  const [acertos, setAcertos] = useState("");

  return (
    <div className="bg-card rounded-lg p-4 card-purple">
      <h3 className="font-heading text-lg font-bold mb-3 text-foreground">Conferência Rápida</h3>

      <p className="text-sm text-muted-foreground mb-2">Seu Jogo Sorteado</p>

      <div className="bg-muted rounded-lg p-4 mb-3 flex items-baseline gap-2 justify-center">
        <span className="text-5xl font-heading font-black text-primary">{pontos}</span>
        <span className="text-lg font-heading font-bold text-foreground">PONTOS</span>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <span className="text-sm text-muted-foreground font-heading uppercase">Você Acertou:</span>
        <input
          type="text"
          value={acertos}
          onChange={(e) => setAcertos(e.target.value)}
          className="w-14 h-10 bg-muted border border-border rounded text-center text-foreground font-bold focus:ring-2 focus:ring-accent outline-none"
        />
      </div>
    </div>
  );
};

export default ConferenciaRapida;

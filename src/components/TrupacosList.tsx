const jogos = [
  { jogo: 1, dezena: "02", nums: "1 29 860 11 136 5,8 28 25" },
  { jogo: 4, dezena: "02", nums: "2 55 650 11 124 5,6,28 25" },
  { jogo: 5, dezena: "01", nums: "1 77 750 11 198 5,6,28 25" },
  { jogo: 6, dezena: "03", nums: "2 56 460 11 134 5,6,28 25" },
  { jogo: 9, dezena: "45", nums: "3 79 660 11 138 5,6 28 25" },
  { jogo: 7, dezena: "15", nums: "3 79 860 15 024 5,6,28 25" },
];

const TrupacosList = () => {
  return (
    <div className="bg-card rounded-lg p-4 card-gold border-muted">
      <h3 className="font-heading text-lg font-bold mb-2 text-foreground">Gerador</h3>
      <p className="text-sm text-muted-foreground mb-3">Jogo 1:</p>

      <div className="space-y-2">
        {jogos.map((j, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground w-4">{j.jogo}</span>
            <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold text-xs min-w-[32px] text-center">
              {j.dezena}
            </span>
            <span className="text-muted-foreground font-mono text-xs">{j.nums}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrupacosList;

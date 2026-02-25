const ultimosResultados = [
  { concurso: "Último", numeros: [1, 3, 9, 10, 18, 21, 23, 24, 25] },
];

const historico = [
  "01 03,5,5,6,7,8,9,10,17 21,22,24,15",
  "1,2,3,4,5,6,7,8,9,10,21,22,13,25",
];

const UltimosResultados = () => {
  return (
    <div className="bg-card rounded-lg p-4 card-yellow">
      <h3 className="font-heading text-sm font-bold mb-3 text-foreground">
        <span className="text-primary">Últimos</span>{" "}
        <span className="text-muted-foreground text-xs">
          01 03,09,89,10,18,21,23,24,25
        </span>
      </h3>

      <div className="space-y-2">
        {historico.map((line, i) => (
          <div
            key={i}
            className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground font-mono"
          >
            {line}
          </div>
        ))}
      </div>

      <button className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
        <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
        Sincronizar Dados
      </button>
    </div>
  );
};

export default UltimosResultados;

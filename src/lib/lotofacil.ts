export interface JogoGerado {
  id: number;
  numeros: number[];
}

export function gerarJogosLotofacil(
  quantidade: number,
  fixos: number[],
  balancear: boolean
): JogoGerado[] {
  const jogos: JogoGerado[] = [];

  for (let i = 0; i < quantidade; i++) {
    let numeros = [...fixos];
    const disponiveis = Array.from({ length: 25 }, (_, k) => k + 1).filter(
      (n) => !fixos.includes(n)
    );

    // Shuffle available numbers
    for (let j = disponiveis.length - 1; j > 0; j--) {
      const rand = Math.floor(Math.random() * (j + 1));
      [disponiveis[j], disponiveis[rand]] = [disponiveis[rand], disponiveis[j]];
    }

    const needed = 15 - numeros.length;

    if (balancear) {
      // Try to balance odd/even (7 odd + 8 even or 8 odd + 7 even)
      const oddFixed = numeros.filter((n) => n % 2 !== 0).length;
      const evenFixed = numeros.filter((n) => n % 2 === 0).length;
      const targetOdd = Math.random() > 0.5 ? 7 : 8;
      const targetEven = 15 - targetOdd;
      const needOdd = Math.max(0, targetOdd - oddFixed);
      const needEven = Math.max(0, targetEven - evenFixed);

      const oddPool = disponiveis.filter((n) => n % 2 !== 0);
      const evenPool = disponiveis.filter((n) => n % 2 === 0);

      const selectedOdd = oddPool.slice(0, Math.min(needOdd, oddPool.length));
      const selectedEven = evenPool.slice(0, Math.min(needEven, evenPool.length));
      numeros = [...numeros, ...selectedOdd, ...selectedEven];

      // Fill remaining if needed
      if (numeros.length < 15) {
        const remaining = disponiveis.filter((n) => !numeros.includes(n));
        numeros = [...numeros, ...remaining.slice(0, 15 - numeros.length)];
      }
    } else {
      numeros = [...numeros, ...disponiveis.slice(0, needed)];
    }

    numeros = numeros.slice(0, 15).sort((a, b) => a - b);
    jogos.push({ id: i + 1, numeros });
  }

  return jogos;
}

export function calcularEstatisticas(numeros: number[]) {
  const pares = numeros.filter((n) => n % 2 === 0).length;
  const impares = numeros.filter((n) => n % 2 !== 0).length;
  const soma = numeros.reduce((a, b) => a + b, 0);
  return { pares, impares, soma };
}

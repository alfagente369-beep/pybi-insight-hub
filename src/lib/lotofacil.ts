export interface JogoGerado {
  id: number;
  numeros: number[];
}

export interface ResultadoLotofacil {
  concurso: number;
  data: string;
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

    for (let j = disponiveis.length - 1; j > 0; j--) {
      const rand = Math.floor(Math.random() * (j + 1));
      [disponiveis[j], disponiveis[rand]] = [disponiveis[rand], disponiveis[j]];
    }

    if (balancear) {
      const oddFixed = numeros.filter((n) => n % 2 !== 0).length;
      const targetOdd = Math.random() > 0.5 ? 7 : 8;
      const targetEven = 15 - targetOdd;
      const needOdd = Math.max(0, targetOdd - oddFixed);
      const needEven = Math.max(0, targetEven - (numeros.length - oddFixed));

      const oddPool = disponiveis.filter((n) => n % 2 !== 0);
      const evenPool = disponiveis.filter((n) => n % 2 === 0);

      numeros = [...numeros, ...oddPool.slice(0, needOdd), ...evenPool.slice(0, needEven)];

      if (numeros.length < 15) {
        const remaining = disponiveis.filter((n) => !numeros.includes(n));
        numeros = [...numeros, ...remaining.slice(0, 15 - numeros.length)];
      }
    } else {
      numeros = [...numeros, ...disponiveis.slice(0, 15 - numeros.length)];
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

export function jogosParaCSV(jogos: JogoGerado[]): string {
  const header = Array.from({ length: 15 }, (_, i) => `N${i + 1}`).join(",");
  const rows = jogos.map((j) =>
    j.numeros.map((n) => String(n).padStart(2, "0")).join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCSV(jogos: JogoGerado[]) {
  const csv = jogosParaCSV(jogos);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lotofacil_jogos_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function buscarUltimosResultados(): Promise<ResultadoLotofacil[]> {
  try {
    const res = await fetch(
      "https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest"
    );
    if (!res.ok) throw new Error("API indisponível");
    const data = await res.json();
    
    const resultado: ResultadoLotofacil = {
      concurso: data.concurso,
      data: data.data,
      numeros: (data.dezenas as string[]).map(Number).sort((a, b) => a - b),
    };
    return [resultado];
  } catch {
    // Fallback: dados simulados
    return [
      { concurso: 3200, data: "2025-02-24", numeros: [1, 3, 5, 6, 7, 8, 9, 10, 13, 17, 18, 21, 22, 24, 25] },
      { concurso: 3199, data: "2025-02-22", numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 21, 22, 24, 25] },
    ];
  }
}

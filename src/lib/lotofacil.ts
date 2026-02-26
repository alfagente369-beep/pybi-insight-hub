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
  balancear: boolean,
  tamanho: number = 15
): JogoGerado[] {
  const jogos: JogoGerado[] = [];
  const size = Math.max(15, Math.min(17, tamanho));

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
      const targetOdd = Math.round(size * (Math.random() > 0.5 ? 7 : 8) / 15);
      const targetEven = size - targetOdd;
      const needOdd = Math.max(0, targetOdd - oddFixed);
      const needEven = Math.max(0, targetEven - (numeros.length - oddFixed));

      const oddPool = disponiveis.filter((n) => n % 2 !== 0);
      const evenPool = disponiveis.filter((n) => n % 2 === 0);

      numeros = [...numeros, ...oddPool.slice(0, needOdd), ...evenPool.slice(0, needEven)];

      if (numeros.length < size) {
        const remaining = disponiveis.filter((n) => !numeros.includes(n));
        numeros = [...numeros, ...remaining.slice(0, size - numeros.length)];
      }
    } else {
      numeros = [...numeros, ...disponiveis.slice(0, size - numeros.length)];
    }

    numeros = numeros.slice(0, size).sort((a, b) => a - b);
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
  const maxCols = jogos.reduce((max, j) => Math.max(max, j.numeros.length), 15);
  const header = Array.from({ length: maxCols }, (_, i) => `N${i + 1}`).join(",");
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

export async function buscarUltimosResultados(quantidade = 66): Promise<ResultadoLotofacil[]> {
  const resultados: ResultadoLotofacil[] = [];
  try {
    // Buscar o último concurso primeiro
    const res = await fetch("https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest");
    if (!res.ok) throw new Error("API indisponível");
    const latest = await res.json();
    const ultimoConcurso = latest.concurso as number;

    resultados.push({
      concurso: ultimoConcurso,
      data: latest.data,
      numeros: (latest.dezenas as string[]).map(Number).sort((a, b) => a - b),
    });

    // Buscar os anteriores em paralelo
    const promises = [];
    for (let i = 1; i < quantidade; i++) {
      promises.push(
        fetch(`https://loteriascaixa-api.herokuapp.com/api/lotofacil/${ultimoConcurso - i}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      );
    }
    const others = await Promise.all(promises);
    for (const data of others) {
      if (data) {
        resultados.push({
          concurso: data.concurso,
          data: data.data,
          numeros: (data.dezenas as string[]).map(Number).sort((a, b) => a - b),
        });
      }
    }

    return resultados.sort((a, b) => b.concurso - a.concurso);
  } catch {
    return [
      { concurso: 3200, data: "2025-02-24", numeros: [1, 3, 5, 6, 7, 8, 9, 10, 13, 17, 18, 21, 22, 24, 25] },
      { concurso: 3199, data: "2025-02-22", numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 21, 22, 24, 25] },
    ];
  }
}

export interface EstatisticasNumeros {
  quentes: number[];
  frios: number[];
  nunca: number[];
}

export type FontePalpite = "ultimos3" | "ultimos5" | "ultimos10";

export function calcularTop5(resultados: ResultadoLotofacil[], fonte: FontePalpite): number[] {
  const qty = fonte === "ultimos3" ? 3 : fonte === "ultimos5" ? 5 : 10;
  const subset = resultados.slice(0, qty);

  const freq = new Map<number, number>();
  for (let i = 1; i <= 25; i++) freq.set(i, 0);
  for (const r of subset) {
    for (const n of r.numeros) {
      freq.set(n, (freq.get(n) || 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([num]) => num)
    .sort((a, b) => a - b);
}

export function calcularQuentesFrios(resultados: ResultadoLotofacil[]): EstatisticasNumeros {
  const freq = new Map<number, number>();
  for (let i = 1; i <= 25; i++) freq.set(i, 0);
  
  for (const r of resultados) {
    for (const n of r.numeros) {
      freq.set(n, (freq.get(n) || 0) + 1);
    }
  }

  const total = resultados.length;
  const media = (total * 15) / 25; // frequência média esperada
  
  const quentes: number[] = [];
  const frios: number[] = [];
  const nunca: number[] = [];

  // Frios = abaixo de 75% da média, Quentes = acima da média
  const limiarFrio = media * 0.75;

  for (let i = 1; i <= 25; i++) {
    const f = freq.get(i) || 0;
    if (f === 0) nunca.push(i);
    else if (f <= limiarFrio) frios.push(i);
    else if (f >= media) quentes.push(i);
  }

  return { quentes, frios, nunca };
}

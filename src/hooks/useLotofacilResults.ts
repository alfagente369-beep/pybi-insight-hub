import { useState, useEffect, useCallback } from "react";

interface ResultadoLotofacil {
  concurso: string;
  data: string;
  numeros: number[];
}

const LOTOFACIL_API = "https://loteriascaixa-api.herokuapp.com/api/lotofacil";

export function useLotofacilResults(quantidade: number = 10) {
  const [resultados, setResultados] = useState<ResultadoLotofacil[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch latest result first
      const latestRes = await fetch(`${LOTOFACIL_API}/latest`);
      if (!latestRes.ok) throw new Error("Erro ao buscar resultados");
      const latest = await latestRes.json();

      const latestConcurso = parseInt(latest.concurso || latest.numero);
      const results: ResultadoLotofacil[] = [];

      // Add latest
      results.push({
        concurso: String(latestConcurso),
        data: latest.data || latest.dataApuracao || new Date().toLocaleDateString("pt-BR"),
        numeros: (latest.dezenas || latest.listaDezenas || []).map((d: string) => parseInt(d)).sort((a: number, b: number) => a - b),
      });

      // Fetch previous results
      const promises = [];
      for (let i = 1; i < quantidade; i++) {
        const num = latestConcurso - i;
        promises.push(
          fetch(`${LOTOFACIL_API}/${num}`)
            .then((r) => r.json())
            .then((d) => ({
              concurso: String(num),
              data: d.data || d.dataApuracao || "",
              numeros: (d.dezenas || d.listaDezenas || []).map((n: string) => parseInt(n)).sort((a: number, b: number) => a - b),
            }))
            .catch(() => null)
        );
      }

      const others = await Promise.all(promises);
      others.forEach((r) => r && results.push(r));
      results.sort((a, b) => parseInt(b.concurso) - parseInt(a.concurso));

      setResultados(results);
    } catch (err: any) {
      setError(err.message);
      console.error("Erro API Lotofácil:", err);
    } finally {
      setLoading(false);
    }
  }, [quantidade]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return { resultados, loading, error, refetch: fetchResults };
}

export function calcularEstatisticas(resultados: ResultadoLotofacil[], quantidade: number) {
  const subset = resultados.slice(0, quantidade);
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 25; i++) freq[i] = 0;
  subset.forEach((r) => r.numeros.forEach((n) => freq[n]++));

  const sorted = Object.entries(freq)
    .map(([num, count]) => ({ number: parseInt(num), count }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sorted.slice(0, 5);
  const coldNumbers = [...sorted].sort((a, b) => a.count - b.count).slice(0, 5);

  return { hotNumbers, coldNumbers };
}

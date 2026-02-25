import { useState, useEffect, useCallback } from "react";
import SelecaoInteligente from "@/components/SelecaoInteligente";
import PalpiteSection from "@/components/PalpiteSection";
import UltimosResultados from "@/components/UltimosResultados";
import TrupacosList from "@/components/TrupacosList";
import EstrategiaJogo from "@/components/EstrategiaJogo";
import ConferenciaRapida from "@/components/ConferenciaRapida";
import {
  gerarJogosLotofacil,
  buscarUltimosResultados,
  calcularQuentesFrios,
  type JogoGerado,
  type ResultadoLotofacil,
  type EstatisticasNumeros,
} from "@/lib/lotofacil";

const Index = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [jogosGerados, setJogosGerados] = useState<JogoGerado[]>([]);
  const [resultados, setResultados] = useState<ResultadoLotofacil[]>([]);
  const [loadingResultados, setLoadingResultados] = useState(false);
  const [estatisticas, setEstatisticas] = useState<EstatisticasNumeros>({ quentes: [], frios: [], nunca: [] });
  const [palpiteNumbers, setPalpiteNumbers] = useState<number[]>([]);
  const [palpiteImpar, setPalpiteImpar] = useState(0);
  const [palpitePar, setPalpitePar] = useState(0);

  const sincronizar = useCallback(async () => {
    setLoadingResultados(true);
    const data = await buscarUltimosResultados(66);
    setResultados(data);
    setEstatisticas(calcularQuentesFrios(data.slice(0, 33)));
    setLoadingResultados(false);
  }, []);

  useEffect(() => {
    sincronizar();
  }, [sincronizar]);

  const toggleSelected = (num: number) => {
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const toggleFixed = (num: number) => {
    setFixedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handlePalpiteChange = useCallback((palpites: number[], qtdImpar: number, qtdPar: number) => {
    setPalpiteNumbers(palpites);
    setPalpiteImpar(qtdImpar);
    setPalpitePar(qtdPar);
  }, []);

  const handleGerarJogos = (quantidade: number, balancear: boolean) => {
    const jogos: JogoGerado[] = [];

    // Se houver números selecionados (modo "Números"), eles formam o primeiro jogo
    if (selectedNumbers.length >= 15) {
      const primeiroJogo = selectedNumbers.slice(0, 15).sort((a, b) => a - b);
      jogos.push({ id: 1, numeros: primeiroJogo });
    }

    // Gerar jogos com palpites como fixos (merged com fixedNumbers manuais)
    const fixosParaGerar = [...new Set([...palpiteNumbers, ...fixedNumbers])];

    const restantes = gerarJogosLotofacil(
      Math.max(1, quantidade - jogos.length),
      fixosParaGerar,
      balancear
    );

    restantes.forEach((j, i) => {
      jogos.push({ id: jogos.length + i + 1, numeros: j.numeros });
    });

    setJogosGerados(jogos);
  };

  const ultimoResultado = resultados.length > 0 ? resultados[0].numeros : [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="text-center mb-6">
        <div className="inline-block bg-card border border-border rounded-xl px-8 py-3">
          <h1 className="font-heading text-2xl md:text-3xl font-black text-primary tracking-wider">
            LOTOFACIL PRO
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerador Inteligente de Fechamentos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <SelecaoInteligente selectedNumbers={selectedNumbers} fixedNumbers={fixedNumbers} onToggleSelected={toggleSelected} onToggleFixed={toggleFixed} estatisticas={estatisticas} />
        </div>
        <div className="lg:col-span-1">
          <PalpiteSection resultados={resultados} onPalpiteChange={handlePalpiteChange} />
        </div>
        <div className="lg:col-span-1">
          <UltimosResultados
            resultados={resultados}
            loading={loadingResultados}
            onSincronizar={sincronizar}
          />
        </div>
        <div className="lg:col-span-1">
          <TrupacosList jogos={jogosGerados} />
        </div>
        <div className="lg:col-span-1">
          <EstrategiaJogo onGerarJogos={handleGerarJogos} jogosGerados={jogosGerados} />
        </div>
        <div className="lg:col-span-1">
          <ConferenciaRapida jogos={jogosGerados} resultadoSorteado={ultimoResultado} />
        </div>
      </div>
    </div>
  );
};

export default Index;

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

  const handlePalpiteChange = useCallback((palpites: number[]) => {
    setPalpiteNumbers(palpites);
  }, []);

  const handleGerarJogos = (quantidade: number, balancear: boolean, fonte: "selecao" | "palpite" = "selecao", tamanho: number = 15) => {
    const jogos: JogoGerado[] = [];

    // Determinar fixos com base na fonte
    let fixosParaGerar: number[] = [];
    if (fonte === "palpite") {
      fixosParaGerar = [...new Set([...palpiteNumbers, ...fixedNumbers])];
    } else {
      // Fonte = seleção inteligente
      if (selectedNumbers.length >= tamanho) {
        const primeiroJogo = selectedNumbers.slice(0, tamanho).sort((a, b) => a - b);
        jogos.push({ id: 1, numeros: primeiroJogo });
      }
      fixosParaGerar = [...new Set([...fixedNumbers])];
    }

    const restantes = gerarJogosLotofacil(
      Math.max(1, quantidade - jogos.length),
      fixosParaGerar,
      balancear,
      tamanho
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
            FECHAMENTO LOTOFACIL
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerador Inteligente de Fechamentos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Linha superior - 3 cards com altura igual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-1 flex">
            <div className="w-full">
              <SelecaoInteligente selectedNumbers={selectedNumbers} fixedNumbers={fixedNumbers} onToggleSelected={toggleSelected} onToggleFixed={toggleFixed} />
            </div>
          </div>
          <div className="lg:col-span-1 flex">
            <div className="w-full">
              <PalpiteSection resultados={resultados} onPalpiteChange={handlePalpiteChange} />
            </div>
          </div>
          <div className="lg:col-span-1 flex">
            <div className="w-full">
              <UltimosResultados
                resultados={resultados}
                loading={loadingResultados}
                onSincronizar={sincronizar}
              />
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

        {/* Espaço reservado para novas funções */}
        <div className="min-h-[200px]" />
      </div>
    </div>
  );
};

export default Index;

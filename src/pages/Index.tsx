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
  downloadCSV,
  type JogoGerado,
  type ResultadoLotofacil,
  type EstatisticasNumeros,
  type FontePalpite,
} from "@/lib/lotofacil";
import { distribuirNumerosInteligente } from "@/lib/fechamento";

const Index = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [selecaoMode, setSelecaoMode] = useState<"numeros" | "fixos">("numeros");
  const [jogosGerados, setJogosGerados] = useState<JogoGerado[]>([]);
  const [resultados, setResultados] = useState<ResultadoLotofacil[]>([]);
  const [loadingResultados, setLoadingResultados] = useState(false);
  const [estatisticas, setEstatisticas] = useState<EstatisticasNumeros>({ quentes: [], frios: [], nunca: [] });
  const [palpiteNumbers, setPalpiteNumbers] = useState<number[]>([]);
  const [fonte, setFonte] = useState<FontePalpite>("ultimos3");

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
    if (fonte === "selecao" && selecaoMode === "numeros" && selectedNumbers.length > 0) {
      // Distribuição inteligente dos números selecionados
      const jogos = distribuirNumerosInteligente(selectedNumbers, quantidade, tamanho, balancear);
      setJogosGerados(jogos.map((j) => ({ id: j.id, numeros: j.numeros })));
      return;
    }

    const jogos: JogoGerado[] = [];
    let fixosParaGerar: number[] = [];

    if (fonte === "palpite") {
      fixosParaGerar = [...new Set([...palpiteNumbers, ...fixedNumbers])];
    } else {
      fixosParaGerar = [...new Set([...fixedNumbers])];
    }

    const restantes = gerarJogosLotofacil(quantidade, fixosParaGerar, balancear, tamanho);
    restantes.forEach((j, i) => {
      jogos.push({ id: jogos.length + i + 1, numeros: j.numeros });
    });

    setJogosGerados(jogos);
  };

  const handleSelecaoModeChange = (mode: "numeros" | "fixos") => {
    setSelecaoMode(mode);
  };

  const handleClearSelected = () => setSelectedNumbers([]);
  const handleClearFixed = () => setFixedNumbers([]);

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
              <SelecaoInteligente selectedNumbers={selectedNumbers} fixedNumbers={fixedNumbers} onToggleSelected={toggleSelected} onToggleFixed={toggleFixed} onModeChange={handleSelecaoModeChange} onClearSelected={handleClearSelected} onClearFixed={handleClearFixed} />
            </div>
          </div>
          <div className="lg:col-span-1 flex flex-col">
            <div className="w-full flex-1">
              <PalpiteSection resultados={resultados} onPalpiteChange={handlePalpiteChange} fonte={fonte} onFonteChange={setFonte} />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => jogosGerados.length > 0 && downloadCSV(jogosGerados)}
                disabled={jogosGerados.length === 0}
                className="flex-1 bg-muted hover:bg-border text-foreground text-sm py-2 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                BAIXAR CSV
              </button>
              <button className="flex-1 bg-muted hover:bg-border text-foreground text-sm py-2 rounded font-medium transition-colors">
                SALVAR MODELO
              </button>
            </div>
          </div>
          <div className="lg:col-span-1 flex">
            <div className="w-full">
              <UltimosResultados
                resultados={resultados}
                loading={loadingResultados}
                onSincronizar={sincronizar}
                fonte={fonte}
              />
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-1">
            <EstrategiaJogo onGerarJogos={handleGerarJogos} jogosGerados={jogosGerados} />
          </div>
          <div className="lg:col-span-1">
            <TrupacosList jogos={jogosGerados} />
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

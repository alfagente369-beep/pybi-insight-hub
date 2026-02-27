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
import { salvarModelo, listarModelos, excluirModelo, type ModeloEstrategia } from "@/lib/modelos";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [modeloNome, setModeloNome] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modelos, setModelos] = useState<ModeloEstrategia[]>([]);
  const [showModelos, setShowModelos] = useState(false);

  useEffect(() => {
    setModelos(listarModelos());
  }, []);

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

  const handleSalvarModelo = () => {
    if (!modeloNome.trim()) return;
    salvarModelo({
      nome: modeloNome.trim(),
      selectedNumbers,
      fixedNumbers,
      selecaoMode,
      fonte,
    });
    setModelos(listarModelos());
    setModeloNome("");
    setDialogOpen(false);
    toast({ title: "Modelo salvo!", description: `"${modeloNome.trim()}" foi salvo com sucesso.` });
  };

  const handleCarregarModelo = (modelo: ModeloEstrategia) => {
    setSelectedNumbers(modelo.selectedNumbers);
    setFixedNumbers(modelo.fixedNumbers);
    setSelecaoMode(modelo.selecaoMode);
    setFonte(modelo.fonte as FontePalpite);
    setShowModelos(false);
    toast({ title: "Modelo carregado!", description: `"${modelo.nome}" foi aplicado.` });
  };

  const handleExcluirModelo = (id: string) => {
    excluirModelo(id);
    setModelos(listarModelos());
    toast({ title: "Modelo excluído" });
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
              <SelecaoInteligente selectedNumbers={selectedNumbers} fixedNumbers={fixedNumbers} onToggleSelected={toggleSelected} onToggleFixed={toggleFixed} onModeChange={handleSelecaoModeChange} onClearSelected={handleClearSelected} onClearFixed={handleClearFixed} />
            </div>
          </div>
          <div className="lg:col-span-1 flex flex-col">
            <div className="w-full flex-1">
              <PalpiteSection resultados={resultados} onPalpiteChange={handlePalpiteChange} fonte={fonte} onFonteChange={setFonte} />
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
            <TrupacosList jogos={jogosGerados} onSalvarModelo={() => setDialogOpen(true)} />
          </div>
          <div className="lg:col-span-1">
            <ConferenciaRapida jogos={jogosGerados} resultadoSorteado={ultimoResultado} />
          </div>
        </div>

        {/* Espaço reservado para novas funções */}
        <div className="min-h-[200px]" />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Salvar Modelo de Estratégia</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome do modelo..."
              value={modeloNome}
              onChange={(e) => setModeloNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSalvarModelo()}
              className="w-full bg-muted border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <p className="text-xs text-muted-foreground">
              Salva: {selectedNumbers.length} números, {fixedNumbers.length} fixos, modo {selecaoMode}
            </p>
            <button
              onClick={handleSalvarModelo}
              disabled={!modeloNome.trim()}
              className="w-full bg-secondary text-secondary-foreground py-2 rounded font-bold text-sm hover:bg-secondary/80 transition-colors disabled:opacity-40"
            >
              SALVAR
            </button>
          </div>
          {modelos.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Modelos Salvos</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {modelos.map((m) => (
                  <div key={m.id} className="flex items-center justify-between bg-muted rounded px-3 py-1.5">
                    <button
                      onClick={() => handleCarregarModelo(m)}
                      className="text-sm text-foreground hover:text-secondary transition-colors text-left flex-1"
                    >
                      <span className="font-medium">{m.nome}</span>
                      <span className="text-xs text-muted-foreground ml-2">{m.criadoEm}</span>
                    </button>
                    <button
                      onClick={() => handleExcluirModelo(m.id)}
                      className="text-muted-foreground hover:text-destructive text-xs ml-2 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

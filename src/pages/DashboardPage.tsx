import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLotofacilResults, calcularEstatisticas } from "@/hooks/useLotofacilResults";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FechamentoInteligente } from "@/components/dashboard/FechamentoInteligente";
import { PalpiteFechamento } from "@/components/dashboard/PalpiteFechamento";
import { UltimosResultados } from "@/components/dashboard/UltimosResultados";
import { EstrategiaJogo } from "@/components/dashboard/EstrategiaJogo";
import { GeradorPanel } from "@/components/dashboard/GeradorPanel";
import { ConferenciaRapida } from "@/components/dashboard/ConferenciaRapida";

interface Jogo {
  id: number;
  numeros: number[];
  pares: number;
  impares: number;
  soma: number;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fechamento Inteligente state
  const [mode, setMode] = useState<"numeros" | "fixos">("numeros");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);

  // Palpite state
  const [fonte, setFonte] = useState("3");

  // Estratégia state
  const [tamanho, setTamanho] = useState<15 | 16 | 17>(15);
  const [quantidade, setQuantidade] = useState(40);
  const [balancear, setBalancear] = useState(true);

  // Gerador state
  const [jogos, setJogos] = useState<Jogo[]>([]);

  // Conferência state
  const [conferencia, setConferencia] = useState<{
    melhorJogo: number | null;
    melhorAcerto: number;
    acertosPorJogo: { jogoId: number; acertos: number }[];
  }>({ melhorJogo: null, melhorAcerto: 0, acertosPorJogo: [] });

  // Real Lotofácil data
  const { resultados, loading: loadingResults, refetch: refetchResults } = useLotofacilResults(10);

  // Calculate hot/cold numbers based on fonte
  const { hotNumbers, coldNumbers } = useMemo(
    () => calcularEstatisticas(resultados, parseInt(fonte)),
    [resultados, fonte]
  );

  // Filter results for display based on fonte
  const resultadosFiltrados = useMemo(
    () => resultados.slice(0, parseInt(fonte)),
    [resultados, fonte]
  );

  const handleToggleNumber = useCallback(
    (n: number) => {
      if (mode === "numeros") {
        setSelectedNumbers((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
      } else {
        setFixedNumbers((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
      }
    },
    [mode]
  );

  const handleClear = useCallback(() => {
    if (mode === "numeros") setSelectedNumbers([]);
    else setFixedNumbers([]);
  }, [mode]);

  const handleGerar = useCallback(async () => {
    const pool = selectedNumbers.length >= 15 ? selectedNumbers : Array.from({ length: 25 }, (_, i) => i + 1);
    const generated: Jogo[] = [];

    // If user selected exactly enough numbers, first game is their selection
    if (selectedNumbers.length >= tamanho) {
      const first = [...selectedNumbers].sort((a, b) => a - b).slice(0, tamanho);
      const pares = first.filter((n) => n % 2 === 0).length;
      generated.push({ id: 1, numeros: first, pares, impares: first.length - pares, soma: first.reduce((a, b) => a + b, 0) });
    }

    // Generate remaining games with balanced distribution
    while (generated.length < quantidade) {
      const nums = [...fixedNumbers];
      const available = pool.filter((n) => !nums.includes(n));
      const shuffled = [...available].sort(() => Math.random() - 0.5);

      while (nums.length < tamanho && shuffled.length > 0) {
        nums.push(shuffled.pop()!);
      }

      // Fill from full pool if needed
      if (nums.length < tamanho) {
        const remaining = Array.from({ length: 25 }, (_, i) => i + 1).filter((n) => !nums.includes(n));
        const rShuffled = remaining.sort(() => Math.random() - 0.5);
        while (nums.length < tamanho && rShuffled.length > 0) {
          nums.push(rShuffled.pop()!);
        }
      }

      nums.sort((a, b) => a - b);
      const pares = nums.filter((n) => n % 2 === 0).length;
      const impares = nums.length - pares;

      // Apply balance filter
      if (balancear) {
        const ratio = pares / nums.length;
        if (ratio < 0.3 || ratio > 0.7) continue; // Skip unbalanced games
      }

      generated.push({
        id: generated.length + 1,
        numeros: nums,
        pares,
        impares,
        soma: nums.reduce((a, b) => a + b, 0),
      });
    }

    setJogos(generated);

    // Auto-conferência with latest result
    if (resultados.length > 0) {
      const ultimoSorteio = resultados[0].numeros;
      const acertos = generated.map((j) => ({
        jogoId: j.id,
        acertos: j.numeros.filter((n) => ultimoSorteio.includes(n)).length,
      }));
      const melhor = acertos.reduce((best, curr) => (curr.acertos > best.acertos ? curr : best), acertos[0]);
      setConferencia({ melhorJogo: melhor?.jogoId ?? null, melhorAcerto: melhor?.acertos ?? 0, acertosPorJogo: acertos });
    }

    // Save to database
    if (user) {
      try {
        const allNums = generated.flatMap((j) => j.numeros);
        await supabase.from("jogos_gerados").insert({
          user_id: user.id,
          numeros: allNums,
          tamanho_jogo: tamanho,
          total_jogos: generated.length,
          concurso: resultados[0]?.concurso || null,
        });
      } catch (err) {
        console.error("Erro ao salvar jogos:", err);
      }
    }

    toast.success(`${generated.length} jogos gerados com sucesso!`);
  }, [selectedNumbers, fixedNumbers, quantidade, tamanho, balancear, resultados, user]);

  const handleDownloadCSV = useCallback(() => {
    if (jogos.length === 0) return;
    const header = "Jogo," + Array.from({ length: tamanho }, (_, i) => `N${i + 1}`).join(",") + ",Pares,Ímpares,Soma\n";
    const rows = jogos.map((j) =>
      `${j.id},${j.numeros.map((n) => String(n).padStart(2, "0")).join(",")},${j.pares},${j.impares},${j.soma}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lotofacil_jogos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV baixado com sucesso!");
  }, [jogos, tamanho]);

  const handleSalvarModelo = useCallback(async () => {
    if (!user) return;
    const nome = prompt("Nome do modelo:");
    if (!nome) return;

    try {
      await supabase.from("modelos_estrategia").insert({
        user_id: user.id,
        nome,
        selected_numbers: selectedNumbers,
        fixed_numbers: fixedNumbers,
        selecao_mode: mode,
        fonte,
      });
      toast.success(`Modelo "${nome}" salvo com sucesso!`);
    } catch (err) {
      toast.error("Erro ao salvar modelo.");
      console.error(err);
    }
  }, [user, selectedNumbers, fixedNumbers, mode, fonte]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4">
        <DashboardHeader onSignOut={handleSignOut} />

        {/* Row 1: 3 panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <FechamentoInteligente
            selectedNumbers={selectedNumbers}
            fixedNumbers={fixedNumbers}
            mode={mode}
            onModeChange={setMode}
            onToggleNumber={handleToggleNumber}
            onClear={handleClear}
          />
          <PalpiteFechamento
            fonte={fonte}
            onFonteChange={setFonte}
            hotNumbers={hotNumbers}
            coldNumbers={coldNumbers}
          />
          <UltimosResultados resultados={resultadosFiltrados} fonte={fonte} />
        </div>

        {/* Row 2: 3 panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <EstrategiaJogo
            tamanho={tamanho}
            onTamanhoChange={setTamanho}
            quantidade={quantidade}
            onQuantidadeChange={setQuantidade}
            balancear={balancear}
            onBalancearChange={setBalancear}
            onGerar={handleGerar}
          />
          <GeradorPanel
            jogos={jogos}
            onDownloadCSV={handleDownloadCSV}
            onSalvarModelo={handleSalvarModelo}
          />
          <ConferenciaRapida
            melhorJogo={conferencia.melhorJogo}
            melhorAcerto={conferencia.melhorAcerto}
            acertosPorJogo={conferencia.acertosPorJogo}
          />
        </div>
      </div>
    </div>
  );
}

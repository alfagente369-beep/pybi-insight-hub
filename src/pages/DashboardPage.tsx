import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FechamentoInteligente } from "@/components/dashboard/FechamentoInteligente";
import { PalpiteFechamento } from "@/components/dashboard/PalpiteFechamento";
import { UltimosResultados } from "@/components/dashboard/UltimosResultados";
import { EstrategiaJogo } from "@/components/dashboard/EstrategiaJogo";
import { GeradorPanel } from "@/components/dashboard/GeradorPanel";
import { ConferenciaRapida } from "@/components/dashboard/ConferenciaRapida";

// Mock data for demonstration
const mockResultados = [
  { concurso: "3621", data: "25/02/2026", numeros: [1, 2, 4, 6, 7, 9, 10, 11, 13, 15, 18, 22, 23, 24, 25] },
  { concurso: "3620", data: "24/02/2026", numeros: [1, 2, 4, 7, 9, 11, 12, 15, 16, 18, 19, 20, 21, 24, 25] },
  { concurso: "3619", data: "23/02/2026", numeros: [2, 3, 5, 6, 8, 10, 12, 14, 16, 17, 19, 20, 22, 23, 25] },
];

const mockHotNumbers = [
  { number: 1, count: 3 }, { number: 2, count: 3 }, { number: 7, count: 3 },
  { number: 11, count: 3 }, { number: 18, count: 3 }, { number: 24, count: 2 },
];

const mockColdNumbers = [
  { number: 3, count: 0 }, { number: 5, count: 0 }, { number: 17, count: 0 }, { number: 6, count: 1 },
];

interface Jogo {
  id: number;
  numeros: number[];
  pares: number;
  impares: number;
  soma: number;
}

export default function DashboardPage() {
  const { signOut } = useAuth();
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

  const handleGerar = useCallback(() => {
    const pool = selectedNumbers.length > 0 ? selectedNumbers : Array.from({ length: 25 }, (_, i) => i + 1);
    const generated: Jogo[] = [];

    for (let i = 0; i < quantidade; i++) {
      const nums = [...fixedNumbers];
      const available = pool.filter((n) => !nums.includes(n));
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      while (nums.length < tamanho && shuffled.length > 0) {
        nums.push(shuffled.pop()!);
      }
      // Fill remaining from full pool if needed
      if (nums.length < tamanho) {
        const remaining = Array.from({ length: 25 }, (_, i) => i + 1).filter((n) => !nums.includes(n));
        const rShuffled = remaining.sort(() => Math.random() - 0.5);
        while (nums.length < tamanho && rShuffled.length > 0) {
          nums.push(rShuffled.pop()!);
        }
      }
      nums.sort((a, b) => a - b);
      const pares = nums.filter((n) => n % 2 === 0).length;
      generated.push({ id: i + 1, numeros: nums, pares, impares: nums.length - pares, soma: nums.reduce((a, b) => a + b, 0) });
    }

    setJogos(generated);

    // Auto-conferência with latest result
    if (mockResultados.length > 0) {
      const ultimoSorteio = mockResultados[0].numeros;
      const acertos = generated.map((j) => ({
        jogoId: j.id,
        acertos: j.numeros.filter((n) => ultimoSorteio.includes(n)).length,
      }));
      const melhor = acertos.reduce((best, curr) => (curr.acertos > best.acertos ? curr : best), acertos[0]);
      setConferencia({ melhorJogo: melhor.jogoId, melhorAcerto: melhor.acertos, acertosPorJogo: acertos });
    }
  }, [selectedNumbers, fixedNumbers, quantidade, tamanho]);

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
            hotNumbers={mockHotNumbers}
            coldNumbers={mockColdNumbers}
          />
          <UltimosResultados resultados={mockResultados} fonte={fonte} />
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
          <GeradorPanel jogos={jogos} />
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

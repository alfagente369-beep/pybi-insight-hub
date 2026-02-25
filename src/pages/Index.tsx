import { useState } from "react";
import SelecaoInteligente from "@/components/SelecaoInteligente";
import PalpiteSection from "@/components/PalpiteSection";
import UltimosResultados from "@/components/UltimosResultados";
import TrupacosList from "@/components/TrupacosList";
import EstrategiaJogo from "@/components/EstrategiaJogo";
import ConferenciaRapida from "@/components/ConferenciaRapida";

const Index = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([1]);

  const toggleNumber = (num: number) => {
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
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

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Row 1 */}
        <div className="lg:col-span-1">
          <SelecaoInteligente selected={selectedNumbers} onToggle={toggleNumber} />
        </div>
        <div className="lg:col-span-1">
          <PalpiteSection />
        </div>
        <div className="lg:col-span-1">
          <UltimosResultados />
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-1">
          <TrupacosList />
        </div>
        <div className="lg:col-span-1">
          <EstrategiaJogo />
        </div>
        <div className="lg:col-span-1">
          <ConferenciaRapida />
        </div>
      </div>
    </div>
  );
};

export default Index;

import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export function DashboardHeader({ onSignOut }: DashboardHeaderProps) {
  return (
    <header className="text-center py-6 relative">
      <h1 className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest">
        FECHAMENTO LOTOFACIL
      </h1>
      <p className="text-muted-foreground text-xs mt-1">Gerador Inteligente de Fechamentos</p>
      <button
        onClick={onSignOut}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        title="Sair"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}

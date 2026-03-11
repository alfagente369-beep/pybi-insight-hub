import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

export default function ProtectedRoute({ children, requireSubscription = false }: { children: React.ReactNode; requireSubscription?: boolean }) {
  const { user, loading } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const location = useLocation();

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-heading text-lg animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (requireSubscription && !isActive) {
    return <Navigate to="/pagamento" replace />;
  }

  return <>{children}</>;
}

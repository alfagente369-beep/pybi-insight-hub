import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-heading font-black text-primary">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Página não encontrada</p>
        <a href="/" className="text-secondary underline hover:text-secondary/80 transition-colors">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
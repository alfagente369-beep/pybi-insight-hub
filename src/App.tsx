import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "@/pages/LoginPage";
import PaymentPage from "@/pages/PaymentPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pagamento" element={<PaymentPage />} />
        <Route path="/app" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><h1 className="font-heading text-2xl text-primary">App — Em construção</h1></div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

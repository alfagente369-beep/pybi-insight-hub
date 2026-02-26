export interface ModeloEstrategia {
  id: string;
  nome: string;
  criadoEm: string;
  selectedNumbers: number[];
  fixedNumbers: number[];
  selecaoMode: "numeros" | "fixos";
  fonte: string;
}

const STORAGE_KEY = "lotofacil_modelos";

export function listarModelos(): ModeloEstrategia[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function salvarModelo(modelo: Omit<ModeloEstrategia, "id" | "criadoEm">): ModeloEstrategia {
  const modelos = listarModelos();
  const novo: ModeloEstrategia = {
    ...modelo,
    id: Date.now().toString(36),
    criadoEm: new Date().toLocaleString("pt-BR"),
  };
  modelos.unshift(novo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modelos));
  return novo;
}

export function excluirModelo(id: string): void {
  const modelos = listarModelos().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modelos));
}

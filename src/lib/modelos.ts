import { supabase } from "@/integrations/supabase/client";

export interface ModeloEstrategia {
  id: string;
  nome: string;
  criadoEm: string;
  selectedNumbers: number[];
  fixedNumbers: number[];
  selecaoMode: "numeros" | "fixos";
  fonte: string;
}

export async function listarModelos(): Promise<ModeloEstrategia[]> {
  const { data, error } = await supabase
    .from("modelos_estrategia")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar modelos:", error);
    return [];
  }

  return (data ?? []).map((m) => ({
    id: m.id,
    nome: m.nome,
    criadoEm: new Date(m.created_at).toLocaleString("pt-BR"),
    selectedNumbers: m.selected_numbers,
    fixedNumbers: m.fixed_numbers,
    selecaoMode: m.selecao_mode as "numeros" | "fixos",
    fonte: m.fonte,
  }));
}

export async function salvarModelo(
  modelo: Omit<ModeloEstrategia, "id" | "criadoEm">
): Promise<ModeloEstrategia | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("modelos_estrategia")
    .insert({
      user_id: user.id,
      nome: modelo.nome,
      selected_numbers: modelo.selectedNumbers,
      fixed_numbers: modelo.fixedNumbers,
      selecao_mode: modelo.selecaoMode,
      fonte: modelo.fonte,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Erro ao salvar modelo:", error);
    return null;
  }

  return {
    id: data.id,
    nome: data.nome,
    criadoEm: new Date(data.created_at).toLocaleString("pt-BR"),
    selectedNumbers: data.selected_numbers,
    fixedNumbers: data.fixed_numbers,
    selecaoMode: data.selecao_mode as "numeros" | "fixos",
    fonte: data.fonte,
  };
}

export async function excluirModelo(id: string): Promise<void> {
  const { error } = await supabase
    .from("modelos_estrategia")
    .delete()
    .eq("id", id);

  if (error) console.error("Erro ao excluir modelo:", error);
}

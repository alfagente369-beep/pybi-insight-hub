
-- Profiles table (auto-created on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Modelos de estratégia
CREATE TABLE public.modelos_estrategia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  selected_numbers INTEGER[] NOT NULL DEFAULT '{}',
  fixed_numbers INTEGER[] NOT NULL DEFAULT '{}',
  selecao_mode TEXT NOT NULL DEFAULT 'numeros' CHECK (selecao_mode IN ('numeros', 'fixos')),
  fonte TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.modelos_estrategia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own modelos" ON public.modelos_estrategia FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own modelos" ON public.modelos_estrategia FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own modelos" ON public.modelos_estrategia FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own modelos" ON public.modelos_estrategia FOR UPDATE USING (auth.uid() = user_id);

-- Jogos gerados (fechamentos)
CREATE TABLE public.jogos_gerados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concurso TEXT,
  tamanho_jogo INTEGER NOT NULL DEFAULT 15,
  numeros INTEGER[][] NOT NULL DEFAULT '{}',
  total_jogos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jogos_gerados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jogos" ON public.jogos_gerados FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jogos" ON public.jogos_gerados FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own jogos" ON public.jogos_gerados FOR DELETE USING (auth.uid() = user_id);

-- Resultados (conferência de acertos)
CREATE TABLE public.resultados_conferencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  jogo_id UUID REFERENCES public.jogos_gerados(id) ON DELETE CASCADE,
  concurso TEXT NOT NULL,
  resultado_sorteado INTEGER[] NOT NULL DEFAULT '{}',
  melhor_acerto INTEGER NOT NULL DEFAULT 0,
  acertos_por_jogo JSONB NOT NULL DEFAULT '[]',
  premio_estimado TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resultados_conferencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resultados" ON public.resultados_conferencia FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resultados" ON public.resultados_conferencia FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_modelos_user_id ON public.modelos_estrategia(user_id);
CREATE INDEX idx_jogos_user_id ON public.jogos_gerados(user_id);
CREATE INDEX idx_resultados_user_id ON public.resultados_conferencia(user_id);
CREATE INDEX idx_resultados_jogo_id ON public.resultados_conferencia(jogo_id);

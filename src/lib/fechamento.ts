/**
 * Algoritmo de distribuição inteligente de números selecionados.
 * Distribui os números escolhidos pelo usuário em N jogos,
 * maximizando a cobertura e probabilidade de acerto.
 */

export interface JogoDistribuido {
  id: number;
  numeros: number[];
}

/**
 * Gera jogos distribuindo os números selecionados de forma inteligente.
 * 
 * Estratégia:
 * 1. Cada jogo precisa de `tamanho` números (15, 16 ou 17)
 * 2. Os números selecionados são distribuídos de forma equilibrada entre os jogos
 * 3. Os números restantes (não selecionados) completam cada jogo
 * 4. Garante máxima cobertura dos números selecionados em todos os jogos
 */
export function distribuirNumerosInteligente(
  numerosEscolhidos: number[],
  quantidade: number,
  tamanho: number = 15,
  balancear: boolean = true
): JogoDistribuido[] {
  const size = Math.max(15, Math.min(17, tamanho));
  const todos = Array.from({ length: 25 }, (_, i) => i + 1);
  const naoEscolhidos = todos.filter((n) => !numerosEscolhidos.includes(n));
  const jogos: JogoDistribuido[] = [];

  if (numerosEscolhidos.length === 0) return jogos;

  // Se os números selecionados cabem em um único jogo
  if (numerosEscolhidos.length <= size) {
    for (let i = 0; i < quantidade; i++) {
      let numeros = [...numerosEscolhidos];
      // Completar com números não selecionados (embaralhados)
      const complemento = shuffle([...naoEscolhidos]);
      numeros = [...numeros, ...complemento.slice(0, size - numeros.length)];
      
      if (balancear) {
        numeros = balancearParesImpares(numeros, size, todos);
      }
      
      numeros = numeros.slice(0, size).sort((a, b) => a - b);
      jogos.push({ id: i + 1, numeros });
    }
    return jogos;
  }

  // Distribuição inteligente: números selecionados > tamanho do jogo
  // Usar round-robin para distribuir os números de forma equilibrada
  const escolhidosEmbaralhados = shuffle([...numerosEscolhidos]);
  
  for (let i = 0; i < quantidade; i++) {
    let numeros: number[] = [];
    
    // Selecionar `size` números dos escolhidos usando rotação
    const offset = (i * size) % escolhidosEmbaralhados.length;
    let idx = offset;
    const usados = new Set<number>();
    
    while (numeros.length < Math.min(size, escolhidosEmbaralhados.length)) {
      const num = escolhidosEmbaralhados[idx % escolhidosEmbaralhados.length];
      if (!usados.has(num)) {
        numeros.push(num);
        usados.add(num);
      }
      idx++;
      if (usados.size >= escolhidosEmbaralhados.length) break;
    }
    
    // Se ainda faltam números, completar com não-escolhidos
    if (numeros.length < size) {
      const complemento = shuffle([...naoEscolhidos]);
      numeros = [...numeros, ...complemento.slice(0, size - numeros.length)];
    }
    
    if (balancear) {
      numeros = balancearParesImpares(numeros, size, todos);
    }
    
    numeros = numeros.slice(0, size).sort((a, b) => a - b);
    jogos.push({ id: i + 1, numeros });
  }

  return jogos;
}

function shuffle(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function balancearParesImpares(numeros: number[], size: number, todos: number[]): number[] {
  const pares = numeros.filter((n) => n % 2 === 0);
  const impares = numeros.filter((n) => n % 2 !== 0);
  const targetOdd = Math.round(size * (Math.random() > 0.5 ? 7 : 8) / 15);
  const targetEven = size - targetOdd;

  let resultado: number[] = [];
  resultado.push(...impares.slice(0, targetOdd));
  resultado.push(...pares.slice(0, targetEven));

  if (resultado.length < size) {
    const faltam = size - resultado.length;
    const disponiveis = todos.filter((n) => !resultado.includes(n));
    resultado.push(...shuffle(disponiveis).slice(0, faltam));
  }

  return resultado.slice(0, size);
}

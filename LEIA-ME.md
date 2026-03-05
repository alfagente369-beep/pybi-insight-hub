# 🔧 Correções — PyBI Insight Hub

## Como aplicar

Substitua os arquivos abaixo no seu repositório GitHub pelos arquivos desta pasta,
mantendo o mesmo caminho de diretório.

---

## Arquivos corrigidos

| Arquivo no repo | Correções aplicadas |
|---|---|
| `src/pages/LoginPage.tsx` | Fix #1: Verifica assinatura antes de redirecionar |
| `src/pages/PaymentPage.tsx` | Fix #6: Polling automático para confirmar PIX |
| `src/hooks/useSubscription.tsx` | Fix #6: Expõe `refetch()` para polling externo |
| `supabase/functions/create-billing/index.ts` | Fix #1: `getUser()` em vez de `getClaims()` · Fix #2: `SUPABASE_ANON_KEY` correto · Fix #7: `origin` nunca é `null` |
| `supabase/functions/abacatepay-webhook/index.ts` | Fix #4: Validação HMAC da assinatura do webhook · Fix #5: `.maybeSingle()` em vez de `.single()` |

---

## Variável de ambiente extra necessária no Supabase

Para ativar a validação de assinatura do webhook (Fix #4), adicione no painel do Supabase:

```
ABACATEPAY_WEBHOOK_SECRET = <seu_webhook_secret_do_abacatepay>
```

Acesse: **Supabase Dashboard → Edge Functions → Secrets**

Se essa variável não estiver configurada, o webhook ainda funciona (sem validação),
mas fica vulnerável a chamadas falsas. Recomendado configurar em produção.

---

## Fluxo após as correções

```
Usuário acessa qualquer rota
    ↓ não autenticado
    → /login

    ↓ autenticado, SEM assinatura ativa
    → /pagamento  (com polling automático a cada 5s aguardando PIX)

    ↓ autenticado, COM assinatura ativa
    → /app  (acesso liberado)
```

# Deploy gratis + fotos online

## 1) Banco Postgres online (Supabase Free)
1. Crie um projeto em Supabase (plano Free).
2. Abra o SQL Editor e rode o arquivo `supabase/schema.sql`.
3. Em Project Settings > API, copie:
- `Project URL`
- `anon public key`

## 2) Configurar o frontend para salvar online
Edite `config.js` e preencha:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
  SUPABASE_ANON_KEY: "SUA_ANON_KEY",
  SUPABASE_BUCKET: "love-photos"
};
```

Quando esses campos estiverem preenchidos, a pagina `album.html` entra em modo online.
As fotos ficam salvas no Postgres + Storage e aparecem para todos.

## 3) Hospedar de graca no GitHub Pages
1. Suba o repositório para o GitHub.
2. No GitHub, abra Settings > Pages.
3. Em Build and deployment:
- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`
4. Salve e aguarde o deploy.
5. A URL publica sera mostrada na mesma tela de Pages.

## 4) Atualizar o site depois
Sempre que alterar o projeto, faça commit e push para `main`.
O GitHub Pages publica automaticamente.

## Observacao de seguranca
A anon key do Supabase e publica por design. A protecao real fica nas politicas RLS.
As politicas atuais permitem leitura e escrita abertas para facilitar um album compartilhado.

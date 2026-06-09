# Nosso Cantinho

Site romantico interativo feito com HTML, CSS e JavaScript puro.

## Site Online

Acesse aqui:

- https://yasmim-melo.github.io/gift-gabriel/

## Funcionalidades

- Hero personalizado com nomes e data do casal
- Contador de tempo juntos (dias, horas e minutos)
- Varal de polaroids na home
- Vitrola do amor + player
- Trilha sonora de fundo
- Caixa de correio com bilhetes
- Maquininha de surpresas
- Jogo da velha do amor
- Botao do amor com chuva de coracoes
- Pagina de Album com upload e persistencia online
- Pagina de Recados
- Pagina de Historia com timeline e metas

## Persistencia Online de Fotos

O album usa Supabase (Postgres + Storage) quando o arquivo `config.js` estiver preenchido.

Arquivo: `config.js`

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
  SUPABASE_ANON_KEY: "SUA_CHAVE_PUBLICA",
  SUPABASE_BUCKET: "love-photos"
};
```

## Banco de Dados (Postgres)

Script SQL pronto em:

- `supabase/schema.sql`

Esse script cria:

- tabela `album_photos`
- bucket `love-photos`
- policies de leitura e escrita para o album compartilhado

## Rodar Localmente

Como e um projeto estatico, voce pode abrir os arquivos HTML direto no navegador.

Sugestao:

- abrir `index.html`
- navegar pelo menu para `album.html`, `recados.html` e `historia.html`

## Deploy no GitHub Pages

Guia detalhado:

- `DEPLOY-GITHUB-PAGES.md`

Resumo:

1. Push para a branch `main`
2. Em GitHub Settings > Pages, selecionar `Deploy from a branch`
3. Branch `main` e pasta `/ (root)`

## Estrutura

- `index.html` home
- `album.html` album
- `recados.html` recados
- `historia.html` historia
- `styles.css` estilos globais
- `script.js` logica da home
- `album.js` logica do album
- `recados.js` logica dos recados
- `historia.js` logica da historia
- `config.js` configuracao de ambiente do album online
- `supabase/schema.sql` schema e policies

## Licenca

Uso pessoal para projeto/presente romantico.

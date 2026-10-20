# JT · Instante e Essência

Portfólio de fotografia e vídeo de casamento. Site estático, sem build e sem dependências.

## Estrutura

```
index.html            conteúdo e marcação semântica
css/styles.css        tokens de design (cores, tipografia, espaços) e componentes
css/noscript.css      esconde o preloader quando o JavaScript está desligado
js/preloader.js       classe Preloader e funções puras da animação
js/reveal-words.js    efeito de texto que surge palavra por palavra na home
js/main.js            ponto de entrada: textos e tempos do preloader e do efeito
assets/img/           fotos do site
tests/                testes com o runner nativo do Node
```

## Rodar e testar

```bash
npm start   # serve em http://localhost:8080
npm test    # Node 20 ou mais novo
```

O JavaScript usa módulos ES, que o navegador só carrega via HTTP.
Abrindo o `index.html` direto do disco, o site funciona, mas o preloader some sozinho após 6 segundos em vez de animar.

## Personalizar

- O WhatsApp e o Instagram ficam no fim do `index.html`.
- As palavras e os tempos do preloader ficam em `js/main.js`.

## Segurança

- A política de segurança de conteúdo (CSP) no `<head>` só permite scripts e estilos do próprio site e do Google Fonts. Não há script nem estilo inline.
- Links externos abrem com `rel="noopener noreferrer"`.
- Algumas proteções só funcionam como cabeçalho HTTP, não como `<meta>`. Configure na hospedagem:

```
Content-Security-Policy: <a mesma do index.html>; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

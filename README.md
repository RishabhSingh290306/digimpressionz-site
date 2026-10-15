# Digimpressionz portfolio site

Static site (HTML, CSS, JS). No build step, no backend. Total size is under 1 MB.

## Deploy to Vercel (free)
1. Put this folder in a GitHub repo, then import it at vercel.com/new. Leave the framework as "Other" and leave the build command empty.
   Or run `npx vercel --prod` inside this folder.
2. After you get the live URL, replace `https://digimpressionz.vercel.app` in `index.html` (canonical, og:image, og:url), `robots.txt` and `sitemap.xml`.

## Editing
- Text and sections: `index.html`
- Colours: the brand colours (navy, blue, sky, gold) are variables at the top of `css/style.css`
- Phone, email and WhatsApp number: `index.html` and the `PHONE` / `MAIL` constants in `js/main.js`
- Images: `img/` (webp). Keep the same file names, or update the paths in `index.html`
- The contact form needs no server. It opens WhatsApp or the visitor's email app with the message filled in.

Fonts (Unbounded, Figtree) are self-hosted. Smooth scrolling uses Lenis (MIT licence).

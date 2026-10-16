# Behl Collection

A one-click launcher for the **Behl Collection** website — a premium ethnic-wear
store (lehengas, sarees, suits & indo-western) with two stores in Jammu, India:
the flagship on Shalamar Road and the new store on Apsara Road.

This is a **serverless web app**: a single static `index.html` (plus local
assets) that connects to third-party services — Google Maps for directions and
the map embed, and links out to Instagram, Facebook and WhatsApp. There is no
backend and nothing to install or launch manually; Pinokio opens `index.html`
directly.

## How to use

1. Open this launcher in Pinokio — the website opens automatically.
2. Browse the story, collections, lookbook and store details.
3. Use the **WhatsApp Us**, **Call Store** and **Get Directions** buttons to
   reach the store; those open WhatsApp / the phone dialer / Google Maps.

## Project structure

```
behl-collection/
├── index.html      # The entire website (static)
├── icon.png        # Launcher icon
├── pinokio.json    # Pinokio metadata
├── README.md       # This file
└── assets/         # CSS, fonts, JS, images, vendored GSAP
```

## API / programmatic access

The site is fully static — it exposes no API of its own. It can be served or
fetched with any static file server:

**Curl**

```bash
curl http://localhost:<PORT>/index.html
```

**Python**

```python
import urllib.request
html = urllib.request.urlopen("http://localhost:<PORT>/index.html").read()
```

**JavaScript (browser)**

```javascript
const html = await (await fetch("/index.html")).text();
```

Replace `<PORT>` with whatever static file server you use to host the folder
(e.g. `python3 -m http.server`). Inside Pinokio none of this is required — the
launcher opens the page directly.

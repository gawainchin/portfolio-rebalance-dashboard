# Portfolio Rebalance Dashboard

Static web dashboard for reviewing a portfolio rebalance proposal.

## Contents
- `index.html` — dashboard shell
- `styles.css` — visual styling
- `app.js` — client-side rendering logic
- `data.json` — portfolio, bucket, and recommendation content

## Run locally

```bash
cd /Users/openclaw/portfolio-rebalance-dashboard
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765
```

## Notes

- The dashboard is data-driven from `data.json`
- No build step required
- Good starting point for wiring to live portfolio JSON / CSV later

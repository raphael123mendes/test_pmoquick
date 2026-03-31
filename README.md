# ADEK PMO — Strategic Portfolio App

A lightweight, data-driven project management dashboard for ADEK Private Schools.

## Structure

```
adek-pmo/
├── index.html              ← App shell + nav
├── app.js                  ← Tailwind config, data loader, router, shared helpers (H.*)
├── data/
│   ├── initiatives.json    ← 4 strategic initiatives
│   ├── projects.json       ← 15 projects (with Budget_AED)
│   ├── milestones.json     ← 60 milestones (4 per project)
│   ├── kpis.json           ← 19 KPIs (with Initiative link)
│   └── risks.json          ← 7 risks
├── pages/
│   ├── overview.js         ← Executive overview
│   ├── initiatives.js      ← Initiatives bento grid
│   ├── initiative-detail.js← Single initiative drill-down
│   ├── project-detail.js   ← Single project + milestone roadmap
│   ├── kpis.js             ← KPI grid with filters
│   ├── kpi-detail.js       ← Single KPI deep-dive
│   └── risks.js            ← Risk register
└── styles/
    └── app.css             ← Design tokens + shared styles
```

## Running locally

Because the app fetches JSON files, you need a local server — just double-clicking
`index.html` won't work (browsers block local fetch calls).

```bash
cd adek-pmo
python3 -m http.server 8000
```

Then open: http://localhost:8000

## Updating data

Edit the JSON files in `data/` directly. The app reloads fresh data on each page load.

### Fields to complete (currently blank)
| File | Field | Notes |
|------|-------|-------|
| `projects.json` | `Progress (%)` | 0.0–1.0 decimal |
| `projects.json` | `Project_Lead` | Name string |
| `initiatives.json` | `Exec_Sponsor` | Name string |
| `initiatives.json` | `Overall_Progress (%)` | 0.0–1.0 decimal |
| `projects.json` | `Budget_AED` | Missing for 11 projects |

## Adding a new page

1. Create `pages/my-page.js` with a module pattern:
   ```js
   const MyPage = (() => {
     function render(id) {
       document.getElementById('page-my-page').innerHTML = `...`;
     }
     return { render };
   })();
   ```
2. Add `<div id="page-my-page" class="page ..."></div>` in `index.html`
3. Add `<script src="pages/my-page.js"></script>` in `index.html`
4. Register navigation in `app.js` if needed

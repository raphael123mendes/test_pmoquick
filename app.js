/**
 * app.js — ADEK PMO
 * Owns: Tailwind config, data loading, routing, shared utilities
 */

// ── TAILWIND CONFIG ───────────────────────────────────────────────────────────
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary':                  '#1342ff',
        'on-primary':               '#f9f6ff',
        'primary-dim':              '#0036e9',
        'primary-container':        '#dee0ff',
        'on-primary-container':     '#0035e7',
        'primary-fixed':            '#dee0ff',
        'primary-fixed-dim':        '#ccd2ff',
        'on-primary-fixed':         '#0029b8',
        'on-primary-fixed-variant': '#023dff',
        'secondary':                '#5d5f63',
        'on-secondary':             '#f7f9fd',
        'secondary-dim':            '#505357',
        'secondary-container':      '#e1e2e6',
        'on-secondary-container':   '#4f5255',
        'secondary-fixed':          '#e1e2e6',
        'secondary-fixed-dim':      '#d3d4d8',
        'on-secondary-fixed':       '#3d4043',
        'on-secondary-fixed-variant':'#595c5f',
        'tertiary':                 '#625e5c',
        'on-tertiary':              '#fff7f4',
        'tertiary-dim':             '#565250',
        'tertiary-container':       '#f9f2ef',
        'on-tertiary-container':    '#5f5b59',
        'tertiary-fixed':           '#f9f2ef',
        'tertiary-fixed-dim':       '#ebe4e1',
        'on-tertiary-fixed':        '#4d4947',
        'on-tertiary-fixed-variant':'#6a6563',
        'surface':                  '#f9f9fa',
        'surface-dim':              '#d2dce0',
        'surface-bright':           '#f9f9fa',
        'surface-variant':          '#dce4e7',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#f1f4f5',
        'surface-container':        '#eaeef1',
        'surface-container-high':   '#e3e9ec',
        'surface-container-highest':'#dce4e7',
        'on-surface':               '#2c3437',
        'on-surface-variant':       '#586063',
        'inverse-surface':          '#0c0f10',
        'inverse-on-surface':       '#9b9d9e',
        'background':               '#f9f9fa',
        'on-background':            '#2c3437',
        'error':                    '#9e3f4e',
        'on-error':                 '#fff7f7',
        'error-container':          '#ff8b9a',
        'on-error-container':       '#782232',
        'error-dim':                '#4f0116',
        'outline':                  '#747c7f',
        'outline-variant':          '#abb3b7',
        'surface-tint':             '#1342ff',
        'inverse-primary':          '#7287ff',
      },
      fontFamily: {
        'headline': ['Manrope'],
        'body':     ['Inter'],
        'label':    ['Inter'],
      },
      borderRadius: {
        'DEFAULT': '0.125rem',
        'lg':      '0.25rem',
        'xl':      '0.5rem',
        'full':    '0.75rem',
      },
    },
  },
};

// ── DATA STORE ────────────────────────────────────────────────────────────────
const Store = {
  initiatives: [],
  projects:    [],
  milestones:  [],
  kpis:        [],
  risks:       [],
  loaded:      false,
};

// ── SHARED HELPERS (available to all page modules) ────────────────────────────
const H = {
  statusClass: s => ({ Green:'status-on-track', Amber:'status-needs-attention', Red:'status-off-track' }[s] || 'status-planned'),
  statusLabel: s => ({ Green:'On Track', Amber:'Needs Attention', Red:'Off Track' }[s] || s),
  healthClass: s => ({ Green:'health-green', Amber:'health-amber', Red:'health-red' }[s] || 'health-amber'),

  milestoneStatusClass: s => ({
    'Done':        'status-done',
    'In Progress': 'status-in-progress',
    'Planned':     'status-planned',
    'Blocked':     'status-blocked',
  }[s] || 'status-planned'),

  riskSeverityBg:   n => n >= 15 ? '#fee2e2' : n >= 10 ? '#fef9c3' : '#dcfce7',
  riskSeverityText: n => n >= 15 ? '#991b1b' : n >= 10 ? '#92400e' : '#166534',

  fmt: d => d ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'TBD',

  fmtBudget: b => b ? 'AED ' + Number(b).toLocaleString() : '—',

  initIcon: id => ({ 'INT-01':'verified_user', 'INT-02':'favorite', 'INT-03':'school', 'INT-04':'payments' }[id] || 'circle'),

  isCountKPI: k => ['K12','K18','K19'].includes(k.KPI_ID),

  pct: k => k.Actual_Result != null
    ? Math.min(Math.round((k.Actual_Result / k.Target_Value) * 100), 100)
    : null,

  kpiValue: k => k.Actual_Result != null
    ? k.Actual_Result + (H.isCountKPI(k) ? '' : '%')
    : '—',

  milestoneIcon: s => {
    if (s === 'Done')        return `<span class="material-symbols-outlined text-xs text-on-primary" style="font-size:12px">check</span>`;
    if (s === 'In Progress') return `<div class="w-2 h-2 rounded-full bg-primary"></div>`;
    return `<span class="material-symbols-outlined text-outline" style="font-size:12px">schedule</span>`;
  },

  milestoneDotClass: s => s === 'Done'
    ? 'bg-primary ring-4 ring-surface-container-lowest'
    : 'bg-surface-container border border-primary ring-4 ring-surface-container-lowest',
};

// ── ROUTER ────────────────────────────────────────────────────────────────────
const App = (() => {
  const history = [];
  const ROOT_PAGES = ['overview', 'initiatives', 'kpis', 'risks'];

  function activeRoot(id) {
    if (ROOT_PAGES.includes(id))     return id;
    if (id.startsWith('initiative')) return 'initiatives';
    if (id.startsWith('project'))    return 'initiatives';
    if (id.startsWith('kpi'))        return 'kpis';
    return 'overview';
  }

  function updateNav(id) {
    const root = activeRoot(id);
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
      el.classList.remove('active');
    });
    document.querySelectorAll(`[data-page="${root}"]`).forEach(el => {
      el.classList.add('active');
    });
  }

  function showPage(id, push = true) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + id);
    if (!el) return console.warn('Page not found:', id);
    el.classList.add('active');
    el.classList.add('fade-in');
    setTimeout(() => el.classList.remove('fade-in'), 400);
    if (push) history.push(id);
    updateNav(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (history.length > 1) {
      history.pop();
      showPage(history[history.length - 1], false);
    }
  }

  // Expose detail navigators (called from page modules)
  function openInitiative(id) {
    InitiativeDetailPage.render(id);
    showPage('initiative-detail');
  }

  function openProject(id) {
    ProjectDetailPage.render(id);
    showPage('project-detail');
  }

  function openKPI(id) {
    KPIDetailPage.render(id);
    showPage('kpi-detail');
  }

  return { showPage, goBack, openInitiative, openProject, openKPI };
})();

// ── DATA LOADER ───────────────────────────────────────────────────────────────
async function loadData() {
  const files = ['initiatives', 'projects', 'milestones', 'kpis', 'risks'];
  try {
    const results = await Promise.all(
      files.map(f => fetch(`data/${f}.json`).then(r => {
        if (!r.ok) throw new Error(`Failed to load data/${f}.json (${r.status})`);
        return r.json();
      }))
    );
    [Store.initiatives, Store.projects, Store.milestones, Store.kpis, Store.risks] = results;
    Store.loaded = true;
  } catch (err) {
    document.getElementById('app-loading').innerHTML = `
      <div class="text-center max-w-sm mx-auto px-6">
        <span class="material-symbols-outlined text-error text-4xl mb-4 block">error</span>
        <p class="font-headline font-bold text-lg mb-2">Could not load data</p>
        <p class="text-secondary text-sm mb-4">${err.message}</p>
        <p class="text-xs text-secondary bg-surface-container p-4 rounded-lg text-left font-mono">
          Make sure you're running a local server:<br><br>
          cd adek-pmo<br>
          python3 -m http.server 8000
        </p>
      </div>`;
    throw err;
  }
}

// ── BOOTSTRAP ─────────────────────────────────────────────────────────────────
(async () => {
  await loadData();

  // Render all pages
  OverviewPage.render();
  InitiativesPage.render();
  KPIsPage.render();
  RisksPage.render();

  // Hide loader, show app
  document.getElementById('app-loading').style.display = 'none';
  App.showPage('overview', false);
})();

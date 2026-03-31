/**
 * pages/overview.js
 * Executive overview — portfolio health, risk alerts, KPI spotlights, initiative cards
 */

const OverviewPage = (() => {

  function render() {
    const { initiatives, projects, kpis, risks } = Store;
    const onTrack = kpis.filter(k => k['Status (Formula)'] === 'Green').length;

    document.getElementById('page-overview').innerHTML = `

      <!-- Hero -->
      <section class="mb-10">
        <div class="relative overflow-hidden rounded-xl bg-on-background text-surface p-8 md:p-12">
          <div class="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none bg-gradient-to-br from-primary to-transparent"></div>
          <div class="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span class="text-[11px] uppercase tracking-[0.2em] text-secondary-fixed-dim mb-4 block font-bold">Portfolio Status · ADEK Private Schools</span>
              <h1 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Strategic Portfolio</h1>
              <p class="text-secondary-fixed-dim text-base max-w-md leading-relaxed mb-8">
                ${initiatives.length} strategic initiatives &nbsp;·&nbsp;
                ${projects.length} active projects &nbsp;·&nbsp;
                ${kpis.length} KPIs tracked
              </p>
              <button onclick="App.showPage('initiatives')" class="bg-primary text-on-primary px-6 py-3 rounded-md font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
                View Initiatives
              </button>
            </div>
            <div class="flex justify-center md:justify-end">
              <div class="relative w-44 h-44 flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                <div class="absolute inset-0 rounded-full border-8 border-primary border-b-transparent border-r-transparent spin"></div>
                <div class="text-center">
                  <span class="block font-headline text-4xl font-black">${onTrack}/${kpis.length}</span>
                  <span class="text-xs uppercase tracking-widest text-secondary-fixed-dim">KPIs On Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bento: risks + KPI cards -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

        <!-- Risks panel -->
        <div class="lg:col-span-4 bg-tertiary-container rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-headline font-bold text-lg">Active Risks</h2>
            <button onclick="App.showPage('risks')" class="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View All</button>
          </div>
          <div class="space-y-3">
            ${risks.slice(0,4).map(r => `
            <div class="flex gap-3 p-3 bg-surface-container-lowest rounded-lg cursor-pointer hover-card" onclick="App.showPage('risks')">
              <span class="material-symbols-outlined text-sm mt-0.5" style="color:${H.riskSeverityText(r['Severity (1-25)'])}">warning</span>
              <div>
                <p class="font-bold text-xs text-on-background">${r.Title}</p>
                <p class="text-[10px] text-secondary mt-0.5">${r.Status} · Severity ${r['Severity (1-25)']}/25</p>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- KPI spotlight cards (4 featured) -->
        <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${['K01','K05','K09','K15'].map(id => {
            const k = kpis.find(x => x.KPI_ID === id);
            if (!k) return '';
            const pct = H.pct(k);
            return `
            <div class="bg-surface-container-low p-5 rounded-xl relative overflow-hidden group cursor-pointer hover-card" onclick="App.openKPI('${k.KPI_ID}')">
              <div class="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex justify-between items-start mb-3">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${H.statusClass(k['Status (Formula)'])}">${H.statusLabel(k['Status (Formula)'])}</span>
                <span class="text-[10px] font-bold text-secondary">${k.KPI_ID}</span>
              </div>
              <h3 class="text-xs font-bold uppercase tracking-widest text-secondary mb-1 leading-snug">${k.KPI_Name.substring(0, 48)}…</h3>
              <div class="font-headline text-2xl font-black text-on-background">${H.kpiValue(k)}</div>
              <div class="mt-4 h-1 w-full bg-secondary-container rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full" style="width:${pct || 0}%"></div>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-[10px] text-secondary">Current</span>
                <span class="text-[10px] text-secondary">Target: ${k.Target_Value}${H.isCountKPI(k) ? '' : '%'}</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Initiatives summary -->
      <section>
        <h2 class="font-headline text-2xl font-extrabold mb-6 flex items-center gap-3">
          Strategic Initiatives
          <span class="h-[2px] flex-grow bg-surface-container"></span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${initiatives.map(ini => {
            const projs   = projects.filter(p => p.Parent_Init_ID === ini.Init_ID);
            const kpiIds  = (ini.Linked_KPI_IDs || '').split(',').map(k => k.trim());
            const linked  = kpis.filter(k => kpiIds.includes(k.KPI_ID));
            const onT     = linked.filter(k => k['Status (Formula)'] === 'Green').length;
            return `
            <div class="bg-surface-container-lowest rounded-xl p-6 cursor-pointer hover-card" onclick="App.openInitiative('${ini.Init_ID}')">
              <div class="flex items-start justify-between mb-4">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">${H.initIcon(ini.Init_ID)}</span>
                </div>
                <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-surface-container text-secondary">${ini.Init_ID}</span>
              </div>
              <h4 class="font-headline font-bold text-base mb-2">${ini.Title}</h4>
              <p class="text-secondary text-xs leading-relaxed mb-4 line-clamp-2">${ini.description}</p>
              <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-3 border-t border-surface-container">
                <span class="text-secondary">${projs.length} Projects · ${onT}/${linked.length} KPIs</span>
                <span class="text-primary">${Math.round((ini['Overall_Progress (%)'] || 0) * 100)}%</span>
              </div>
              <div class="w-full h-1 bg-surface-container rounded-full overflow-hidden mt-2">
                <div class="h-full bg-primary rounded-full" style="width:${Math.round((ini['Overall_Progress (%)'] || 0) * 100)}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  return { render };
})();

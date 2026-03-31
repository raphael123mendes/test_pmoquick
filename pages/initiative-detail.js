/**
 * pages/initiative-detail.js
 * Drill-down for a single initiative: KPIs, linked projects, risks
 */

const InitiativeDetailPage = (() => {

  function render(id) {
    const { initiatives, projects, kpis, risks } = Store;
    const ini    = initiatives.find(i => i.Init_ID === id);
    if (!ini) return;
    const projs  = projects.filter(p => p.Parent_Init_ID === id);
    const kpiIds = (ini.Linked_KPI_IDs || '').split(',').map(k => k.trim());
    const linked = kpis.filter(k => kpiIds.includes(k.KPI_ID));
    const linked_risks = risks.filter(r => (r.Impacted_Inits || '').includes(id));

    document.getElementById('page-initiative-detail').innerHTML = `

      <!-- Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <span class="text-[11px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">Initiative · ${ini.Init_ID}</span>
            <h1 class="font-headline font-extrabold text-4xl md:text-5xl tracking-tight mb-4 leading-tight">${ini.Title}</h1>
            <p class="text-secondary text-base leading-relaxed max-w-xl">${ini.description}</p>
          </div>
          <div class="flex gap-3 shrink-0">
            <div class="bg-surface-container-low px-5 py-3 rounded-xl text-center">
              <span class="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Progress</span>
              <span class="font-headline text-2xl font-bold">${Math.round((ini['Overall_Progress (%)'] || 0) * 100)}%</span>
            </div>
            <div class="bg-surface-container-low px-5 py-3 rounded-xl text-center">
              <span class="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Projects</span>
              <span class="font-headline text-2xl font-bold">${projs.length}</span>
            </div>
            <div class="bg-surface-container-low px-5 py-3 rounded-xl text-center">
              <span class="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">KPIs</span>
              <span class="font-headline text-2xl font-bold">${linked.length}</span>
            </div>
            <div class="bg-surface-container-low px-5 py-3 rounded-xl text-center">
              <span class="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Risks</span>
              <span class="font-headline text-2xl font-bold">${linked_risks.length}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- KPIs + Risks -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

        <!-- KPI grid -->
        <section class="md:col-span-8 bg-surface-container-lowest rounded-xl p-8">
          <h2 class="font-headline font-bold text-xl mb-8">Linked KPIs</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
            ${linked.map(k => {
              const pct = H.pct(k);
              return `
              <div class="group cursor-pointer" onclick="App.openKPI('${k.KPI_ID}')">
                <span class="text-[10px] font-bold text-outline-variant mb-1 block">${k.KPI_ID}</span>
                <h3 class="text-xs font-bold text-on-background mb-2 group-hover:text-primary transition-colors leading-snug">${k.KPI_Name}</h3>
                <div class="flex items-baseline gap-2 flex-wrap">
                  <span class="font-headline text-xl font-extrabold">${H.kpiValue(k)}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full ${H.statusClass(k['Status (Formula)'])}">${H.statusLabel(k['Status (Formula)'])}</span>
                </div>
                <div class="w-full h-1 bg-surface-container mt-2 rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width:${pct || 0}%"></div>
                </div>
                <div class="text-[10px] text-secondary mt-1">Target: ${k.Target_Value}${H.isCountKPI(k) ? '' : '%'}</div>
              </div>`;
            }).join('')}
          </div>
        </section>

        <!-- Risks -->
        <aside class="md:col-span-4 bg-tertiary-container rounded-xl p-6">
          <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-error text-sm">warning</span>
            <h2 class="font-headline font-bold text-lg">Linked Risks</h2>
          </div>
          ${linked_risks.length
            ? linked_risks.map(r => `
              <div class="bg-surface-container-lowest/70 p-4 rounded-lg mb-3">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-[10px] font-bold text-secondary">${r.Risk_ID}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:${H.riskSeverityBg(r['Severity (1-25)'])};color:${H.riskSeverityText(r['Severity (1-25)'])}">
                    ${r['Severity (1-25)']}/25
                  </span>
                </div>
                <h4 class="font-bold text-sm text-on-background mb-1">${r.Title}</h4>
                <p class="text-xs text-secondary leading-relaxed">${r.Description.substring(0, 100)}…</p>
              </div>`).join('')
            : '<p class="text-sm text-secondary">No active risks linked to this initiative.</p>'
          }
        </aside>
      </div>

      <!-- Projects -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-headline font-bold text-2xl">Associated Projects</h2>
          <span class="text-secondary text-sm">${projs.length} total</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${projs.map(p => `
          <div class="bg-surface-container-lowest p-6 rounded-xl hover-card cursor-pointer border-l-2 border-primary" onclick="App.openProject('${p.Proj_ID}')">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[10px] font-bold text-outline-variant">${p.Proj_ID}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${H.healthClass(p.Health)}">${p.Health}</span>
            </div>
            <h4 class="font-headline font-bold text-sm mb-2 leading-snug text-on-background">${p.Project_name}</h4>
            <p class="text-xs text-secondary mb-4 line-clamp-2">${p.Project_Description}</p>
            <div class="flex justify-between items-center mb-1 mt-3 pt-3 border-t border-surface-container">
              <span class="text-[10px] text-secondary">${H.fmt(p.Start_Date)} → ${H.fmt(p.Due_date)}</span>
              <span class="text-[10px] font-bold text-primary">${Math.round((p['Progress (%)'] || 0) * 100)}%</span>
            </div>
            <div class="h-1 w-full bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width:${Math.round((p['Progress (%)'] || 0) * 100)}%"></div>
            </div>
            ${p.Budget_AED ? `<div class="text-[10px] font-bold text-primary mt-2">${H.fmtBudget(p.Budget_AED)}</div>` : ''}
          </div>`).join('')}
        </div>
      </section>`;
  }

  return { render };
})();

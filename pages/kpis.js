/**
 * pages/kpis.js
 * Filterable KPI grid — all 19 KPIs with status, value, target, progress bar
 */

const KPIsPage = (() => {

  function render() {
    const { kpis } = Store;

    document.getElementById('page-kpis').innerHTML = `
      <section class="mb-10">
        <span class="text-[11px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">Performance Dashboard</span>
        <h1 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Strategic KPIs</h1>
        <p class="text-secondary leading-relaxed max-w-xl">
          ${kpis.length} performance indicators tracking progress toward 2026 targets across all strategic initiatives.
        </p>
      </section>

      <!-- Filter bar -->
      <div class="flex gap-3 mb-8 flex-wrap">
        <button onclick="KPIsPage.filter('all', this)"    class="kpi-filter active-filter px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-on-primary">All <span class="ml-1 opacity-70">${kpis.length}</span></button>
        <button onclick="KPIsPage.filter('Green', this)"  class="kpi-filter px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container text-secondary"  >On Track <span class="ml-1 opacity-70">${kpis.filter(k=>k['Status (Formula)']==='Green').length}</span></button>
        <button onclick="KPIsPage.filter('Amber', this)"  class="kpi-filter px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container text-secondary"  >Needs Attention <span class="ml-1 opacity-70">${kpis.filter(k=>k['Status (Formula)']==='Amber').length}</span></button>
        <button onclick="KPIsPage.filter('Red', this)"    class="kpi-filter px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-surface-container text-secondary"  >Off Track <span class="ml-1 opacity-70">${kpis.filter(k=>k['Status (Formula)']==='Red').length}</span></button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="kpis-grid">
        ${kpis.map(k => {
          const pct = H.pct(k);
          const ini = Store.initiatives.find(i => i.Init_ID === k.Initiative);
          return `
          <div class="kpi-card bg-surface-container-lowest p-6 rounded-xl hover-card cursor-pointer border-l-2 border-transparent hover:border-primary transition-all"
               data-status="${k['Status (Formula)']}"
               onclick="App.openKPI('${k.KPI_ID}')">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[10px] font-bold text-outline-variant">${k.KPI_ID}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${H.statusClass(k['Status (Formula)'])}">${H.statusLabel(k['Status (Formula)'])}</span>
            </div>
            <h3 class="font-bold text-sm text-on-background mb-3 leading-snug">${k.KPI_Name}</h3>
            <div class="flex items-baseline gap-2 mb-4">
              <span class="font-headline text-3xl font-black">${H.kpiValue(k)}</span>
              <span class="text-secondary text-xs">/ ${k.Target_Value}${H.isCountKPI(k) ? '' : '%'} target</span>
            </div>
            <div class="h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width:${pct || 0}%"></div>
            </div>
            ${ini ? `<div class="mt-3 text-[10px] text-secondary truncate">${ini.Title}</div>` : ''}
          </div>`;
        }).join('')}
      </div>`;
  }

  function filter(status, btn) {
    // Update filter button styles
    document.querySelectorAll('.kpi-filter').forEach(b => {
      b.classList.remove('bg-primary', 'text-on-primary', 'active-filter');
      b.classList.add('bg-surface-container', 'text-secondary');
    });
    btn.classList.add('bg-primary', 'text-on-primary', 'active-filter');
    btn.classList.remove('bg-surface-container', 'text-secondary');

    // Show/hide cards
    document.querySelectorAll('.kpi-card').forEach(c => {
      c.style.display = (status === 'all' || c.dataset.status === status) ? '' : 'none';
    });
  }

  return { render, filter };
})();

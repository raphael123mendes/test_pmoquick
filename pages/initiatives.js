/**
 * pages/initiatives.js
 * Bento grid of all 4 strategic initiatives
 */

const InitiativesPage = (() => {

  const BG    = ['bg-surface-container-low', 'bg-tertiary-container', 'bg-surface-container-lowest', 'bg-on-background'];
  const SIZES = ['md:col-span-8', 'md:col-span-4', 'md:col-span-6', 'md:col-span-6'];

  function render() {
    const { initiatives, projects, kpis } = Store;

    document.getElementById('page-initiatives').innerHTML = `
      <section class="mb-10">
        <span class="text-[11px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">Strategic Portfolio</span>
        <h1 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Initiatives Status</h1>
        <p class="text-secondary leading-relaxed max-w-xl">Monitoring the progress and health of Abu Dhabi Department of Education and Knowledge's core transformation pillars.</p>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        ${initiatives.map((ini, i) => {
          const projs  = projects.filter(p => p.Parent_Init_ID === ini.Init_ID);
          const kpiIds = (ini.Linked_KPI_IDs || '').split(',').map(k => k.trim());
          const linked = kpis.filter(k => kpiIds.includes(k.KPI_ID));
          const onT    = linked.filter(k => k['Status (Formula)'] === 'Green').length;
          const isDark = i === 3;
          const bg     = BG[i];
          const size   = SIZES[i];

          return `
          <div class="${size} ${bg} p-8 rounded-xl flex flex-col justify-between min-h-[360px] cursor-pointer hover-card" onclick="App.openInitiative('${ini.Init_ID}')">
            <div>
              <div class="flex justify-between items-start mb-6">
                <span class="material-symbols-outlined text-3xl ${isDark ? 'text-white' : 'text-primary'}">${H.initIcon(ini.Init_ID)}</span>
                <span class="text-[10px] font-bold px-3 py-1 rounded-full ${isDark ? 'bg-white/20 text-white' : 'bg-surface-container-lowest/60 text-secondary'}">${ini.Init_ID}</span>
              </div>
              <h3 class="font-headline text-xl font-bold mb-3 ${isDark ? 'text-white' : ''}">${ini.Title}</h3>
              <p class="text-sm leading-relaxed mb-6 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-secondary'}">${ini.description}</p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-surface-container text-on-surface'}">${projs.length} Projects</span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-surface-container text-on-surface'}">${linked.length} KPIs</span>
              </div>
            </div>
            <div class="mt-8 space-y-4">
              <div>
                <div class="flex justify-between items-end mb-2">
                  <span class="text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-secondary'}">Delivery Progress</span>
                  <span class="font-headline text-lg font-black ${isDark ? 'text-white' : ''}">${Math.round((ini['Overall_Progress (%)'] || 0) * 100)}%</span>
                </div>
                <div class="w-full h-2 ${isDark ? 'bg-white/10' : 'bg-surface-container'} rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width:${Math.round((ini['Overall_Progress (%)'] || 0) * 100)}%"></div>
                </div>
              </div>
              <div class="flex justify-between text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-secondary'}">
                <span>${projs.length} Projects</span>
                <span>${onT}/${linked.length} KPIs On Track</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }

  return { render };
})();

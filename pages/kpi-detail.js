/**
 * pages/kpi-detail.js
 * Single KPI deep-dive: progress, trend chart, historical delta, linked initiative
 */

const KPIDetailPage = (() => {

  function render(id) {
    const { kpis, initiatives } = Store;
    const k   = kpis.find(x => x.KPI_ID === id);
    if (!k) return;
    const ini = initiatives.find(i => i.Init_ID === k.Initiative);
    const pct = H.pct(k);

    const statusColor = { Green:'#166534', Amber:'#92400e', Red:'#991b1b' }[k['Status (Formula)']] || '#475569';
    const statusBg    = { Green:'#dcfce7', Amber:'#fef9c3', Red:'#fee2e2' }[k['Status (Formula)']] || '#f1f5f9';

    // Simulate monthly trend bars (scaled from actual result)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const actual = k.Actual_Result || 0;
    const trendBars = months.map((m, i) => {
      const h = Math.min(100, actual * (0.55 + i * 0.04));
      const isCurrent = i === 6;
      return `
      <div class="flex-1 flex flex-col items-center gap-1 group">
        <div class="w-full rounded-t-sm transition-colors ${isCurrent ? 'bg-primary' : 'bg-surface-container group-hover:bg-primary/40'}"
             style="height:${h > 0 ? h : 4}%"></div>
        <span class="text-[9px] ${isCurrent ? 'text-primary font-bold' : 'text-secondary'}">${m}</span>
      </div>`;
    }).join('');

    document.getElementById('page-kpi-detail').innerHTML = `

      <!-- Header -->
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
        <div class="lg:col-span-8">
          <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-4 block">KPI · ${k.KPI_ID}</span>
          <h1 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-background leading-tight">${k.KPI_Name}</h1>
          <p class="text-secondary mt-4 leading-relaxed max-w-xl text-sm">${k.Description}</p>
        </div>
        <div class="lg:col-span-4 flex flex-col items-start lg:items-end gap-3">
          <div class="flex items-baseline gap-2">
            <span class="font-headline text-7xl font-extrabold" style="color:${statusColor}">${H.kpiValue(k)}</span>
            <span class="text-secondary font-medium text-sm">current</span>
          </div>
          <div class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
               style="background:${statusBg};color:${statusColor}">
            <span class="w-2 h-2 rounded-full" style="background:${statusColor}"></span>
            ${H.statusLabel(k['Status (Formula)'])}
          </div>
        </div>
      </header>

      <!-- Bento grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">

        <!-- Trend chart -->
        <div class="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl">
          <div class="flex justify-between items-start mb-10">
            <div>
              <h3 class="font-headline font-bold text-xl">Progress to 2026 Target</h3>
              <p class="text-secondary text-sm mt-1">Target: ${k.Target_Value}${H.isCountKPI(k) ? '' : '%'} · Current: ${H.kpiValue(k)}</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-primary"></span>
                <span class="text-xs text-secondary">Actual</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full border-2 border-dashed border-secondary-fixed-dim"></span>
                <span class="text-xs text-secondary">Target</span>
              </div>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="relative h-6 w-full bg-surface-container rounded-full overflow-hidden mb-2">
            <div class="h-full bg-primary rounded-full transition-all" style="width:${pct || 0}%"></div>
            ${pct != null && pct > 10 ? `
            <div class="absolute inset-0 flex items-center px-4">
              <span class="text-xs font-bold text-on-primary">${pct}% of target reached</span>
            </div>` : ''}
          </div>
          <div class="flex justify-between text-xs text-secondary mb-10">
            <span>0</span>
            <span>Target: ${k.Target_Value}${H.isCountKPI(k) ? '' : '%'}</span>
          </div>

          <!-- Monthly bar chart (illustrative) -->
          <p class="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">Illustrative Monthly Trajectory</p>
          <div class="relative flex items-end gap-1 h-24 border-b border-surface-container pb-1">
            <!-- Target line -->
            <div class="absolute left-0 w-full border-t border-dashed border-secondary-fixed-dim"
                 style="bottom:${pct || 0}%"></div>
            ${trendBars}
          </div>
        </div>

        <!-- Meta sidebar -->
        <div class="md:col-span-4 flex flex-col gap-4">

          <!-- Key figures -->
          <div class="bg-tertiary-fixed p-6 rounded-xl">
            <h3 class="font-headline font-bold text-base mb-6">Key Figures</h3>
            <div class="space-y-5">
              <div>
                <span class="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">2026 Target</span>
                <span class="font-headline text-3xl font-bold">${k.Target_Value}${H.isCountKPI(k) ? '' : '%'}</span>
              </div>
              <div class="h-px bg-tertiary-fixed-dim"></div>
              <div>
                <span class="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Current Result</span>
                <span class="font-headline text-3xl font-bold">${k.Actual_Result != null ? k.Actual_Result : 'Not yet measured'}</span>
              </div>
              <div class="h-px bg-tertiary-fixed-dim"></div>
              <div>
                <span class="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Gap to Target</span>
                <span class="font-headline text-3xl font-bold">
                  ${k.Actual_Result != null ? Math.abs(k.Target_Value - k.Actual_Result) : '—'}${k.Actual_Result != null && !H.isCountKPI(k) ? '%' : ''}
                </span>
              </div>
            </div>
          </div>

          <!-- Linked initiative -->
          ${ini ? `
          <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary cursor-pointer hover-card"
               onclick="App.openInitiative('${ini.Init_ID}')">
            <span class="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Linked Initiative</span>
            <h4 class="font-headline font-bold text-on-surface text-sm mb-3">${ini.Title}</h4>
            <div class="flex items-center gap-1 text-primary font-bold text-xs">
              View Initiative
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>` : ''}
        </div>
      </div>`;
  }

  return { render };
})();

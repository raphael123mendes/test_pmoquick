/**
 * pages/project-detail.js
 * Full project view: hero, timeline specs, milestone roadmap, budget
 */

const ProjectDetailPage = (() => {

  function render(id) {
    const { projects, milestones, initiatives } = Store;
    const p   = projects.find(x => x.Proj_ID === id);
    if (!p) return;
    const ms  = milestones.filter(m => m.Parent_Proj_ID === id);
    const ini = initiatives.find(i => i.Init_ID === p.Parent_Init_ID);
    const doneCount = ms.filter(m => m.Status === 'Done').length;

    document.getElementById('page-project-detail').innerHTML = `

      <!-- Hero -->
      <section class="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div class="lg:col-span-8">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span class="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-widest uppercase rounded-full">${p.Proj_ID}</span>
            ${ini ? `<button onclick="App.openInitiative('${ini.Init_ID}')" class="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">${ini.Title}</button>` : ''}
          </div>
          <h1 class="font-headline font-extrabold text-4xl md:text-5xl tracking-tight leading-tight mb-4">${p.Project_name}</h1>
          <p class="text-secondary text-base max-w-2xl leading-relaxed">${p.Project_Description}</p>
        </div>
        <div class="lg:col-span-4">
          ${p.Budget_AED ? `
          <p class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Total Budget</p>
          <p class="font-headline text-2xl font-bold text-primary mb-4">${H.fmtBudget(p.Budget_AED)}</p>` : ''}
          <div class="flex gap-3 flex-wrap mb-3">
            <div class="px-4 py-2 rounded-lg bg-surface-container-low text-center">
              <div class="text-[10px] text-secondary font-bold uppercase">Start</div>
              <div class="font-bold text-sm">${H.fmt(p.Start_Date)}</div>
            </div>
            <div class="px-4 py-2 rounded-lg bg-surface-container-low text-center">
              <div class="text-[10px] text-secondary font-bold uppercase">End</div>
              <div class="font-bold text-sm">${H.fmt(p.Due_date)}</div>
            </div>
            <div class="px-4 py-2 rounded-lg ${H.healthClass(p.Health)} text-center">
              <div class="text-[10px] font-bold uppercase">Health</div>
              <div class="font-bold text-sm">${p.Health}</div>
            </div>
          </div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-[10px] uppercase tracking-widest font-bold text-secondary">Delivery Progress</span>
            <span class="font-bold text-sm">${Math.round((p['Progress (%)'] || 0) * 100)}%</span>
          </div>
          <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full" style="width:${Math.round((p['Progress (%)'] || 0) * 100)}%"></div>
          </div>
        </div>
      </section>

      <!-- Timeline specs + Milestones -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

        <!-- Left: specs + budget -->
        <div class="md:col-span-4 flex flex-col gap-4">
          <div class="bg-surface-container-low p-6 rounded-xl">
            <h3 class="font-headline font-bold text-base mb-5 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary" style="font-size:18px">event_note</span>
              Timeline
            </h3>
            <div class="space-y-0">
              <div class="flex justify-between text-sm py-3 border-b border-surface-container">
                <span class="text-secondary">Start Date</span>
                <span class="font-bold">${H.fmt(p.Start_Date)}</span>
              </div>
              <div class="flex justify-between text-sm py-3 border-b border-surface-container">
                <span class="text-secondary">Projected End</span>
                <span class="font-bold">${H.fmt(p.Due_date)}</span>
              </div>
              <div class="flex justify-between text-sm py-3 border-b border-surface-container">
                <span class="text-secondary">Milestones</span>
                <span class="font-bold">${ms.length} Total</span>
              </div>
              <div class="flex justify-between text-sm py-3">
                <span class="text-secondary">Completed</span>
                <span class="font-bold px-2 py-0.5 rounded ${doneCount === ms.length ? 'health-green' : 'health-amber'}">${doneCount} / ${ms.length}</span>
              </div>
            </div>
          </div>

          <!-- Milestone progress bar -->
          <div class="bg-surface-container-lowest p-6 rounded-xl">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] uppercase tracking-widest font-bold text-secondary">Milestone Progress</span>
              <span class="font-headline font-bold text-lg">${ms.length ? Math.round((doneCount / ms.length) * 100) : 0}%</span>
            </div>
            <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full transition-all" style="width:${ms.length ? Math.round((doneCount / ms.length) * 100) : 0}%"></div>
            </div>
          </div>

          ${p.Budget_AED ? `
          <div class="bg-tertiary-container/50 p-6 rounded-xl">
            <h4 class="text-[10px] uppercase tracking-widest font-bold text-secondary mb-2">Budget</h4>
            <p class="font-headline text-2xl font-black text-on-background">${H.fmtBudget(p.Budget_AED)}</p>
          </div>` : ''}
        </div>

        <!-- Right: milestone roadmap -->
        <div class="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl">
          <h3 class="font-headline font-extrabold text-xl mb-8">Milestone Roadmap</h3>
          <div class="space-y-8 relative">
            <div class="milestone-line"></div>
            ${ms.map(m => `
            <div class="relative flex gap-5">
              <div class="mt-1 w-6 h-6 rounded-full ${H.milestoneDotClass(m.Status)} flex items-center justify-center z-10 shrink-0">
                ${H.milestoneIcon(m.Status)}
              </div>
              <div class="flex-1 ${m.Status === 'Planned' ? 'opacity-60' : ''}">
                <div class="flex flex-wrap justify-between items-start gap-2 mb-1">
                  <h4 class="font-headline font-bold text-sm text-on-background leading-snug">${m.Mile_ID}: ${m.Description}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${H.milestoneStatusClass(m.Status)} shrink-0">${m.Status}</span>
                </div>
                ${m.Due_Date ? `<p class="text-xs text-secondary">Due: ${H.fmt(m.Due_Date)}</p>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  return { render };
})();

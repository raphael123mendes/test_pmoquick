/**
 * pages/risks.js
 * Risk register — sorted by severity, with mitigation and linked initiative
 */

const RisksPage = (() => {

  function render() {
    const { risks, initiatives } = Store;
    const sorted = [...risks].sort((a, b) => b['Severity (1-25)'] - a['Severity (1-25)']);

    const activeIssues   = risks.filter(r => r.Status === 'Active Issue').length;
    const potentialRisks = risks.filter(r => r.Status === 'Potential Risk').length;
    const highSeverity   = risks.filter(r => r['Severity (1-25)'] >= 15).length;

    document.getElementById('page-risks').innerHTML = `

      <section class="mb-10">
        <span class="text-[11px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">Risk Register</span>
        <h1 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Risks & Issues</h1>
        <p class="text-secondary leading-relaxed max-w-xl">Active risks and issues across the strategic portfolio with severity ratings and mitigation actions.</p>
      </section>

      <!-- Summary stats -->
      <div class="grid grid-cols-3 gap-4 mb-10">
        <div class="bg-red-50 rounded-xl p-5 text-center">
          <span class="font-headline text-3xl font-black text-red-700">${activeIssues}</span>
          <p class="text-xs font-bold uppercase tracking-widest text-red-600 mt-1">Active Issues</p>
        </div>
        <div class="bg-yellow-50 rounded-xl p-5 text-center">
          <span class="font-headline text-3xl font-black text-yellow-700">${potentialRisks}</span>
          <p class="text-xs font-bold uppercase tracking-widest text-yellow-600 mt-1">Potential Risks</p>
        </div>
        <div class="bg-surface-container rounded-xl p-5 text-center">
          <span class="font-headline text-3xl font-black text-on-background">${highSeverity}</span>
          <p class="text-xs font-bold uppercase tracking-widest text-secondary mt-1">High Severity (≥15)</p>
        </div>
      </div>

      <!-- Risk cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${sorted.map(r => {
          const sev = r['Severity (1-25)'];
          const ini = initiatives.find(i => (r.Impacted_Inits || '').includes(i.Init_ID));
          return `
          <div class="bg-surface-container-lowest rounded-xl p-6 hover-card" style="border-left: 4px solid ${H.riskSeverityText(sev)}">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 mr-3">
                <span class="text-[10px] font-bold text-secondary block mb-1">${r.Risk_ID}</span>
                <h3 class="font-headline font-bold text-base text-on-background leading-snug">${r.Title}</h3>
              </div>
              <div class="px-3 py-1.5 rounded-full text-xs font-bold shrink-0 text-center"
                   style="background:${H.riskSeverityBg(sev)};color:${H.riskSeverityText(sev)}">
                <div class="font-headline text-lg font-black leading-none">${sev}</div>
                <div class="text-[9px] opacity-70">/25</div>
              </div>
            </div>

            <p class="text-sm text-secondary leading-relaxed mb-4">${r.Description}</p>

            <div class="bg-surface-container p-4 rounded-lg mb-4">
              <p class="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Mitigation</p>
              <p class="text-xs text-on-background leading-relaxed">${r.Mitigation}</p>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-[10px] font-bold px-2 py-1 rounded-full ${r.Status === 'Active Issue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                ${r.Status}
              </span>
              <div class="flex items-center gap-3 text-[10px] text-secondary font-medium">
                ${r.Impacted_KPIs ? `<span>KPIs: ${r.Impacted_KPIs}</span>` : ''}
                ${ini ? `
                <button onclick="App.openInitiative('${ini.Init_ID}')" class="text-primary font-bold hover:underline">
                  ${ini.Title} →
                </button>` : ''}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }

  return { render };
})();

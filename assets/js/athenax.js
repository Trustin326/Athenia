// AthenaX client-side demo generators (no backend needed)
const TEMPLATES = {
  policy: (topic, region, tone) => `ATHENAX POLICY BRIEF\nTopic: ${topic}\nRegion: ${region}\nTone: ${tone}\n\nExecutive Summary\n• Objective: Establish an ethical, enforceable policy for ${topic.toLowerCase()} within ${region}.\n• Principles: Safety, Transparency, Accountability, Equity.\n\nFramework\n1) Definitions & Scope\n2) Risk Classes & Controls\n3) Data & Privacy Protections\n4) Compliance & Audit Cadence\n5) Incident Response & Remedies\n\nKPIs\n• Time-to-Remediation\n• Audit Pass Rate\n• User Impact Score\n\nConclusion\nThis policy balances innovation with measurable safeguards, enabling sustainable adoption within ${region}.`,
  brief: (goal, audience, horizon) => `STRATEGIC BRIEF\nGoal: ${goal}\nAudience: ${audience}\nHorizon: ${horizon}\n\nSituation\n• Market: Consolidation in enterprise platforms; trust is the differentiator.\n• Threats: Speed-over-safety competitors; regulatory fragmentation.\n\nStrategy\n1) Lead with governance as product.\n2) Publish transparent benchmarks.\n3) Align incentives with long-horizon value.\n\nPlan\n• 0–90 days: Pilot programs, lighthouse partners.\n• 90–180 days: Standards coalition, public dashboards.\n• 6–12 months: Global rollout with certification.\n\nOutcome\nA defensible position where our frameworks become the default operating context.`,
  narrative: (theme, region, value) => `NARRATIVE ANALYSIS\nTheme: ${theme}\nRegion: ${region}\nCore Value: ${value}\n\nCultural Signals\n• Emerging sentiment favors integrity over hype.\n• Audiences reward brands that explain tradeoffs.\n\nStory Angles\n1) “Power with Integrity” — leadership through transparency.\n2) “Designing Continuity” — long-term stewardship narratives.\n3) “Human-Centered Intelligence” — calm, precise, protective.\n\nRisks & Mitigations\n• Risk: Fatigue from grand claims → Mitigation: measurable proof.\n• Risk: Policy skepticism → Mitigation: third-party verification.\n\nEditorial Line\n“Civilization evolves through wisdom.”`,
  governance: (domain, maturity, scope) => `GOVERNANCE MODEL DRAFT\nDomain: ${domain}\nMaturity: ${maturity}\nScope: ${scope}\n\nOperating Layers\n1) Principles & Eligibility Criteria\n2) Risk Grading & Controls\n3) Data Sovereignty & Privacy\n4) Audit & Monitoring\n5) Incident Disclosure & Remedy\n\nRACI\n• Board: Approve\n• Ethics Council: Advise\n• Risk & Compliance: Enforce\n• Engineering: Implement\n• Audit: Verify\n\nMetrics\n• Control Coverage\n• Time-to-Remediation\n• Residual Risk Index`,
};

function $(q){return document.querySelector(q)}
function v(id){return (document.getElementById(id)||{}).value||''}

function genPolicy(){ $('#policyOut').textContent = TEMPLATES.policy(v('policyTopic'), v('policyRegion'), v('policyTone')); }
function genBrief(){ $('#briefOut').textContent = TEMPLATES.brief(v('briefGoal'), v('briefAudience'), v('briefHorizon')); }
function genNarr(){ $('#narrOut').textContent = TEMPLATES.narrative(v('narrTheme'), v('narrRegion'), v('narrValue')); }
function genGov(){ $('#govOut').textContent = TEMPLATES.governance(v('govDomain'), v('govMaturity'), v('govScope')); }
// --- Mock API + Export to PDF (print) ---
function delay(ms){ return new Promise(res=>setTimeout(res, ms)); }

async function mockAPI(endpoint, payload){
  // Simulate latency and return structured text payloads
  await delay(500);
  const {kind, fields} = payload || {};
  switch(kind){
    case 'policy':
      return { ok:true, text: TEMPLATES.policy(fields.topic, fields.region, fields.tone) };
    case 'brief':
      return { ok:true, text: TEMPLATES.brief(fields.goal, fields.audience, fields.horizon) };
    case 'narrative':
      return { ok:true, text: TEMPLATES.narrative(fields.theme, fields.region, fields.value) };
    case 'governance':
      return { ok:true, text: TEMPLATES.governance(fields.domain, fields.maturity, fields.scope) };
    default:
      return { ok:false, text: 'Unknown endpoint' };
  }
}

async function apiPolicy(){
  const payload = { kind:'policy', fields:{ topic:v('policyTopic'), region:v('policyRegion'), tone:v('policyTone') } };
  const res = await mockAPI('/api/policy', payload);
  document.getElementById('policyOut').textContent = res.text;
}
async function apiBrief(){
  const payload = { kind:'brief', fields:{ goal:v('briefGoal'), audience:v('briefAudience'), horizon:v('briefHorizon') } };
  const res = await mockAPI('/api/brief', payload);
  document.getElementById('briefOut').textContent = res.text;
}
async function apiNarr(){
  const payload = { kind:'narrative', fields:{ theme:v('narrTheme'), region:v('narrRegion'), value:v('narrValue') } };
  const res = await mockAPI('/api/narrative', payload);
  document.getElementById('narrOut').textContent = res.text;
}
async function apiGov(){
  const payload = { kind:'governance', fields:{ domain:v('govDomain'), maturity:v('govMaturity'), scope:v('govScope') } };
  const res = await mockAPI('/api/governance', payload);
  document.getElementById('govOut').textContent = res.text;
}

// Export to PDF (via print) - opens a print-optimized window
function exportPDF(){
  const docHTML = `
  <html>
  <head>
    <title>Athenia — AthenaX Export</title>
    <style>
      body{ font-family: 'Lora', serif; }
      h1,h2{ font-family: 'Montserrat', sans-serif; }
      .export-doc{ padding:24px; }
      pre{ white-space: pre-wrap; border:1px solid #ddd; padding:10px; border-radius:8px; }
    </style>
  </head>
  <body>
    <div class="export-doc">
      <h1>Athenia — AthenaX Tools Report</h1>
      <h2>Policy Draft</h2>
      <pre>${(document.getElementById('policyOut')||{}).textContent||''}</pre>
      <h2>Strategic Brief</h2>
      <pre>${(document.getElementById('briefOut')||{}).textContent||''}</pre>
      <h2>Narrative Analysis</h2>
      <pre>${(document.getElementById('narrOut')||{}).textContent||''}</pre>
      <h2>Governance Model</h2>
      <pre>${(document.getElementById('govOut')||{}).textContent||''}</pre>
    </div>
    <script>window.onload=()=>{ window.print(); }</script>
  </body>
  </html>`;
  const w = window.open('', '_blank');
  w.document.open();
  w.document.write(docHTML);
  w.document.close();
}

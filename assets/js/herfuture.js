// HerFuture — Founder Portal Logic (client-side)
const HF = (() => {
  const v = id => (document.getElementById(id) || {}).value || '';

  function drawHalo() {
    const c = document.getElementById('hfHalo');
    if(!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height, cx = W/2, cy = H/2, R = Math.min(W,H)/2 - 18;
    const s = [
      +document.getElementById('scProblem').value,
      +document.getElementById('scSolution').value,
      +document.getElementById('scMarket').value,
      +document.getElementById('scCommit').value,
      +document.getElementById('scEthics').value
    ];
    ctx.clearRect(0,0,W,H);
    const g = ctx.createRadialGradient(cx,cy, R*0.2, cx,cy, R);
    g.addColorStop(0, 'rgba(123,108,246,0.12)');
    g.addColorStop(1, 'rgba(123,108,246,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fill();
    const segments = 5, arcSpan = Math.PI*2 / segments;
    for(let i=0;i<segments;i++){
      const score = s[i]; const pct = score/5;
      const inner = R*0.55; const outer = inner + pct*(R-inner);
      ctx.save(); ctx.shadowColor = 'rgba(123,108,246,0.6)'; ctx.shadowBlur = 28;
      for(let r=inner;r<=outer;r+=2.2){
        const alpha = 0.06 + 0.24*((r-inner)/(outer-inner+0.0001));
        ctx.strokeStyle = `rgba(123,108,246,${alpha.toFixed(3)})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        const a0 = -Math.PI/2 + i*arcSpan + 0.14;
        const a1 = -Math.PI/2 + (i+1)*arcSpan - 0.14;
        ctx.arc(cx,cy,r,a0,a1,false);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx,cy,R*0.55,0,Math.PI*2); ctx.stroke();
  }

  function computeStage() {
    const scores = [
      +document.getElementById('scProblem').value,
      +document.getElementById('scSolution').value,
      +document.getElementById('scMarket').value,
      +document.getElementById('scCommit').value,
      +document.getElementById('scEthics').value
    ];
    const total = scores.reduce((a,b)=>a+b,0);
    let stage, note;
    if(total <= 8) { stage = 'Emerging Narrative Founder'; note  = 'Your clarity is forming. Let’s refine your thesis and audience.'; }
    else if(total <= 15) { stage = 'Seed Readiness'; note  = 'Your direction is strong. Ready for pilot capital + mentorship.'; }
    else { stage = 'Growth Acceleration'; note  = 'You’re leading a scalable thesis. Capital + amplification recommended.'; }
    document.getElementById('hfStage').textContent = `Stage Recommendation: ${stage}`;
    document.getElementById('hfScores').textContent = `Scores (0–5):\n• Problem Clarity: ${scores[0]}\n• Solution Fit: ${scores[1]}\n• Market Shape: ${scores[2]}\n• Founder Commitment: ${scores[3]}\n• Ethics & Equity: ${scores[4]}\n\n${note}`;
    mentorAndCapital(stage);
    return stage;
  }

  function mentorAndCapital(stage){
    const industry = v('cIndustry'); const traction = v('cTraction');
    const why = v('sigWhy').trim(); const who = v('sigFor').trim();
    const mentors = [];
    if(industry.includes('AI')) mentors.push({name:'Dr. Mira Alvarez', why:'AI governance & enterprise scaling'});
    if(industry.includes('Climate')) mentors.push({name:'Noor Rahman', why:'Sustainable infra & climate finance'});
    if(industry.includes('Health')) mentors.push({name:'Aria Patel', why:'Regulatory navigation & clinical pilots'});
    if(mentors.length<2) mentors.push({name:'J. Chen', why:'Go-to-market and B2B partnerships'});
    if(mentors.length<3) mentors.push({name:'S. Laurent', why:'Narrative positioning for fundraising'});
    const mtxt = mentors.map(m=>`• ${m.name} — ${m.why}`).join('\n') +
      (why||who ? `\n\nContext Signals:\n• Why: ${why || '—'}\n• For: ${who || '—'}` : '');
    document.getElementById('hfMentors').textContent = mtxt;
    let path = '';
    if(stage === 'Emerging Narrative Founder'){
      path = 'Grants • Founder Fellowships • Lightweight angel checks • Customer discovery sprints.';
      if(traction==='Idea') path += ' Focus: clarity workshops + problem interviews.';
    } else if(stage === 'Seed Readiness'){
      path = 'Angels • Seed funds • Corporate pilots • Revenue-backed instruments.';
      if(traction==='MVP' || traction==='Pilots') path += ' Focus: lighthouse customer + proof metrics.';
    } else {
      path = 'Seed+ / Early A • Strategic co-investors • Enterprise partnerships.';
      if(traction==='Revenue' || traction==='Scaling') path += ' Focus: repeatable sales motion + unit economics.';
    }
    document.getElementById('hfCapital').textContent = path;
  }

  function generateProfile(){
    const name = v('fName'), company = v('cName');
    const vision = v('cVision'), problem = v('cProblem');
    const stage = computeStage();
    const strengths = [];
    if(vision.length>40) strengths.push('Strong articulation of vision');
    if(problem.length>80) strengths.push('Problem & solution clarity');
    if(v('cTraction')==='Revenue' || v('cTraction')==='Scaling') strengths.push('Demonstrated traction');
    const out = [
      `Founder Profile: ${name || '—'}`,
      `Company: ${company || '—'}`,
      `Stage: ${stage}`,
      `Key Strengths: ${strengths.length? strengths.join(' • ') : 'Clarity in progress'}`,
      `Recommended Strategic Priorities:`,
      `• Sharpen the thesis → audience → value proof`,
      `• Acquire lighthouse customer(s)`,
      `• Define 6–12 month outcome metrics`
    ].join('\n');
    document.getElementById('hfScores').textContent = out;
    mentorAndCapital(stage);
    drawHalo();
    document.getElementById('hfScores').scrollIntoView({behavior:'smooth', block:'center'});
  }

  function exportPDF(){
    const safe = id => (document.getElementById(id)||{}).value || '';
    const docHTML = `
      <html><head><title>HerFuture — Founder Profile</title>
      <style>
        body{ font-family: 'Lora', serif; }
        h1,h2{ font-family:'Montserrat', sans-serif; }
        .wrap{ padding:24px; }
        pre{ white-space:pre-wrap; border:1px solid #ddd; padding:10px; border-radius:8px; }
      </style>
      </head><body>
      <div class="wrap">
        <h1>HerFuture — Founder Profile</h1>
        <h2>Identity</h2>
        <pre>Name: ${safe('fName')}\nRegion: ${safe('fRegion')}\nLinkedIn: ${safe('fLinkedIn')}\nWebsite: ${safe('fWebsite')}</pre>
        <h2>Company</h2>
        <pre>Name: ${safe('cName')}\nIndustry: ${safe('cIndustry')}\nModel: ${safe('cModel')}\nTraction: ${safe('cTraction')}</pre>
        <h2>Vision & Thesis</h2>
        <pre>${safe('cVision')}\n\n${safe('cProblem')}</pre>
        <h2>Soft Power Signature</h2>
        <pre>My work exists because: ${safe('sigWhy')}\nI build for those who: ${safe('sigFor')}</pre>
        <h2>Readiness & Recommendations</h2>
        <pre>${(document.getElementById('hfScores')||{}).textContent || ''}</pre>
        <h2>Mentors & Capital</h2>
        <pre>${(document.getElementById('hfMentors')||{}).textContent || ''}\n\n${(document.getElementById('hfCapital')||{}).textContent || ''}</pre>
      </div>
      <script>window.onload=()=>window.print()</script>
      </body></html>
    `;
    const w = window.open('', '_blank');
    w.document.open(); w.document.write(docHTML); w.document.close();
  }

  function init(){ drawHalo(); computeStage(); }
  return { drawHalo, computeStage, generateProfile, exportPDF, init };
})();
window.addEventListener('DOMContentLoaded', HF.init);

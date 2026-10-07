window.PredictionGame = (() => {
  const base = 'https://rallirahvas.ee/public/conversations/saaremaa-ralli-2026';
  const core = window.GameCore;
  let busy = false, predictions = {}, results = {}, errors = [], lastChecked = '', selected = 'SS1', focusedPlayer = null;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function read(url, json = true) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, {signal:controller.signal, cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await (json ? response.json() : response.text());
    } finally { clearTimeout(timer); }
  }
  const total = (prediction, result) => core.score(prediction, result).reduce((sum,r) => sum+r.points,0);
  function progressChart(players, stages) {
    if (!players.some(p => p.scores.some(s => s !== null))) return '<p class="game-caption">The graph will appear when predictions and results are available.</p>';
    const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];
    const names = Object.keys(predictions);
    const ceiling = 80;
    const x = index => 45 + index * 62;
    const y = points => 240 - points / ceiling * 210;
    const grid = Array.from({length:5}, (_,i) => {
      const value = ceiling * i / 4;
      return `<line x1="45" x2="541" y1="${y(value)}" y2="${y(value)}" class="chart-grid"/><text x="36" y="${y(value)+4}" text-anchor="end">${value}</text>`;
    }).join('');
    const lines = players.map(p => {
      const color = colors[names.indexOf(p.name) % colors.length];
      let path = '', connected = false;
      const dots = p.scores.map((score,i) => {
        if (score === null) { connected = false; return ''; }
        path += `${connected ? 'L' : 'M'}${x(i)},${y(score)} `;
        connected = true;
        return `<circle cx="${x(i)}" cy="${y(score)}" r="4" fill="${color}"><title>${esc(p.name)} · ${stages[i]} · ${score} points</title></circle>`;
      }).join('');
      return `<g class="chart-series" data-player="${esc(p.name)}"><path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}</g>`;
    }).join('');
    return `<div class="progress-chart"><svg viewBox="0 0 565 278" role="img" aria-labelledby="chart-title chart-description"><title id="chart-title">Prediction score after each stage</title><desc id="chart-description">${players.map(p=>esc(p.name)+': '+(p.current ?? 'No')+' points at the latest available stage').join('. ')}. Missing results leave gaps. Exact stage values are in the table below.</desc>${grid}${stages.map((s,i)=>`<text x="${x(i)}" y="263" text-anchor="middle">${s}</text>`).join('')}${lines}</svg></div><div class="chart-legend">${names.map((name,i)=>`<button type="button" data-player="${esc(name)}" aria-pressed="false"><i style="background:${colors[i%colors.length]}" aria-hidden="true"></i>${esc(name)}</button>`).join('')}</div>`;
  }
  function applyPlayerFocus() {
    if (focusedPlayer !== null && !Object.hasOwn(predictions, focusedPlayer)) focusedPlayer = null;
    document.querySelectorAll('.chart-series').forEach(series => {
      series.style.opacity = focusedPlayer === null || series.dataset.player === focusedPlayer ? '1' : '0.22';
    });
    document.querySelectorAll('.chart-legend button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.player === focusedPlayer));
    });
  }
  function draw() {
    const root = document.querySelector('#prediction-game');
    if (!root) return;
    const stages = Array.from({length:9}, (_,i) => `SS${i+1}`);
    const available = stages.filter(s=>results[s]);
    const players = Object.entries(predictions).map(([name,picks]) => ({name,picks,scores:stages.map(s=>picks.length === 5 && results[s] ? total(picks,results[s].drivers) : null)}));
    const latestStage = available.at(-1);
    players.forEach(p=>p.current=latestStage ? p.scores[stages.indexOf(latestStage)] : null);
    players.sort((a,b)=>(b.current ?? -1)-(a.current ?? -1));
    root.innerHTML = `<div class="intro"><h1>Prediction game</h1><p>Saaremaa Rally 2026 · Overall standings after SS1–SS9 · Top five</p></div>
      <div class="game-toolbar"><p role="status">${busy?'Updating results…':`Checked ${esc(lastChecked || '—')}`} · ${available.length}/9 results</p><button id="game-refresh" ${busy?'disabled':''}>Refresh results</button></div>
      ${errors.length?`<p class="game-notice">${errors.map(esc).join(' ')}</p>`:''}
      <p class="game-caption">One prediction per player for the whole rally. Scores reflect the overall standings at that point, out of 80. The score after SS9 decides the winner. Results load when you open this view. Reload the page or tap Refresh results to update.</p>
      <h2>Leaderboard${latestStage ? ` · After ${latestStage}` : ''}</h2><div class="table-scroll"><table><thead><tr><th>Rank</th><th>Player</th><th>Score / 80</th></tr></thead><tbody>${players.map((p,i)=>`<tr><td>${p.current === null ? '—' : players.findIndex(x=>x.current===p.current)+1}</td><th>${esc(p.name)}${p.picks.length ? '' : ' <span class="game-caption">· Awaiting prediction</span>'}</th><td>${p.current ?? '—'}</td></tr>`).join('')}</tbody></table></div>
      <h2>Leaderboard progression</h2><p class="game-caption">Score against the overall standings after each stage, from 0 to 80. Scores can rise or fall; missing results leave gaps. Tap a player below to focus their line; tap again to restore all lines.</p>${progressChart(players, stages)}
      <h2>Points after each stage</h2><p class="game-caption">Each cell is that stage’s score, out of 80. Swipe the table sideways on your phone.</p><div class="table-scroll" tabindex="0" aria-label="Stage points"><table><thead><tr><th>Player</th>${stages.map(s=>`<th>${s}</th>`).join('')}</tr></thead><tbody>${players.map(p=>`<tr><th>${esc(p.name)}</th>${p.scores.map(n=>`<td>${n??'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <h2>Check the calculation</h2><label for="game-stage">Overall standings after </label><select id="game-stage">${stages.map(s=>`<option ${s===selected?'selected':''}>${s}</option>`).join('')}</select><div id="game-calculation"></div>
      <details class="game-rules"><summary>Predictions & scoring rules</summary><p>Actual positions 1–5 are worth 25, 18, 15, 12 and 10 points. Exact position: full points. One place off: half points. Two or more places off: 5 points. Driver not predicted: 0 points.</p>${players.map(p=>`<p><b>${esc(p.name)}:</b> ${p.picks.length ? p.picks.map(esc).join(' → ') : 'Awaiting prediction'}</p>`).join('')}<p>Using the five-driver rules from your Colab example. Live standings may be provisional and scores can change after corrections.</p></details>
      <p class="game-caption"><a href="https://rallirahvas.ee/app/conversation/saaremaa-ralli-2026/results" target="_blank" rel="noopener">Results source: Rallirahvas ↗</a> · <a href="data/README.md">Manual file instructions</a></p>`;
    document.querySelector('#game-refresh').onclick = refresh;
    document.querySelector('#game-stage').onchange = e => {selected=e.target.value; calculation();};
    document.querySelectorAll('.chart-legend button').forEach(button => {
      button.onclick = () => {
        focusedPlayer = focusedPlayer === button.dataset.player ? null : button.dataset.player;
        applyPlayerFocus();
      };
    });
    applyPlayerFocus();
    calculation();
  }
  function calculation() {
    const root = document.querySelector('#game-calculation');
    const result = results[selected];
    if (!result) {root.textContent='No standings available yet. This stage is not scored.';return;}
    root.innerHTML=`<p class="game-caption">${esc(result.source)} · ${esc(result.status)}${result.synced ? ` · Source updated ${esc(result.synced)}`:''}</p><ol>${result.drivers.map(d=>`<li>${esc(d)}</li>`).join('')}</ol>${Object.entries(predictions).filter(([,picks])=>picks.length === 5).map(([name,picks])=>`<details class="score-details"><summary>${esc(name)} · ${total(picks,result.drivers)} points</summary><div class="table-scroll"><table><thead><tr><th>Driver</th><th>Actual</th><th>Predicted</th><th>Points</th></tr></thead><tbody>${core.score(picks,result.drivers).map(r=>`<tr><td>${esc(r.driver)}</td><td>${r.actual}</td><td>${r.predicted??'Not picked'}</td><td>${r.points}</td></tr>`).join('')}</tbody></table></div></details>`).join('')}`;
  }
  async function refresh() {
    if(busy) return;
    busy=true; errors=[]; draw();
    let fallback={};
    const local = await Promise.allSettled([read('data/saaremaa/predictions.txt',false),read('data/saaremaa/results.txt',false)]);
    try {
      if(local[0].status!=='fulfilled')throw new Error('Predictions could not be loaded.');
      predictions=core.parse(local[0].value);
      if(!Object.keys(predictions).length)throw new Error('No predictions entered.');
    } catch(e){predictions={};errors.push(`Predictions: ${e.message}`);}
    try {if(local[1].status==='fulfilled')fallback=core.parse(local[1].value,true);else throw new Error('File unavailable');}catch(e){errors.push(`Manual results: ${e.message}`);}
    const fresh={};
    let failures=0;
    try {
      const [feed,entries] = await Promise.all([read(`${base}/results`),read(`${base}/entries`)]);
      const stages = feed.results?.all_stages || feed.results?.stages || feed.all_stages || [];
      for(let number=1;number<=9;number++) {
        const code=`SS${number}`,stage=stages.find(s=>s.code===code);
        if(!stage || stage.state==='upcoming' || stage.state==='cancelled' || stage.cancelled_manual)continue;
        try {
          const data=await read(`${base}/results/standings?stage=${encodeURIComponent(stage.id)}`);
          fresh[code]={drivers:core.overall(data,entries.entries),source:'Live feed',status:feed.results?.finalized?'Finalized rally':'Provisional standings',synced:feed.synced_at};
        } catch {failures++;}
      }
    } catch { failures=9; }
    for(let n=1;n<=9;n++) {
      const code=`SS${n}`;
      if(!fresh[code] && fallback[code])fresh[code]={drivers:fallback[code],source:'Manual fallback',status:'Repository result'};
      else if(!fresh[code] && results[code])fresh[code]={...results[code],source:'Cached result',status:'Not refreshed — may be outdated'};
    }
    results=fresh;
    if(failures)errors.push('Some live results could not be retrieved. Available manual results are used for those stages.');
    lastChecked=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Tallinn',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());
    busy=false;draw();
  }
  function show(){draw();return refresh();}
  return {show};
})();

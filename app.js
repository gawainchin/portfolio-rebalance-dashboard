function actionClass(action) {
  return {
    exit: 'action-exit',
    cut: 'action-cut',
    trim: 'action-trim',
    keep: 'action-keep',
    add: 'action-add',
  }[action] || 'action-keep';
}

function actionLabel(action) {
  return {
    exit: 'Exit',
    cut: 'Cut',
    trim: 'Trim',
    keep: 'Keep',
    add: 'Add / build',
  }[action] || action;
}

function renderHero(hero) {
  document.querySelector('.eyebrow').textContent = hero.eyebrow;
  document.querySelector('h1').textContent = hero.title;
  document.querySelector('.subhead').textContent = hero.subhead;
  document.querySelector('.hero-card').innerHTML = hero.metrics
    .map(
      (metric) => `
        <div class="metric">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
        </div>
      `
    )
    .join('');
}

function renderSummary(summary) {
  document.querySelector('.bullet-list').innerHTML = summary.map((item) => `<li>${item}</li>`).join('');
}

function renderStance(stance) {
  document.querySelector('.stance-value').textContent = stance.recommendation;
  document.querySelector('.stance-box p').textContent = stance.body;
}

function renderBars(containerId, items, useTarget = false) {
  const container = document.getElementById(containerId);
  const rows = items
    .map((item) => ({ name: item.name, weight: useTarget ? item.target : item.weight }))
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const max = Math.max(...rows.map((item) => item.weight));
  container.innerHTML = rows
    .map(
      (item) => `
        <div class="bar-row">
          <div class="bar-meta">
            <span>${item.name}</span>
            <span>${item.weight.toFixed(2)}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${(item.weight / max) * 100}%"></div>
          </div>
        </div>
      `
    )
    .join('');
}

function renderBuckets(bucketDescriptions, currentBuckets, targetBuckets) {
  const container = document.getElementById('bucketCompare');
  const names = Object.keys(targetBuckets);
  container.innerHTML = names
    .map((name) => `
      <article class="bucket-card">
        <h3>${name}</h3>
        <p>${bucketDescriptions[name]}</p>
        <div class="bucket-metrics">
          <div>
            <span>Current</span>
            <strong>${(currentBuckets[name] || 0).toFixed(1)}%</strong>
          </div>
          <div>
            <span>Target</span>
            <strong>${(targetBuckets[name] || 0).toFixed(1)}%</strong>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function renderTable(holdings) {
  const tbody = document.getElementById('holdingsTable');
  tbody.innerHTML = holdings
    .map(
      (h) => `
        <tr>
          <td data-label="Holding"><strong>${h.name}</strong><br /><span style="color: var(--muted); font-size: 12px;">${h.bucket}</span></td>
          <td data-label="Current %">${h.weight ? h.weight.toFixed(2) + '%' : '—'}</td>
          <td data-label="Target %">${h.target ? h.target.toFixed(2) + '%' : '0.00%'}</td>
          <td data-label="Action"><span class="action-pill ${actionClass(h.action)}">${actionLabel(h.action)}</span></td>
          <td data-label="Rationale">${h.rationale}</td>
        </tr>
      `
    )
    .join('');
}

function renderLists(holdings) {
  const cuts = holdings.filter((h) => ['exit', 'cut'].includes(h.action));
  const trims = holdings.filter((h) => h.action === 'trim');
  const keeps = holdings.filter((h) => ['keep', 'add'].includes(h.action));

  document.getElementById('cutsList').innerHTML = cuts.map((h) => `<li><strong>${h.name}</strong> — ${h.rationale}</li>`).join('');
  document.getElementById('trimList').innerHTML = trims.map((h) => `<li><strong>${h.name}</strong> — ${h.rationale}</li>`).join('');
  document.getElementById('keepList').innerHTML = keeps.map((h) => `<li><strong>${h.name}</strong> — ${h.rationale}</li>`).join('');
}

function renderSimpleList(selector, items) {
  document.querySelector(selector).innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function renderScenarioMap(items) {
  const container = document.getElementById('scenarioMap');
  container.innerHTML = items
    .map(
      (item) => `
        <article class="scenario-card">
          <h3>${item.name}</h3>
          <div class="scenario-drawdown">Expected drawdown: ${item.drawdown}</div>
          <p><strong>Trigger:</strong> ${item.trigger}</p>
          <ul>
            ${item.bucketMoves.map((move) => `<li>${move}</li>`).join('')}
          </ul>
          <p>${item.damage}</p>
        </article>
      `
    )
    .join('');
}

async function init() {
  const response = await fetch('./data.json');
  const data = await response.json();

  renderHero(data.hero);
  renderSummary(data.summary);
  renderStance(data.stance);
  renderBars('currentAllocation', data.holdings, false);
  renderBars('targetAllocation', data.holdings, true);
  renderBuckets(data.bucketDescriptions, data.currentBuckets, data.targetBuckets);
  renderTable(data.holdings);
  renderLists(data.holdings);
  renderScenarioMap(data.scenarioMap);
  renderSimpleList('#rulesList', data.rules);
  renderSimpleList('#deploymentList', data.deployment);
}

init().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML('beforeend', '<div style="padding:20px;color:#ff9b9b;">Failed to load dashboard data.</div>');
});

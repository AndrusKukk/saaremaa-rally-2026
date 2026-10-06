// Add optional details to any stage:
// leaveAt: '2026-10-10T11:15:00+03:00',
// videos: ['https://www.youtube.com/watch?v=VIDEO_ID'],
// parking: 'https://maps.google.com/...', spectating: 'https://waze.com/ul?...'
// Departure times describe when to leave FOR that stage. Always include a timezone.
const days = {
  friday: { label: 'Friday', date: '2026-10-09', displayDate: '09 October', description: 'Into the evening.', stages: [
    {
      id: 1, time: '18:15', name: 'Vanalõve', distance: '11.78', showStageLinks: false,
      leaveAt: '2026-10-09T17:03:00+03:00',
      departureLabel: 'Latest departure from home · Kuressaare',
      travel: { drivingMinutes: 32, walkingMinutes: 10, earlyArrivalMinutes: 30 },
      parking: 'https://www.google.com/maps/search/?api=1&query=58.4059722,22.8793889',
      spectating: 'https://www.google.com/maps/search/?api=1&query=58.4022500,22.8765278',
      parkingWaze: 'https://www.waze.com/ul?ll=58.4059722,22.8793889&z=17',
      spectatingWaze: 'https://www.waze.com/ul?ll=58.4022500,22.8765278&z=17',
    },
    { id: 2, time: '18:58', name: 'Vaivere', distance: '5.81' },
    { id: 3, time: '20:25', name: 'Kuressaare linn', distance: '1.61', note: 'City stage' },
  ] },
  saturday: { label: 'Saturday', date: '2026-10-10', displayDate: '10 October', description: 'A full day on the island.', stages: [
    {
      id: 4, time: '08:30', name: 'Karala', distance: '11.99', showStageLinks: false,
      leaveAt: '2026-10-10T06:30:00+03:00',
      departureLabel: 'Latest departure · Metsaääre, Kuusiku',
      showDepartureLinks: false,
      travel: { drivingMinutes: 65, walkingMinutes: 20, earlyArrivalMinutes: 35 },
      stop: {
        drivingMinutes: 30,
        label: 'Arrive at Aia 54, Kuressaare · Leave for SS4 parking',
        maps: 'https://www.google.com/maps/search/?api=1&query=Aia+54%2C+Kuressaare',
        waze: 'https://www.waze.com/ul?q=Aia%2054%2C%20Kuressaare',
      },
      parking: 'https://www.google.com/maps/search/?api=1&query=58.2964444,21.9491389',
      parkingWaze: 'https://www.waze.com/ul?ll=58.2964444,21.9491389&z=17',
      spectating: 'https://www.google.com/maps/search/?api=1&query=58.2907778,21.9676389',
      spectatingWaze: 'https://www.waze.com/ul?ll=58.2907778,21.9676389&z=17',
    },
    { id: 5, time: '09:18', name: 'Undva 1', distance: '22.75' },
    { id: 6, time: '12:06', name: 'Kaugatoma 1', distance: '10.65' },
    {
      id: 7, time: '13:07', name: 'Undva 2', distance: '22.75',
      showStageLinks: false,
      parking: 'https://www.google.com/maps/search/?api=1&query=58.4424722,21.9585556',
      parkingWaze: 'https://www.waze.com/ul?ll=58.4424722,21.9585556&z=17',
      spectating: 'https://www.google.com/maps/search/?api=1&query=58.4442778,21.9553889',
      spectatingWaze: 'https://www.waze.com/ul?ll=58.4442778,21.9553889&z=17',
      kihelkonna: 'https://www.google.com/maps/search/?api=1&query=58.3594722,22.0378333',
      kihelkonnaWaze: 'https://www.waze.com/ul?ll=58.3594722,22.0378333&z=17',
      earlyArrivalMinutes: 30,
      journey: [
        { label: 'Latest departure from SS4 spectating point · Walk to parking', minutes: 25, activity: 'walk' },
        { label: 'Arrive at SS4 parking · Drive to Kihelkonna', minutes: 10, activity: 'drive', destination: 'kihelkonna' },
        { label: 'Kihelkonna shopping and extrusion', minutes: 15, activity: 'stop' },
        { label: 'Leave Kihelkonna · Drive to SS7 parking', minutes: 15, activity: 'drive', destination: 'parking' },
        { label: 'Arrive at SS7 parking spot, start walking', minutes: 5, activity: 'walk', destination: 'spectating' },
      ],
    },
    { id: 8, time: '15:40', name: 'Kaugatoma 2', distance: '10.65' },
    {
      id: 9, time: '16:36', name: 'Karujärve', distance: '17.10',
      showStageLinks: false,
      parking: 'https://www.google.com/maps/search/?api=1&query=58.3908056,22.2112222',
      parkingWaze: 'https://www.waze.com/ul?ll=58.3908056,22.2112222&z=17',
      spectating: 'https://www.google.com/maps/search/?api=1&query=58.3998611,22.2190556',
      spectatingWaze: 'https://www.waze.com/ul?ll=58.3998611,22.2190556&z=17',
      earlyArrivalMinutes: 30, // Assumed to match SS7; adjust if needed.
      journey: [
        { label: 'Latest departure from SS7 spectating point · Walk to parking', minutes: 5, activity: 'walk' },
        { label: 'Arrive at SS7 parking · Drive to SS9 parking', minutes: 35, activity: 'drive', destination: 'parking' },
        { label: 'Arrive at SS9 parking spot, start walking', minutes: 25, activity: 'walk', destination: 'spectating' },
      ],
    },
  ] },
};
const plannedStages = new Set([1, 3, 4, 7, 9]);
const additionalEvents = {
  friday: [
    { time: '17:30', label: 'Opening ceremony · Kuressaare', code: '⚑' },
    { time: '19:18', label: 'Service A · Kuressaare', code: '—', detail: '30 min' },
    { time: '20:40', label: 'Parc fermé in', code: '—' },
  ],
  saturday: [
    { time: '07:05', label: 'Service B · Kuressaare', code: '—', detail: '30 min' },
    { time: '08:00', label: 'Workday starts, first beer', planned: true },
    { time: '10:18', label: 'Service C · Kuressaare', code: '—', detail: '50 min' },
    { time: '14:07', label: 'Service D · Kuressaare', code: '—', detail: '40 min' },
  ],
};
const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Tallinn', hour: '2-digit', minute: '2-digit', hour12: false });
const dateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit' });
const timestamp = (day, time) => Date.parse(`${day.date}T${time}:00+03:00`);
function buildEvents(key) {
  const day = days[key];
  const events = additionalEvents[key].map((e, i) => ({ ...e, id: `${key}-info-${i}`, at: timestamp(day, e.time), planned: e.planned ?? false }));
  for (const stage of day.stages) {
    const planned = plannedStages.has(stage.id);
    events.push({ id: `stage-${stage.id}`, at: timestamp(day, stage.time), code: `SS${stage.id} Start`, label: stage.name, detail: `${stage.distance} km`, planned, stage });
    if (stage.journey) {
      const arrival = timestamp(day, stage.time) - stage.earlyArrivalMinutes * 60000;
      let at = arrival - stage.journey.reduce((total, leg) => total + leg.minutes, 0) * 60000;
      stage.journey.forEach((leg, index) => {
        events.push({ id: `journey-${stage.id}-${index}`, at, label: leg.label, detail: `${leg.minutes} min ${leg.activity}`, planned, url: leg.destination ? stage[leg.destination] : undefined, wazeUrl: leg.destination ? stage[`${leg.destination}Waze`] : undefined, linkLabel: { parking: 'Parking', spectating: 'Spectating', kihelkonna: 'Kihelkonna' }[leg.destination] });
        at += leg.minutes * 60000;
      });
      events.push({ id: `arrive-${stage.id}`, at: arrival, label: `SS${stage.id} · Arrive at spectating area`, detail: `${stage.earlyArrivalMinutes} min early`, planned });
      continue;
    }
    if (!stage.leaveAt || !Number.isFinite(Date.parse(stage.leaveAt))) continue;
    const departure = Date.parse(stage.leaveAt);
    events.push({ id: `leave-${stage.id}`, at: departure, code: 'GO', label: stage.departureLabel || `Leave for SS${stage.id}`, detail: stage.travel ? `${stage.stop?.drivingMinutes ?? stage.travel.drivingMinutes} min drive` : '', planned, url: stage.showDepartureLinks === false ? undefined : (stage.stop ? stage.stop.maps : stage.parking), wazeUrl: stage.showDepartureLinks === false ? undefined : (stage.stop ? stage.stop.waze : stage.parkingWaze), linkLabel: stage.stop ? 'Aia 54' : 'Parking' });
    if (stage.stop && stage.travel) {
      events.push({ id: `stop-${stage.id}`, at: departure + stage.stop.drivingMinutes * 60000, label: stage.stop.label, detail: `${stage.travel.drivingMinutes - stage.stop.drivingMinutes} min drive`, planned, url: stage.parking, wazeUrl: stage.parkingWaze, linkLabel: 'Parking' });
    }
    if (stage.travel) {
      const parking = departure + stage.travel.drivingMinutes * 60000;
      events.push({ id: `parking-${stage.id}`, at: parking, code: 'P', label: 'Arrive at parking spot, start walking', detail: `${stage.travel.walkingMinutes} min walk`, planned, url: stage.spectating, wazeUrl: stage.spectatingWaze, linkLabel: 'Spectating' });
      events.push({ id: `arrive-${stage.id}`, at: parking + stage.travel.walkingMinutes * 60000, code: 'ON SITE', label: `SS${stage.id} · Arrive at spectating area`, detail: `${stage.travel.earlyArrivalMinutes} min early`, planned });
    }
  }
  return events.sort((a, b) => a.at - b.at);
}
const eventDays = Object.fromEntries(Object.keys(days).map(key => [key, buildEvents(key)]));
const allEvents = Object.values(eventDays).flat();
const main = document.querySelector('#main');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#day-menu');
function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open day menu'); }
toggle.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close day menu' : 'Open day menu'); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
function addLink(container, label, value) {
  let url; try { url = new URL(value); } catch { return; }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  const a = document.createElement('a'); a.href = url.href; a.textContent = label; a.target = '_blank'; a.rel = 'noopener noreferrer'; container.append(a);
}
function render() {
  main.innerHTML = `<div class="intro" id="home"><h1>Your rally weekend</h1><p>9–10 October 2026 · Saaremaa</p></div><div class="live-panel"><div class="next-up"><span class="next-up-label">Next up:</span><span id="next-event"></span></div></div><div class="schedule">${Object.entries(days).map(([key, day]) => `<section id="${key}" class="day" aria-labelledby="${key}-title"><h2 id="${key}-title">${day.label}, ${day.displayDate} 2026</h2><ol class="events">${eventDays[key].map(e => `<li id="${e.id}" class="event ${e.planned ? 'planned' : 'informational'}"><time datetime="${new Date(e.at).toISOString()}">${clock.format(e.at)}</time><div class="event-content"><span class="event-label">${e.stage ? `SS${e.stage.id} Start · ` : ''}${e.label}</span>${e.planned ? '<span class="sr-only"> — Your plan</span>' : ''}<div class="event-links"></div></div><span class="event-detail">${e.detail || ''}</span></li>`).join('')}</ol></section>`).join('')}</div>`;
  for (const e of allEvents) {
    const links = document.querySelector(`#${e.id} .event-links`);
    if (e.url) addLink(links, `${e.linkLabel} · Maps ↗`, e.url);
    if (e.wazeUrl) addLink(links, `${e.linkLabel} · Waze ↗`, e.wazeUrl);
    if (e.stage && e.stage.showStageLinks !== false) {
      if (e.stage.parking) addLink(links, 'Parking · Maps ↗', e.stage.parking);
      if (e.stage.parkingWaze) addLink(links, 'Parking · Waze ↗', e.stage.parkingWaze);
      if (e.stage.spectating) addLink(links, 'Spectating · Maps ↗', e.stage.spectating);
      if (e.stage.spectatingWaze) addLink(links, 'Spectating · Waze ↗', e.stage.spectatingWaze);
      (e.stage.videos || []).forEach((url, i) => addLink(links, `▷ Clip ${i + 1}`, url));
    }
  }
  updateTime();
}
function selectedDay() {
  return Object.hasOwn(days, location.hash.slice(1)) ? location.hash.slice(1) : 'friday';
}
function updateTime(now = new Date()) {
  const next = eventDays[selectedDay()].find(e => e.planned && e.at > now.getTime());
  const status = document.querySelector('#next-event');
  status.textContent = next ? `${dateFormatter.format(next.at)} · ${clock.format(next.at)} · ${next.stage ? `SS${next.stage.id} Start · ` : ''}${next.label}` : 'All planned checkpoints have passed';
  for (const e of allEvents) {
    const row = document.getElementById(e.id);
    const active = e === next && dateFormatter.format(e.at) === dateFormatter.format(now);
    row.classList.toggle('next', active);
    row.classList.toggle('reached', e.at <= now.getTime());
    if (active) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current');
  }
  document.querySelector('.now-marker')?.remove();
  const todayKey = Object.keys(days).find(key => days[key].date === dateFormatter.format(now));
  if (!todayKey || todayKey !== selectedDay()) return;
  const marker = document.createElement('li'); marker.className = 'now-marker'; marker.textContent = `NOW ${clock.format(now)}`;
  const following = eventDays[todayKey].find(e => e.at > now.getTime());
  const list = document.querySelector(`#${todayKey} .events`);
  list.insertBefore(marker, following ? document.getElementById(following.id) : null);
}
function navigate() {
  closeMenu();
  const key = selectedDay();
  for (const dayKey of Object.keys(days)) document.getElementById(dayKey).hidden = dayKey !== key;
  document.querySelector('h1').textContent = `${days[key].label} · Logistical Plan`;
  document.querySelector('.intro p').textContent = `${days[key].displayDate} 2026 · Saaremaa`;
  document.title = `${days[key].label} · Saaremaa Rally 2026`;
  for (const a of menu.querySelectorAll('a')) { if (a.hash === `#${key}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
  updateTime();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);
setInterval(updateTime, 15000);
window.addEventListener('focus', () => updateTime());
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateTime(); });
render();
navigate();

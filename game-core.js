/* Pure parsing and scoring; no network or DOM required. */
window.GameCore = (() => {
  const points = [25, 18, 15, 12, 10];
  const normalize = s => s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function parse(text, results = false) {
    const output = {};
    text.split(/\r?\n/).forEach((line, index) => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const colon = line.indexOf(':');
      if (colon < 1) throw new Error(`Line ${index + 1}: expected Name: driver, driver, driver, driver, driver`);
      const key = line.slice(0, colon).trim();
      const value = line.slice(colon + 1).trim();
      const drivers = !results && !value ? [] : value.split(',').map(s => s.trim());
      if (results && !/^SS[1-9]$/.test(key)) throw new Error(`Invalid stage: ${key}. Use SS1–SS9.`);
      if (Object.hasOwn(output, key) || (drivers.length !== 0 && drivers.length !== 5) || (results && drivers.length !== 5) || drivers.some(s => !s) || new Set(drivers.map(normalize)).size !== drivers.length) throw new Error(`Line ${index + 1}: use a unique name and five different drivers.`);
      Object.defineProperty(output, key, {value:drivers, enumerable:true});
    });
    return output;
  }
  function score(prediction, result) {
    return result.map((driver, actual) => {
      const predicted = prediction.findIndex(d => normalize(d) === normalize(driver));
      const difference = predicted < 0 ? null : Math.abs(actual - predicted);
      return {driver, actual:actual + 1, predicted:predicted < 0 ? null : predicted + 1,
        points:predicted < 0 ? 0 : difference < 2 ? points[actual] / (difference + 1) : 5};
    });
  }
  function overall(data, entries) {
    if (!Array.isArray(data.overall)) throw new Error('Overall standings unavailable');
    const rows = [...data.overall].sort((a,b) => a.position - b.position).slice(0,5);
    if (rows.length !== 5 || rows.some((r,i) => r.position !== i + 1)) throw new Error('Incomplete or tied standings');
    const names = rows.map(row => {
      const entry = entries.find(e => String(e.sourceId ?? e.entryId) === String(row.entry_id));
      if (!entry?.driver) throw new Error('Driver name unavailable');
      const surname = entry.driver.split(/\s+/).at(-1);
      if (entries.filter(e => normalize(e.driver.split(/\s+/).at(-1)) === normalize(surname)).length !== 1) throw new Error('Ambiguous driver surname');
      return surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
    });
    if (new Set(names.map(normalize)).size !== 5) throw new Error('Duplicate drivers');
    return names;
  }
  return {parse,score,overall};
})();

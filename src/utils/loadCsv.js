import Papa from 'papaparse';

async function loadCsv(filepath) {
  const data = await fetchCsv(filepath);
  const parsed = Papa.parse(data); //Object with keys of: data/errors/meta
  // console.log(parsed.data);
  return parsed.data;
}

async function fetchCsv(filepath) {
  const response = await fetch(filepath);
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  const csv = await decoder.decode(result.value);
  return csv;
}

export default loadCsv;
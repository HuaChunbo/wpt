function wait(ms) {
  return new Promise(resolve => step_timeout(resolve, ms));
}

async function pollReports(endpoint, id) {
  const res = await fetch(`${endpoint}?id=${id}`, {cache: 'no-store'});
  const reports = [];
  if (res.status === 200) {
    for (const report of await res.json()) {
      reports.push(report);
    }
  }
  return reports;
}

async function pollCookies(endpoint, id) {
  const res = await fetch(`${endpoint}?reportID=${id}&op=retrieve_cookies`, {cache: 'no-store'});
  const dict = await res.json();
  if (dict.reportCookies == 'None')
    return {};
  return dict.reportCookies;
}

function checkReportExists(reports, type, url) {
  for (const report of reports) {
    if (report.type !== type) continue;
    if (report.body.documentURL == url || report.body.sourceFile === url) return true;
  }
  assert_unreached(`A report of ${type} from ${url} is not found.`);
}

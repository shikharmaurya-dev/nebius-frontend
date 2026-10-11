
const USE_MOCK = true;
const API_URL = "http://127.0.0.1:8000";

const mockRun = {
  status: "running",
  code: "def add(a, b):\n    return a + b",
  events: ["Coder started", "Testing agent started", "Security agent started"],
  findings: [
    { agent: "Security", message: "No issues found" },
    { agent: "Performance", message: "Loop can be optimized" }
  ]
};

function showRun(run) {
  document.getElementById("status").innerHTML =
    "<b>" + run.status + "</b><br>" + run.events.join("<br>");
  document.getElementById("code").textContent = run.code;
  document.getElementById("findings").innerHTML = run.findings
    .map(f => "<p>" + f.agent + ": " + f.message + "</p>").join("");
}

async function startRun() {
  const task = document.getElementById("taskInput").value;
  if (USE_MOCK) { showRun(mockRun); return; }

  const res = await fetch(API_URL + "/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: task })
  });
  const data = await res.json();

  const timer = setInterval(async () => {
    const r = await fetch(API_URL + "/runs/" + data.run_id);
    const run = await r.json();
    showRun(run);
    if (run.status !== "running") clearInterval(timer);
  }, 2000);
}

document.getElementById("runBtn").addEventListener("click", startRun);
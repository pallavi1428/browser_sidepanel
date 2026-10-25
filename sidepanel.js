const DEFAULTS = { farziUrl: "", uniwareUrl: "", shiprocketUrl: "", compatMode: false };
const keyFor = { farzi: "farziUrl", uniware: "uniwareUrl", shiprocket: "shiprocketUrl" };
const panels = [...document.querySelectorAll(".site")];
const DEFAULT_SCALE = 0.55;
const MIN_SCALE = 0.35;
const MAX_SCALE = 1.0;
const SCALE_STEP = 0.05;

function setScale(panel, scale) {
  const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.round(scale * 100) / 100));
  panel.style.setProperty("--page-scale", String(clamped));
  panel.style.setProperty("--inverse-scale", String(1 / clamped));
  panel.querySelector(".zoom-level").textContent = Math.round(clamped * 100) + "%";
  panel.dataset.scale = String(clamped);
}

function validHttpUrl(value) {
  try { const u = new URL(value); return u.protocol === "https:" || u.protocol === "http:"; }
  catch { return false; }
}
function showUrl(frame, value) {
  const site = frame.closest(".site");
  const empty = site.querySelector(".empty");
  if (validHttpUrl(value)) {
    frame.src = value;
    site.classList.add("loaded");
    empty.textContent = "If this page stays blank or says it refused to connect, use ↗ to open it in a tab.";
  } else {
    frame.removeAttribute("src");
    site.classList.remove("loaded");
    empty.textContent = "Configure the " + frame.title + " URL in Settings.";
  }
}
async function loadSites() {
  const values = await chrome.storage.local.get(DEFAULTS);
  document.querySelectorAll("iframe[data-frame]").forEach(frame => showUrl(frame, values[keyFor[frame.dataset.frame]] || ""));
}
function openSettings() { chrome.runtime.openOptionsPage(); }
document.getElementById("settings").addEventListener("click", openSettings);

panels.forEach(panel => {
  setScale(panel, DEFAULT_SCALE);
  panel.querySelectorAll("button[data-action]").forEach(button => {
    button.addEventListener("click", async () => {
      const frame = panel.querySelector("iframe");
      const action = button.dataset.action;
      if (action === "zoom-out") {
        setScale(panel, Number(panel.dataset.scale || DEFAULT_SCALE) - SCALE_STEP);
      } else if (action === "zoom-in") {
        setScale(panel, Number(panel.dataset.scale || DEFAULT_SCALE) + SCALE_STEP);
      } else if (action === "fit") {
        setScale(panel, DEFAULT_SCALE);
      } else if (action === "reload") {
        const current = frame.getAttribute("src");
        if (current) frame.src = current;
      } else if (action === "open") {
        const values = await chrome.storage.local.get(DEFAULTS);
        const url = values[keyFor[panel.dataset.site]];
        if (validHttpUrl(url)) chrome.tabs.create({ url }); else openSettings();
      } else if (action === "expand") {
        panels.forEach(p => { if (p !== panel) p.classList.remove("expanded"); });
        panel.classList.toggle("expanded");
      }
    });
  });
});
chrome.storage.onChanged.addListener(loadSites);
loadSites();

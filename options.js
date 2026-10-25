const URL_KEYS = ["farziUrl", "uniwareUrl", "shiprocketUrl"];
const RULE_IDS = [1001, 1002, 1003];
const form = document.getElementById("settingsForm");
const status = document.getElementById("status");

function validUrl(raw) {
  try { const u = new URL(raw); return ["http:", "https:"].includes(u.protocol); }
  catch { return false; }
}

chrome.storage.local.get([...URL_KEYS, "compatMode"]).then(values => {
  URL_KEYS.forEach(key => { document.getElementById(key).value = values[key] || ""; });
  document.getElementById("compatMode").checked = values.compatMode === true;
});

async function updateCompatibilityRules(urls, enabled) {
  const removeRuleIds = RULE_IDS;
  const addRules = [];
  if (enabled) {
    const hosts = [...new Set(urls.filter(validUrl).map(raw => new URL(raw).hostname))];
    hosts.forEach((host, index) => {
      addRules.push({
        id: RULE_IDS[index], priority: 1,
        action: { type: "modifyHeaders", responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "content-security-policy", operation: "remove" }
        ] },
        condition: { requestDomains: [host], resourceTypes: ["sub_frame"] }
      });
    });
  }
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const values = {};
  for (const key of URL_KEYS) {
    const raw = document.getElementById(key).value.trim();
    if (raw && !validUrl(raw)) {
      status.textContent = "Please enter valid http:// or https:// URLs.";
      status.style.color = "#b42318";
      document.getElementById(key).focus();
      return;
    }
    values[key] = raw;
  }
  values.compatMode = document.getElementById("compatMode").checked;
  try {
    await updateCompatibilityRules(URL_KEYS.map(key => values[key]), values.compatMode);
    await chrome.storage.local.set(values);
    status.style.color = "#087443";
    status.textContent = values.compatMode
      ? "Saved. Compatibility rules are active for configured hosts. Reload the side panel and test."
      : "Saved. Compatibility mode is off. Reload the side panel to apply URLs.";
  } catch (error) {
    status.style.color = "#b42318";
    status.textContent = "Could not update compatibility rules: " + (error?.message || "Chrome rejected the request") + ". Check extension permissions and try again.";
  }
});

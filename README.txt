Voitekk Mini Browser v0.3.0

Install:
1. Unzip this folder.
2. In Chrome, open chrome://extensions
3. Turn on Developer mode.
4. Choose Load unpacked and select the voitekk-mini-browser folder.
5. Open extension Settings and enter the real URLs you use for Farzi, Uniware, and Shiprocket.
6. Click Save settings, then open the extension side panel.

Compatibility mode:
- Off by default.
- When enabled, removes X-Frame-Options and Content-Security-Policy response headers only for the configured hostnames and only for sub-frame requests.
- This weakens those sites' security protections while embedded. Enable only for sites you trust.
- It may help with some iframe refusals but cannot bypass all restrictions, browser cookie partitioning, site-side frame detection, or authentication limitations.
- If a site still fails, use its ↗ button to open it in a normal tab.

The test URLs previously supplied (Reddit, X, Product Hunt) may still refuse embedding or behave differently from the real Farzi/Uniware/Shiprocket web apps. The extension has not been tested against private company login pages.

Mini view sizing (v0.3.0):
- Each site starts at 55% visual scale to show more of the page in a narrow side panel.
- Use − / + in that site's header to adjust its scale independently (35%–100%).
- Fit resets the view to 55%. This scales the iframe viewport; it cannot force a website to become truly responsive, and very small scale values may make text harder to read.

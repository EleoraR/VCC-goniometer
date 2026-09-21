# Project Setup

## 1. Install dependencies

```bash
npm install
```

## 2. Build the project

```bash
npm run build
```

This generates the production build output (check your build config for the exact output folder, e.g. `dist/plugin.vcc.healthdirect.org.au/`).

## 3. Override source in the browser (Chrome DevTools)

Use Chrome DevTools' **Local Overrides** feature to serve your local build output in place of the live site's files. This lets you test changes against a live page without deploying.

1. Open DevTools (`F12` or `Cmd+Opt+I` / `Ctrl+Shift+I`).
2. Go to the **Sources** tab.
3. Open the **Overrides** panel (in the left sidebar; click `>>` if it's hidden).
4. Click **Select folder for overrides** and choose your local build output folder (e.g. `dist/`).
5. Click **Allow** when Chrome asks for filesystem permission.
6. In the **Page** tab (or **Network** tab), locate the file you want to override, right-click it, and choose **Save for overrides** (or simply edit it directly in the Sources panel — DevTools will save changes to your local folder automatically).
7. Reload the page. DevTools will now serve your local file instead of the network version, indicated by a purple dot on the file in the Sources tree.

**Tip:** To stop overriding, disable the checkbox next to your override folder in the Overrides panel, or remove the specific file from `.headers` overrides.

## Notes

- Re-run `npm run build` after making source changes, since overrides serve static build output, not live-compiled source.
- Overrides persist across DevTools sessions as long as you keep the same folder selected and grant permission again if Chrome revokes it.

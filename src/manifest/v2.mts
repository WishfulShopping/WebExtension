import { createRequire } from "node:module";
import { ManifestTypeV2 } from './v2-type.mjs';

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

const manifest: ManifestTypeV2 = {
  manifest_version: 2,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  icons: {
    "128": "public/icon-128.png",
  },
  web_accessible_resources: ["public/*", "assets/*"],
  permissions: [
    "storage"
  ],
  "browser_specific_settings": {
    "gecko": {
      "id": "{79781150-38ba-41f4-85da-7b489c97b05a}"
    }
  }
};

function getManifestV2(pageDirMap: { [x: string]: any }): ManifestTypeV2 {
  const pages = Object.keys(pageDirMap);

  if (pages.length === 0) {
    return manifest;
  }

  if (pages.indexOf("options") > -1) {
    manifest.options_ui = {
      page: pageDirMap["options"],
      open_in_tab: true,
    };
  }

  if (pages.indexOf("background") > -1) {
    manifest.background = {
      scripts: [pageDirMap["background"]],
    };
  }

  if (pages.indexOf("popup") > -1) {
    manifest.browser_action = {
      default_popup: pageDirMap["popup"],
      default_icon: "public/icon-34.png",
    };
  }

  if (pages.indexOf("content") > -1) {
    manifest.content_scripts = [
      {
        matches: ["http://*/*", "https://*/*", "<all_urls>"],
        js: [pageDirMap["content"]],
        css: pageDirMap["content-css"],
        run_at: "document_start",
      },
    ];
  }

  if (pages.indexOf("devtools") > -1) {
    manifest.devtools_page = pageDirMap["devtools"];
  }

  return manifest;
}

export default getManifestV2;

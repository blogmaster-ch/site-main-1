// ads-loader.js

async function loadAdsFromSheet() {
  const SHEET_ID = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk"; // ←あなたのID
  const SHEET_NAME = "aff_list";

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

  console.log("[ads-loader] fetch:", url);   // ← 追加（1）

  const res = await fetch(url);
  const text = await res.text();

  const json = JSON.parse(text.substr(47).slice(0, -2));
  const rows = json.table.rows;

  const adMap = {};
  rows.forEach((r) => {
    const slotName = r.c[0]?.v; // A列 slot_name
    const adUrl    = r.c[3]?.v; // D列 active_tag（今回は URL）
    const status   = r.c[4]?.v; // E列 status

    if (slotName && adUrl && status === "active") {
      adMap[slotName] = adUrl;
    }
  });

  console.log("[ads-loader] adMap:", adMap);  // ← 追加（2）

  // data-ad-slot に <script> を埋め込む
  document.querySelectorAll("[data-ad-slot]").forEach((el) => {
    const slot  = el.getAttribute("data-ad-slot");
    const adUrl = adMap[slot];
    if (!adUrl) return;

    const s = document.createElement("script");
    s.src   = adUrl;
    s.async = true;
    el.appendChild(s);
  });
}

// DOM 読み込み後に実行
document.addEventListener("DOMContentLoaded", loadAdsFromSheet);

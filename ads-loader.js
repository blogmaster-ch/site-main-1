// ads-loader.js

async function loadAdsFromSheet() {
  // ★ここだけ、あなたのスプシIDに置き換えてありますか？★
  const SHEET_ID = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk"; 
  const SHEET_NAME = "aff_list";

  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
    `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

  const res = await fetch(url);
  const text = await res.text();

  // GoogleシートのJSONをパース
  const json = JSON.parse(text.substr(47).slice(0, -2));
  const rows = json.table.rows;

  // スロット名 → 広告URL のマップを作る
  const adMap = {};
  rows.forEach((r) => {
    const slotName = r.c[0]?.v; // A列: slot_name
    const adUrl    = r.c[3]?.v; // D列: ad_url
    const status   = r.c[4]?.v; // E列: status

    if (slotName && adUrl && status === "active") {
      adMap[slotName] = adUrl;
    }
  });

  // ページ内の data-ad-slot に対応する <script> を埋め込む
  document.querySelectorAll("[data-ad-slot]").forEach((el) => {
    const slot = el.getAttribute("data-ad-slot");
    const adUrl = adMap[slot];
    if (!adUrl) return;

    const s = document.createElement("script");
    s.src = adUrl;
    s.async = true;
    el.appendChild(s);
  });
}

// DOM が読み込まれたら実行
document.addEventListener("DOMContentLoaded", loadAdsFromSheet);

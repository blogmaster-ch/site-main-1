// ads-loader.js （決定版）

// ★ここを自分のシートIDに差し替える★
// スプレッドシートURLが
// https://docs.google.com/spreadsheets/d/XXXXX/edit?... なら
// XXXXX の部分をコピーして下に入れる。
const SHEET_ID = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk";  

const SHEET_NAME = "aff_list";

async function loadAds() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}`;
    const res = await fetch(url);
    const text = await res.text();

    // gviz のラッパーを削って JSON だけ抜き出す
    const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(jsonStr);

    const rows = data.table.rows || [];
    const adSlots = {};

    rows.forEach((r) => {
      const slot   = r.c[0]?.v; // slot_name
      const tag    = r.c[3]?.v; // active_tag
      const status = r.c[4]?.v; // status
      if (slot && tag && status === "active") {
        adSlots[slot] = tag;
      }
    });

    document.querySelectorAll("[data-ad-slot]").forEach((el) => {
      const slotName = el.getAttribute("data-ad-slot");
      if (slotName && adSlots[slotName]) {
        el.innerHTML = adSlots[slotName];
      }
    });
  } catch (e) {
    console.error("ADS LOAD ERROR", e);
  }
}

loadAds();

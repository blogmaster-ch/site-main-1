// ads-loader.js  完全版

(async () => {
  // ここのIDは「今あなたのコードに入っているシートID」をそのまま使ってください
  const SHEET_ID = '10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk';
  const SHEET_NAME = 'aff_list';

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

  try {
    console.log('loadAds: fetch', url);
    const res = await fetch(url);
    const text = await res.text();

    // gviz の余分な文字を削って JSON にする
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows || [];

    // スロット名 → 広告URL のマップを作る
    const slots = {};
    rows.forEach(r => {
      const slotName = r.c[0]?.v;  // A列: slot_name
      const adUrl    = r.c[3]?.v;  // D列: active_tag(=広告URL)
      const status   = r.c[4]?.v;  // E列: status

      if (slotName && adUrl && status === 'active') {
        slots[slotName] = adUrl;
      }
    });

    console.log('loadAds: slots', slots);

    // ページ内の data-ad-slot を全部差し込む
    document.querySelectorAll('[data-ad-slot]').forEach(el => {
      const slot = el.getAttribute('data-ad-slot');
      const adUrl = slots[slot];

      if (!adUrl) {
        console.warn('loadAds: no ad url for slot', slot);
        return;
      }

      // <script src="..."> を動的に作る（innerHTMLは使わない）
      const s = document.createElement('script');
      s.src = adUrl;
      s.async = true;
      el.appendChild(s);
    });

  } catch (e) {
    console.error('loadAds error', e);
  }
})();

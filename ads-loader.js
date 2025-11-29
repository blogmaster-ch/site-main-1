// ads-loader.js  全部これに差し替え

(async () => {
  // ★ここをあなたのスプシIDに変える
  // URL が https://docs.google.com/spreadsheets/d/XXXX/edit?... のとき、この XXXX の部分
  const SHEET_ID = '10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk';

  const SHEET_NAME = 'aff_list';

  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
    `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // gviz 形式のJSONから本体だけ抜き出す
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows || [];

    // スロット名 → script src のマップを作る
    const slotMap = {};
    rows.forEach((r) => {
      const slotName = r.c[0]?.v;   // A列：slot_name
      const type = r.c[1]?.v;       // B列：type
      const genre = r.c[2]?.v;      // C列：genre（今は使ってない）
      const scriptSrc = r.c[3]?.v;  // D列：script_src
      const status = r.c[4]?.v;     // E列：status

      if (!slotName || !scriptSrc) return;
      if (status !== 'active') return;

      slotMap[slotName] = scriptSrc;
    });

    // data-ad-slot を持つ要素にスクリプトを差し込む
    document.querySelectorAll('[data-ad-slot]').forEach((el) => {
      const slot = el.getAttribute('data-ad-slot');
      const src = slotMap[slot];
      if (!src) return;

      // 既存の中身を消してから <script> を生成
      el.innerHTML = '';
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      el.appendChild(s);
    });
  } catch (e) {
    console.error('ads-loader error', e);
  }
})();

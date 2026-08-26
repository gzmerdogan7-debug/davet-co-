/* Karekod (QR) Uretici */
(function (global) {
  "use strict";

  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function () {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  const carp = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);
  const KAPASITE = [14, 26, 42, 62, 84, 106, 122, 152, 180, 213];
  const BLOKLAR = [
    [10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0],
    [24, 2, 43, 0, 0], [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39],
    [22, 3, 36, 2, 37], [26, 4, 43, 1, 44],
  ];
  const HIZA = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  const SURUM_BILGI = [0, 0, 0, 0, 0, 0, 0x07c94, 0x085bc, 0x09a99, 0x0a4d3];
  const BICIM = [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0];

  const MASKELER = [
    (r, c) => (r + c) % 2 === 0,
    (r, c) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];

  function uretecPolinomu(n) {
    let p = [1];
    for (let i = 0; i < n; i++) {
      const q = p.concat([0]);
      for (let j = 0; j < p.length; j++) q[j + 1] ^= carp(p[j], EXP[i]);
      p = q;
    }
    return p;
  }

  function hataKodu(veri, n) {
    const g = uretecPolinomu(n);
    const sonuc = new Array(n).fill(0);
    for (const d of veri) {
      const carpan = d ^ sonuc[0];
      sonuc.shift();
      sonuc.push(0);
      if (carpan !== 0) for (let i = 0; i < n; i++) sonuc[i] ^= carp(g[i + 1], carpan);
    }
    return sonuc;
  }

  function kodSozcukleriUret(baytlar, surum) {
    const [eccSayisi, g1, g1Veri, g2, g2Veri] = BLOKLAR[surum - 1];
    const toplamVeri = g1 * g1Veri + g2 * g2Veri;
    const sayacBiti = surum < 10 ? 8 : 16;

    const bitler = [];
    const bitEkle = (deger, adet) => {
      for (let i = adet - 1; i >= 0; i--) bitler.push((deger >> i) & 1);
    };
    bitEkle(0b0100, 4);
    bitEkle(baytlar.length, sayacBiti);
    for (const b of baytlar) bitEkle(b, 8);

    const kapasiteBit = toplamVeri * 8;
    for (let i = 0; i < 4 && bitler.length < kapasiteBit; i++) bitler.push(0);
    while (bitler.length % 8 !== 0) bitler.push(0);

    const veri = [];
    for (let i = 0; i < bitler.length; i += 8) {
      let bayt = 0;
      for (let j = 0; j < 8; j++) bayt = (bayt << 1) | bitler[i + j];
      veri.push(bayt);
    }
    const dolgu = [0xec, 0x11];
    let d = 0;
    while (veri.length < toplamVeri) veri.push(dolgu[d++ % 2]);

    const veriBloklari = [];
    const eccBloklari = [];
    let konum = 0;
    const yapi = [];
    for (let i = 0; i < g1; i++) yapi.push(g1Veri);
    for (let i = 0; i < g2; i++) yapi.push(g2Veri);
    for (const uzunluk of yapi) {
      const blok = veri.slice(konum, konum + uzunluk);
      konum += uzunluk;
      veriBloklari.push(blok);
      eccBloklari.push(hataKodu(blok, eccSayisi));
    }

    const sonuc = [];
    const enUzunVeri = Math.max(...veriBloklari.map((b) => b.length));
    for (let i = 0; i < enUzunVeri; i++) {
      for (const blok of veriBloklari) if (i < blok.length) sonuc.push(blok[i]);
    }
    for (let i = 0; i < eccSayisi; i++) {
      for (const blok of eccBloklari) sonuc.push(blok[i]);
    }
    return sonuc;
  }

  function matrisKur(surum, kodSozcukleri) {
    const boyut = surum * 4 + 17;
    const m = Array.from({ length: boyut }, () => new Array(boyut).fill(0));
    const sabit = Array.from({ length: boyut }, () => new Array(boyut).fill(false));

    const koy = (r, c, v) => {
      if (r < 0 || c < 0 || r >= boyut || c >= boyut) return;
      m[r][c] = v;
      sabit[r][c] = true;
    };

    const bulucu = (R, C) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const ic =
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          koy(R + r, C + c, ic ? 1 : 0);
        }
      }
    };
    bulucu(0, 0);
    bulucu(0, boyut - 7);
    bulucu(boyut - 7, 0);

    for (let i = 8; i < boyut - 8; i++) {
      koy(6, i, i % 2 === 0 ? 1 : 0);
      koy(i, 6, i % 2 === 0 ? 1 : 0);
    }

    const merkezler = HIZA[surum - 1];
    for (const r of merkezler) {
      for (const c of merkezler) {
        if (sabit[r][c]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            koy(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1 ? 1 : 0);
          }
        }
      }
    }

    koy(boyut - 8, 8, 1);

    for (let i = 0; i <= 8; i++) {
      if (!sabit[8][i]) koy(8, i, 0);
      if (!sabit[i][8]) koy(i, 8, 0);
    }
    for (let i = 0; i < 8; i++) {
      if (!sabit[8][boyut - 1 - i]) koy(8, boyut - 1 - i, 0);
      if (!sabit[boyut - 1 - i][8]) koy(boyut - 1 - i, 8, 0);
    }

    if (surum >= 7) {
      const bilgi = SURUM_BILGI[surum - 1];
      for (let i = 0; i < 18; i++) {
        const bit = (bilgi >> i) & 1;
        const satir = Math.floor(i / 3);
        const sutun = i % 3;
        koy(satir, boyut - 11 + sutun, bit);
        koy(boyut - 11 + sutun, satir, bit);
      }
    }

    const bitler = [];
    for (const kod of kodSozcukleri) for (let b = 7; b >= 0; b--) bitler.push((kod >> b) & 1);

    let indeks = 0;
    let yukari = true;
    for (let sutun = boyut - 1; sutun > 0; sutun -= 2) {
      if (sutun === 6) sutun--;
      for (let i = 0; i < boyut; i++) {
        const satir = yukari ? boyut - 1 - i : i;
        for (let k = 0; k < 2; k++) {
          const c = sutun - k;
          if (sabit[satir][c]) continue;
          m[satir][c] = indeks < bitler.length ? bitler[indeks++] : 0;
        }
      }
      yukari = !yukari;
    }

    return { m, sabit, boyut };
  }

  function bicimYerlestir(m, boyut, maskeIndeksi) {
    const f = BICIM[maskeIndeksi];
    const bit = (i) => (f >> i) & 1;
    for (let i = 0; i <= 5; i++) m[i][8] = bit(i);
    m[7][8] = bit(6);
    m[8][8] = bit(7);
    m[8][7] = bit(8);
    for (let i = 9; i < 15; i++) m[8][14 - i] = bit(i);
    for (let i = 0; i < 8; i++) m[8][boyut - 1 - i] = bit(i);
    for (let i = 8; i < 15; i++) m[boyut - 15 + i][8] = bit(i);
    m[boyut - 8][8] = 1;
  }

  function cezaPuani(m, boyut) {
    let puan = 0;
    const diziKontrol = (getir) => {
      for (let a = 0; a < boyut; a++) {
        let onceki = -1, uzunluk = 0;
        for (let b = 0; b < boyut; b++) {
          const v = getir(a, b);
          if (v === onceki) { uzunluk++; }
          else {
            if (uzunluk >= 5) puan += 3 + (uzunluk - 5);
            onceki = v; uzunluk = 1;
          }
        }
        if (uzunluk >= 5) puan += 3 + (uzunluk - 5);
      }
    };
    diziKontrol((a, b) => m[a][b]);
    diziKontrol((a, b) => m[b][a]);
    return puan;
  }

  function uret(metin) {
    const baytlar = Array.from(new TextEncoder().encode(String(metin)));
    let surum = 0;
    for (let v = 1; v <= 10; v++) {
      if (baytlar.length <= KAPASITE[v - 1]) { surum = v; break; }
    }
    if (!surum) throw new Error("Metin cok uzun.");

    const kodSozcukleri = kodSozcukleriUret(baytlar, surum);
    const { m, sabit, boyut } = matrisKur(surum, kodSozcukleri);

    let enIyi = null;
    for (let maske = 0; maske < 8; maske++) {
      const kopya = m.map((satir) => satir.slice());
      for (let r = 0; r < boyut; r++) {
        for (let c = 0; c < boyut; c++) {
          if (!sabit[r][c] && MASKELER[maske](r, c)) kopya[r][c] ^= 1;
        }
      }
      bicimYerlestir(kopya, boyut, maske);
      const puan = cezaPuani(kopya, boyut);
      if (!enIyi || puan < enIyi.puan) enIyi = { puan, matris: kopya };
    }
    return enIyi.matris;
  }

  function svgUret(metin, secenekler) {
    const ayar = Object.assign({ kenar: 4, koyu: "#141414", acik: "#ffffff", boyut: 240 }, secenekler || {});
    const matris = uret(metin);
    const n = matris.length;
    const tam = n + ayar.kenar * 2;

    let yol = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matris[r][c]) yol += `M${c + ayar.kenar} ${r + ayar.kenar}h1v1h-1z`;
      }
    }

    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tam} ${tam}" ` +
      `width="${ayar.boyut}" height="${ayar.boyut}" shape-rendering="crispEdges">` +
      `<rect width="${tam}" height="${tam}" fill="${ayar.acik}"/>` +
      `<path d="${yol}" fill="${ayar.koyu}"/></svg>`
    );
  }

  global.Karekod = { uret, svgUret };
})(window);

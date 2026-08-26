/* Davet & Co. · Fon Müzik Motoru */
(function (global) {
  "use strict";

  const AKORLAR = {
    dugun: [[62, 66, 69, 74], [61, 64, 69, 73], [59, 62, 66, 71], [55, 59, 62, 67]],
    kina: [[62, 66, 69, 74], [63, 67, 70, 75], [66, 69, 72, 78], [57, 62, 66, 69]],
    retro: [[65, 69, 72, 76], [64, 67, 71, 74], [62, 65, 69, 72], [67, 71, 74, 77]],
  };

  const DESEN = [0, 1, 2, 3, 2, 3, 1, 2];
  const ADIM_SURESI = 0.42;
  let ctx = null, ana = null, yanki = null, calisiyor = false, zamanlayici = null, siradakiZaman = 0, adim = 0, akorlar = AKORLAR.dugun;

  const frekans = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  function yankiTamponu(sure, sonum) {
    const uzunluk = Math.floor(ctx.sampleRate * sure);
    const tampon = ctx.createBuffer(2, uzunluk, ctx.sampleRate);
    for (let kanal = 0; kanal < 2; kanal++) {
      const veri = tampon.getChannelData(kanal);
      for (let i = 0; i < uzunluk; i++) {
        veri[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / uzunluk, sonum);
      }
    }
    return tampon;
  }

  function kur() {
    const AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    ana = ctx.createGain();
    ana.gain.value = 0;
    ana.connect(ctx.destination);

    yanki = ctx.createConvolver();
    yanki.buffer = yankiTamponu(3.2, 2.4);
    const yankiSeviye = ctx.createGain();
    yankiSeviye.gain.value = 0.38;
    yanki.connect(yankiSeviye);
    yankiSeviye.connect(ana);
    return true;
  }

  function cal(midi, zaman, sure, seviye) {
    const osc = ctx.createOscillator();
    const kazanc = ctx.createGain();
    const suzgec = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.value = frekans(midi);
    suzgec.type = "lowpass";
    suzgec.frequency.value = 2600;

    kazanc.gain.setValueAtTime(0, zaman);
    kazanc.gain.linearRampToValueAtTime(seviye, zaman + 0.012);
    kazanc.gain.exponentialRampToValueAtTime(0.0001, zaman + sure);

    osc.connect(suzgec);
    suzgec.connect(kazanc);
    kazanc.connect(ana);
    kazanc.connect(yanki);
    osc.start(zaman);
    osc.stop(zaman + sure + 0.05);
  }

  function zamanla() {
    while (siradakiZaman < ctx.currentTime + 0.25) {
      const olcu = Math.floor(adim / DESEN.length) % akorlar.length;
      const yerelAdim = adim % DESEN.length;
      const akor = akorlar[olcu];
      const nota = akor[DESEN[yerelAdim]];
      cal(nota, siradakiZaman, 2.2, yerelAdim === 0 ? 0.16 : 0.1);
      siradakiZaman += ADIM_SURESI;
      adim++;
    }
  }

  function baslat(tema) {
    akorlar = AKORLAR[tema] || AKORLAR.dugun;
    if (!ctx && !kur()) return false;
    if (ctx.state === "suspended") ctx.resume();
    if (!calisiyor) {
      siradakiZaman = ctx.currentTime + 0.12;
      adim = 0;
      zamanlayici = setInterval(zamanla, 40);
      calisiyor = true;
    }
    ana.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.2);
    return true;
  }

  function sustur() {
    if (!ctx || !calisiyor) return;
    ana.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    clearInterval(zamanlayici);
    zamanlayici = null;
    calisiyor = false;
  }

  global.Muzik = { baslat, sustur, degistir: (t) => (calisiyor ? sustur() : baslat(t)) };
})(window);

(function () {
  "use strict";

  const p = new URLSearchParams(location.search);
  const tema = p.get("tema") || "kemer";
  const el = (id) => document.getElementById(id);
  const yaz = (id, metin) => {
    const d = el(id);
    if (d) d.textContent = metin;
  };

  const isim1 = p.get("isim1") || "Melisa";
  const isim2 = p.get("isim2") || "Kerem";
  const misafir = (p.get("misafir") || "").trim();
  const davetiyeKod = `${isim1}-${isim2}`.toLowerCase().replace(/[^a-z0-9]/g, "");

  document.documentElement.setAttribute("data-tema", tema);
  document.title = `${isim1} & ${isim2} · Davetiye`;

  yaz("isim1", isim1);
  yaz("isim2", isim2);
  yaz("kapakMisafir", misafir || "Değerli Misafirimiz");
  yaz("karsilamaBaslik", misafir ? `Sayın ${misafir}` : "Sayın Değerli Misafirimiz");

  /* --- 1. Etkinlik --- */
  const e1TarihStr = p.get("e1Tarih") || p.get("tarih") || "2026-09-19T19:30";
  const e1Tarih = new Date(e1TarihStr);
  const e1Mekan = p.get("e1Mekan") || p.get("mekan") || "Kalamış Marina Teras";
  const e1Adres = p.get("e1Adres") || p.get("adres") || "Kadıköy / İstanbul";
  const e1Tur = p.get("e1Tur") || "Düğün & Kutlama";

  yaz("e1Tur", e1Tur);
  yaz("e1Tarih", e1Tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" }));
  yaz("e1Saat", e1Tarih.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
  yaz("e1MekanAdi", e1Mekan);
  yaz("e1Adres", e1Adres);
  if (el("e1HaritaBtn")) el("e1HaritaBtn").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e1Mekan + " " + e1Adres)}`;

  /* --- Çoklu Etkinlik --- */
  if (p.get("coklu") === "1") {
    const e2TarihStr = p.get("e2Tarih") || "2026-09-19T16:30";
    const e2Tarih = new Date(e2TarihStr);
    const e2Mekan = p.get("e2Mekan") || "Kadıköy Evlendirme Dairesi";
    const e2Adres = p.get("e2Adres") || "Kadıköy / İstanbul";
    const e2Tur = p.get("e2Tur") || "Nikâh Töreni";

    yaz("e2Tur", e2Tur);
    yaz("e2Tarih", e2Tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" }));
    yaz("e2Saat", e2Tarih.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
    yaz("e2MekanAdi", e2Mekan);
    yaz("e2Adres", e2Adres);
    if (el("e2HaritaBtn")) el("e2HaritaBtn").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e2Mekan + " " + e2Adres)}`;

    if (el("etkinlikSekmeler")) el("etkinlikSekmeler").style.display = "inline-flex";
    if (el("sekme1Btn")) el("sekme1Btn").textContent = e1Tur;
    if (el("sekme2Btn")) el("sekme2Btn").textContent = e2Tur;

    el("sekme1Btn").addEventListener("click", () => {
      el("sekme1Btn").classList.add("secili");
      el("sekme2Btn").classList.remove("secili");
      el("etkinlik1Kart").style.display = "block";
      el("etkinlik2Kart").style.display = "none";
    });
    el("sekme2Btn").addEventListener("click", () => {
      el("sekme2Btn").classList.add("secili");
      el("sekme1Btn").classList.remove("secili");
      el("etkinlik1Kart").style.display = "none";
      el("etkinlik2Kart").style.display = "block";
    });
  }

  /* --- Rozetler --- */
  const rozetlerAlani = el("rozetlerAlani");
  if (rozetlerAlani) {
    rozetlerAlani.innerHTML = "";
    if (p.get("notCocuk") !== "0") {
      rozetlerAlani.innerHTML += `
        <div class="bilgi-rozet">
          <span class="rozet-ikon">🌙</span>
          <b>Minik Misafirler</b>
          <p>Minik misafirlerimize tatlı uykular diler, etkinliğimizin yetişkinlere özel olduğunu belirtmek isteriz.</p>
        </div>`;
    }
    if (p.get("notZemin") !== "0") {
      rozetlerAlani.innerHTML += `
        <div class="bilgi-rozet">
          <span class="rozet-ikon">🌿</span>
          <b>Zemin Uyarısı</b>
          <p>Kutlamamız çim alanda gerçekleşeceği için rahat topuklu ayakkabılar tercih etmenizi öneririz.</p>
        </div>`;
    }
  }

  /* --- IBAN --- */
  if (p.get("ibanAktif") === "1" && el("hediyeBolumu")) {
    el("hediyeBolumu").style.display = "block";
    yaz("ibanSahip", p.get("ibanSahip") || `${isim1} & ${isim2}`);
    yaz("ibanBanka", p.get("ibanBanka") || "");
    yaz("ibanNo", p.get("ibanNo") || "");

    const ibanBtn = el("ibanKopyalaBtn");
    if (ibanBtn) {
      ibanBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(el("ibanNo").textContent);
          ibanBtn.textContent = "Kopyalandı ✓";
        } catch {
          ibanBtn.textContent = "Kopyalanamadı";
        }
        setTimeout(() => (ibanBtn.textContent = "IBAN'ı Kopyala"), 2000);
      });
    }
  }

  /* --- Geri Sayım --- */
  function sayaciGuncelle() {
    const fark = e1Tarih.getTime() - Date.now();
    if (fark <= 0) return;
    const sn = Math.floor(fark / 1000);
    yaz("sGun", String(Math.floor(sn / 86400)));
    yaz("sSaat", String(Math.floor(sn / 3600) % 24).padStart(2, "0"));
    yaz("sDakika", String(Math.floor(sn / 60) % 60).padStart(2, "0"));
    yaz("sSaniye", String(sn % 60).padStart(2, "0"));
  }
  sayaciGuncelle();
  setInterval(sayaciGuncelle, 1000);

  /* --- LCV (Supabase Doğrudan Kayıt) --- */
  let lcvDurum = null;
  const form = el("lcvForm");
  const geliyor = el("geliyorumBtn");
  const gelmiyor = el("gelmiyorumBtn");
  if (misafir) el("lcvIsim").value = misafir;

  function durumSec(durum) {
    lcvDurum = durum;
    geliyor.classList.toggle("secili", durum === "geliyor");
    gelmiyor.classList.toggle("secili", durum === "gelmiyor");
    el("kisiAlani").style.display = durum === "geliyor" ? "block" : "none";
    form.classList.add("gorunur");
    yaz("lcvSonuc", "");
  }
  geliyor.addEventListener("click", () => durumSec("geliyor"));
  gelmiyor.addEventListener("click", () => durumSec("gelmiyor"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!lcvDurum) return;
    const gonderBtn = el("lcvGonder");
    gonderBtn.disabled = true;
    gonderBtn.textContent = "Gönderiliyor…";

    try {
      if (window.DB) {
        await window.DB.lcvEkle({
          davetiye_kod: davetiyeKod,
          misafir: el("lcvIsim").value,
          durum: lcvDurum,
          kisi: lcvDurum === "geliyor" ? el("lcvKisi").value : 0,
          mesaj: el("lcvMesaj").value
        });
      }
      form.classList.remove("gorunur");
      geliyor.classList.remove("secili");
      gelmiyor.classList.remove("secili");
      yaz("lcvSonuc", lcvDurum === "geliyor" ? "Teşekkür ederiz, yanıtınız kaydedildi! ✨" : "Bildiriminiz kaydedildi, teşekkür ederiz.");
    } catch (hata) {
      yaz("lcvSonuc", "Bir sorun oluştu, lütfen tekrar deneyin.");
    } finally {
      gonderBtn.disabled = false;
      gonderBtn.textContent = "Yanıtı Gönder";
    }
  });

  /* --- Fotoğraf QR Kodu --- */
  try {
    const fotoAdresi = `${location.origin}/foto.html?davetiye=${davetiyeKod}&isim1=${encodeURIComponent(isim1)}&isim2=${encodeURIComponent(isim2)}`;
    el("fotoQr").innerHTML = window.Karekod.svgUret(fotoAdresi, { boyut: 150 });
  } catch (e) {}

  /* --- Kapak Açılışı & Müzik --- */
  const kapak = el("kapak");
  const muzikBtn = el("muzikBtn");
  const muzikTur = p.get("muzik") || "dugun";

  el("acBtn").addEventListener("click", () => {
    kapak.classList.add("acik");
    document.body.classList.remove("kilitli");
    if (el("icerik")) el("icerik").setAttribute("aria-hidden", "false");
    if (muzikBtn) muzikBtn.classList.add("gorunur");
    if (window.Muzik) window.Muzik.baslat(muzikTur);
    setTimeout(() => kapak.remove(), 1200);
  }, { once: true });

  if (muzikBtn) {
    muzikBtn.addEventListener("click", () => {
      const acik = window.Muzik.degistir(muzikTur);
      muzikBtn.style.opacity = acik ? "1" : "0.45";
    });
  }

  /* --- Kaydırma Animasyonları --- */
  const gozlemci = new IntersectionObserver((girdiler) => {
    for (const g of girdiler) {
      if (g.isIntersecting) {
        g.target.classList.add("gorundu");
        gozlemci.unobserve(g.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(".gizli").forEach((d) => gozlemci.observe(d));
})();

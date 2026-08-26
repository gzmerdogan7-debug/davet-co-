/* Davet & Co. · Supabase Bulut Veritabanı */
(function (global) {
  "use strict";

  const SUPABASE_URL = "https://txbxutfjtpvdngzqiygh.supabase.co";
  const SUPABASE_KEY = "sb_publishable_zu29ajhFR2Yn0fyeMwcC5g_l5GZ24eQ";

  const client = global.supabase ? global.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  const DB = {
    client,
    async lcvEkle(veri) {
      if (!client) throw new Error("Veritabanı bağlantısı yok");
      const { data, error } = await client.from("lcv").insert([{
        davetiye_kod: veri.davetiye_kod || "genel",
        misafir: veri.misafir || "İsimsiz",
        durum: veri.durum,
        kisi: Number(veri.kisi) || 1,
        mesaj: veri.mesaj || ""
      }]);
      if (error) throw error;
      return data;
    },
    async lcvGetir(davetiye_kod) {
      if (!client) return [];
      let sorgu = client.from("lcv").select("*").order("created_at", { ascending: false });
      if (davetiye_kod && davetiye_kod !== "hepsi") {
        sorgu = sorgu.eq("davetiye_kod", davetiye_kod);
      }
      const { data, error } = await sorgu;
      return data || [];
    },
    async talepEkle(talep) {
      if (!client) throw new Error("Veritabanı bağlantısı yok");
      const { data, error } = await client.from("talepler").insert([{
        isim1: talep.isim1,
        isim2: talep.isim2,
        telefon: talep.telefon,
        tema: talep.tema,
        detaylar: talep.detaylar
      }]);
      if (error) throw error;
      return data;
    }
  };

  global.DB = DB;
})(window);

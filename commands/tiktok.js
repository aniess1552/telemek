const { Markup } = require("telegraf");
const fetch = require("node-fetch");

module.exports = {
  name: "tiktok",
  description: "Download video atau slide TikTok",
  register: (bot) => {
    bot.command(["tiktok", "tt"], async (ctx) => {
      const text = ctx.message.text.split(" ").slice(1).join(" ");
      if (!text) return ctx.reply("❌ Contoh: /tiktok https://vt.tiktok.com/xxxx");

      await ctx.reply("📥 Memproses TikTok downloader...");

      try {
        const res = await fetch(`https://restapi.simplebot.my.id/download/tiktok?apikey=new&url=${encodeURIComponent(text)}`);
        const anu = await res.json();

        if (!anu.status) return ctx.reply("❌ Error! Result Not Found");

        // Jika slide
        if (anu.result.slides && anu.result.slides.length > 1) {
          for (let i of anu.result.slides) {
            await ctx.replyWithPhoto({ url: i.url }, {
              caption: "✅ TikTok Slide",
            });
          }
        } else {
          // Video biasa
          await ctx.replyWithVideo({
            url: anu.result.video_nowm,
            filename: "tiktok.mp4"
          }, {
            caption: "✅ TikTok Download Done",
          });
        }

        // Kirim audio
        if (anu.result.audio_url) {
          await ctx.replyWithAudio({
            url: anu.result.audio_url,
            filename: "tiktok-audio.mp3"
          });
        }

      } catch (err) {
        console.error(err);
        ctx.reply("❌ Gagal memproses video TikTok.");
      }
    });
  },
};
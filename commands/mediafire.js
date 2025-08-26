const fetch = require("node-fetch");

module.exports = {
  name: "mediafire",
  description: "Download file dari Mediafire",
  register: (bot) => {
    bot.command("mediafire", async (ctx) => {
      const text = ctx.message.text.split(" ").slice(1).join(" ");
      if (!text) {
        return ctx.reply("❌ Contoh: /mediafire https://www.mediafire.com/file/xxxxx");
      }

      try {
        const res = await fetch(`https://veloria-ui.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.status) {
          return ctx.reply("❌ Gagal mengambil data. Cek URL-nya.");
        }

        const result = json.result;
        const caption = `
*🔗 Link:* ${text}
*📁 Nama File:* ${result.filename}
*📦 Ukuran:* ${result.filesize}
*🧾 Tipe File:* ${result.mimetype}
*📤 Diupload:* ${result.uploaded}
        `.trim();

        await ctx.replyWithDocument(
          { url: result.download_url, filename: result.filename },
          { caption }
        );
      } catch (err) {
        console.error(err);
        ctx.reply("❌ Terjadi kesalahan saat mengunduh file.");
      }
    });
  },
};
export async function sendTelegramMessage({ token, chatId, text }) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      }),
    });
  } catch (err) {
    console.warn("Telegram send failed:", err);
  }
}
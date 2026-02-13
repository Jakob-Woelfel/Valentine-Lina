export async function sendTelegramMessage({
  apiKey,
  chatId,
  message
}) {
  const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });
  } catch (err) {
    console.warn("Telegram send failed:", err);
  }
}
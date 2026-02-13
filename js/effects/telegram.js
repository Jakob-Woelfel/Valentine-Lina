export async function sendTelegramMessage({
  apiKey,
  chatId,
  message
}) {
  const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;

  try {
    console.log("TG apiKey:", apiKey);
    console.log("TG chatId raw:", JSON.stringify(chatId));
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      })
    });
  const text = await res.text();   // 🔎 HIER wird Response gelesen
  console.log("Telegram response:", res.status, text);

  } catch (err) {
    console.warn("Telegram send failed:", err);
  }
}
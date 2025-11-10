import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN ?? "";
const chatId = process.env.TELEGRAM_CHAT_ID ?? "";
let bot: TelegramBot | null = null;
function getBot() {
  if (!bot) bot = new TelegramBot(token, { polling: false });
  return bot;
}

export async function notify(title: string, text: string) {
  if (!token || !chatId) {
    console.log("[NOTIFY]", title, text);
    return;
  }
  await getBot().sendMessage(chatId, `📊 ${title}\n\n${text}`, {
    parse_mode: "Markdown",
  });
}

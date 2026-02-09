import asyncio
import os

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo,
)
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
URL = os.getenv("WEBAPP_URL")

if not TOKEN:
    raise RuntimeError("BOT_TOKEN не задан в .env")
if not URL:
    raise RuntimeError("WEBAPP_URL не задан в .env")

bot = Bot(token=TOKEN)
dp = Dispatcher()
router = Router()


def main_kb() -> ReplyKeyboardMarkup:
    # Только 3 кнопки: Профиль, Открыть WebApp, О приложении
    return ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="👤 Профиль"),
                KeyboardButton(text="🌐 Открыть WebApp", web_app=WebAppInfo(url=URL)),
            ],
            [
                KeyboardButton(text="ℹ️ О приложении"),
            ],
        ],
        resize_keyboard=True
    )


@router.message(CommandStart())
async def start(message: Message):
    await message.answer(
        "Привет! Выбери действие 👇",
        reply_markup=main_kb()
    )


@router.message(F.text == "👤 Профиль")
async def profile(message: Message):
    u = message.from_user
    if not u:
        await message.answer("Не смог прочитать данные пользователя.")
        return

    full_name = " ".join([p for p in [u.first_name, u.last_name] if p]).strip()
    username = f"@{u.username}" if u.username else "—"
    lang = u.language_code or "—"

    text = (
        "👤 *Твой профиль*\n\n"
        f"• Имя: {full_name or '—'}\n"
        f"• Username: {username}\n"
        f"• ID: `{u.id}`\n"
        f"• Язык: `{lang}`\n"
    )
    await message.answer(text, parse_mode="Markdown")


@router.message(F.text == "ℹ️ О приложении")
async def about(message: Message):
    text = (
        "ℹ️ *О приложении*\n\n"
        "Это Telegram Mini App для задач/помодоро/игр и AI-чата.\n"
        "Открывается внутри Telegram через кнопку *🌐 Открыть WebApp*.\n"
    )
    await message.answer(text, parse_mode="Markdown")


@router.message()
async def fallback(message: Message):
    await message.answer(
        "Я понимаю только кнопки ниже 🙂\nНажми */start* если клавиатура пропала.",
        parse_mode="Markdown"
    )


async def main():
    dp.include_router(router)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())

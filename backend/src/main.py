import asyncio
import os

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=TOKEN)
dp = Dispatcher()

router = Router()

def main_menu_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📌 Меню"), KeyboardButton(text="👤 Профиль")],
            [KeyboardButton(text="🌐 Открыть WebApp")],
        ],
        resize_keyboard=True
    )

@router.message(CommandStart())
async def start(message: Message):
    await message.answer(
        "Привет! Выбери действие:",
        reply_markup=main_menu_kb()
    )

@router.message(F.text == "📌 Меню")
async def menu(message: Message):
    await message.answer("Это меню. Что дальше?")

@router.message(F.text == "👤 Профиль")
async def profile(message: Message):
    await message.answer("Это профиль (пока заглушка).")

@router.message(F.text == "🌐 Открыть WebApp")
async def open_webapp(message: Message):
    await message.answer("Сюда лучше сделать Inline кнопку с WebApp (см. ниже).")

async def main():
    dp.include_router(router)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())


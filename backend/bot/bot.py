import asyncio
import os

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
URL = os.getenv("WEBAPP_URL")  # Сайт URL

bot = Bot(token=TOKEN)
dp = Dispatcher()
router = Router()

def main_menu_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📌 Меню"), KeyboardButton(text="👤 Профиль")],
            [KeyboardButton(text="🌐 Открыть WebApp", web_app=WebAppInfo(url=URL))],
            [KeyboardButton(text="О Приложений")],
        ],
        resize_keyboard=True
    )

@router.message(CommandStart())
async def start(message: Message):
    await message.answer("Привет! Выбери действие:", reply_markup=main_menu_kb())

@router.message(F.text == "📌 Меню")
async def menu(message: Message):
    await message.answer("Это меню. Что дальше?")

@router.message(F.text == "👤 Профиль")
async def profile(message: Message):
    await message.answer("Это профиль (пока заглушка).")

@router.message(F.text == "О Приложений")
async def about(message: Message):
    await message.answer("Это профиль (пока заглушка).")

async def main():
    dp.include_router(router)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

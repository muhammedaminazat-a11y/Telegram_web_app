import asyncio
import os
from aiogram import Bot, Dispatcher
from dotenv import load_dotenv

# Загрузка переменных из .env
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=TOKEN)
dp = Dispatcher(bot)

async def main():
    # Регистрация роутеров и запуск
    await dp.start_polling(bot)

# Вход точка программы запуск с файла main.py
if __name__ == "__main__":
    asyncio.run(main())
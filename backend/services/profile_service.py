from fastapi import HTTPException
from backend.schemas.profile import ProfileCreate, ProfileUpdate, ProfileOut

# временное хранилище словарь (замена на PostgreSQL)
profiles = {}

# эндпоинт получения словаря пользователей
def get_profiles() -> list[ProfileOut]:
    return list(profiles.values())

# эндпоинт получения одного пользователя
def get_profile(profile_id: int) -> ProfileOut:
    if profile_id in profiles:
        return profiles[profile_id]
    raise HTTPException(status_code=404, detail="Профиль не найден")

# эндпоинт создание профиля
def create_profile(profile: ProfileCreate) -> ProfileOut:
   profiles_id = len(profiles) + 1 # при создании id увеличивается на 1
   profiles[profiles_id] = {
        "id": profiles_id, 
        "telegram_id": profile.telegram_id,
        "name": profile.name,
        "avatar_url": profile.avatar_url,
        "settings": profile.settings
        }   
   return profiles[profiles_id]

# эндпоинт обновления профиля
def update_profile(profile_id: int, profile: ProfileUpdate) -> ProfileOut:
    if profile_id not in profiles:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    profiles[profile_id].update(profile.dict(exclude_unset=True))
    return profiles[profile_id]

# эндпоинт удаление профиля
def delete_profile(profile_id: int) -> dict:
    if profile_id not in profiles:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    deleted = profiles.pop(profile_id)
    return {"message": f"Профиль {profile_id} удален", "profile": deleted}
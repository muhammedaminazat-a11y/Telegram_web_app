from fastapi import APIRouter, HTTPException
from backend.schemas.profile import (
    ProfileCreate, 
    ProfileUpdate,
    ProfileOut,
)

router = APIRouter(
    prefix="/profile",
    tags=["profile"]
    )

# временное хранилище словарь (замена на PostgreSQL)
profiles = {} 

# эндпоинт получения словаря пользователей
@router.get("/", response_model=list[ProfileOut])
def get_profiles():
    return list(profiles.values())

# эндпоинт получения одного пользователя
@router.get("/{profile_id}", response_model=ProfileOut)
def get_profile(profile_id: int):
    if profile_id in profiles:
        return profiles[profile_id]
    raise HTTPException(status_code=404, detail="Профиль не найден")

# эндпоинт создание профиля
@router.post("/", response_model=ProfileOut)
def create_profile(profile: ProfileCreate):
   profiles_id = len(profiles) + 1 # при создании id увеличивается на 1
   profiles[profiles_id] = {
        "id": profiles_id, 
        "telegram_id": profile.telegram_id,
        "name": profile.name,
        "avatar_url": profile.avatar_url,
        "settings": profile.settings
        }   
   return profiles[profiles_id]


# эндпоинт обновление пользователей 
@router.put("/{profile_id}", response_model = ProfileOut)
def update_profile(profile_id: int, profile: ProfileUpdate):
    if profile_id not in profiles:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    profiles[profile_id].update(profile.dict(exclude_unset=True))
    return profiles[profile_id]

# эндпоинт удаление пользователей 
@router.delete("/{profile_id}")
def delete_profile(profile_id: int):
    if profile_id not in profiles:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    deleted = profiles.pop(profile_id)
    return {"message": f"Профиль {profile_id} удален", "profile": deleted}
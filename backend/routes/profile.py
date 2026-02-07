from fastapi import APIRouter, HTTPException
from backend.services import profile_service
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
    return profile_service.get_profile(profile_id)

# эндпоинт создание профиля
@router.post("/", response_model=ProfileOut)
def create_profile(profile: ProfileCreate):
  return profile_service.create_profile(profile)

# эндпоинт обновление пользователей 
@router.put("/{profile_id}", response_model = ProfileOut)
def update_profile(profile_id: int, profile: ProfileUpdate):
    return profile_service.update_profile(profile_id, profile)

# эндпоинт удаление пользователей 
@router.delete("/{profile_id}")
def delete_profile(profile_id: int):
    return profile_service.delete_profile(profile_id)
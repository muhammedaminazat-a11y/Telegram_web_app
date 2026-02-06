from fastapi import APIRouter, HTTPException
from backend.schemas.tasks import (
    TaskCreate, 
    TaskUpdate,
    TaskOut,
)

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
    )

# временное хранилище словарь (замена на PostgreSQL)
tasks = {}

# эндпоинт получения списка задач
@router.get("/", response_model=list[TaskOut])
def get_tasks():
    return list(tasks.values())

# эндпоинт получения одной задачи
@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int):
    if task_id in tasks:
        return tasks[task_id]
    raise HTTPException(status_code=404, detail="Задача не найдена")


# эндпоинт создание задачи
@router.post("/", response_model=TaskOut)
def create_task(task: TaskCreate):
    task_id = len(tasks) + 1 # при создании id увеличивается на 1
    tasks[task_id] = {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "done": task.done
    }
    return tasks[task_id]

# эндпоинт обновления задачи
@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    tasks[task_id].update(task.dict(exclude_unset=True))
    return tasks[task_id]

# эндпоинт удаление задачи
@router.delete("/{task_id}")
def delete_task(task_id: int):
    if task_id not in tasks:
       raise HTTPException(status_code=404, detail="Задача не найдена")
    deleted = tasks.pop(task_id)
    return {"message": f"Задача {task_id} удалена", "task": deleted}

# функция для статистики 
def get_tasks_count():
    return len(tasks)
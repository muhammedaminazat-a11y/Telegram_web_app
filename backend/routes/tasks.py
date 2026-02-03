from fastapi import APIRouter
from utils.schemas import TaskCreate, TaskUpdate, TaskOut

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
    )

# временное хранилище словарь (замена на PostgreSQL)
tasks = {}

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
        return {"error": "Задача не найдена"}

    update_data = task.dict(exclude_unset=True) # обновление данных

    if not update_data:
        return {"error": "Нет данных для обновления"}

    # Обновляем задачу  
    tasks[task_id].update(update_data)
    return tasks[task_id]

# эндпоинт получения всех задач
@router.get("/", response_model=list[TaskOut])
def get_tasks():
    return list(tasks.values())
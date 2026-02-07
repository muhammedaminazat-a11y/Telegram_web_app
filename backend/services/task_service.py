from fastapi import HTTPException
from backend.schemas.task import TaskCreate, TaskUpdate, TaskOut

# временное хранилище словарь (замена на PostgreSQL)
tasks = {}

# эндпоинт получения списка задач
def get_tasks() -> list[TaskOut]:
    return list(tasks.values())

# эндпоинт получения одной задачи
def get_task(task_id: int) -> TaskOut:
    if task_id in tasks:
        return tasks[task_id]
    raise HTTPException(status_code=404, detail="Задача не найдена")

# эндпоинт создание задачи
def create_task(task: TaskCreate) -> TaskOut:
    task_id = len(tasks) + 1 # при создании id увеличивается на 1
    tasks[task_id] = {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "done": task.done
    }
    return tasks[task_id]

# эндпоинт обновления задачи
def update_task(task_id: int, task: TaskUpdate) -> TaskOut:
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    tasks[task_id].update(task.dict(exclude_unset=True))
    return tasks[task_id]

# эндпоинт удаление задачи
def delete_task(task_id: int) -> dict:
    if task_id not in tasks:
       raise HTTPException(status_code=404, detail="Задача не найдена")
    deleted = tasks.pop(task_id)
    return {"message": f"Задача {task_id} удалена", "task": deleted}
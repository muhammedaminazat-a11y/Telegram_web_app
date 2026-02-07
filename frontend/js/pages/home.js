export function initHome(setActive) {
  const goPomodoro = document.getElementById("goPomodoro");
  const openTasks = document.getElementById("openTasksFromHome");

  if (goPomodoro) goPomodoro.addEventListener("click", () => setActive("pomodoro"));
  if (openTasks) openTasks.addEventListener("click", () => setActive("taks"));
}

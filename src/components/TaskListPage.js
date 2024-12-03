import React, { useState, useEffect } from "react";

const TaskListPage = ({ tasks, toggleComplete, filter }) => {
  //Текущая страница для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  //Массив задач, которые должны отображаться на текущей странице после сортировки и фильтрации.
  const [visibleTasks, setVisibleTasks] = useState([]);
  //Происходит ли завершение задачи. Это нужно для блокировки кнопок.
  const [isTaskBeingCompleted, setIsTaskBeingCompleted] = useState(false); 

  const tasksPerPage = 3;

  useEffect(() => {
    // Сортировка задач
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(`${a.dateTime.date}T${a.dateTime.time}`);
      const dateB = new Date(`${b.dateTime.date}T${b.dateTime.time}`);
      if (dateA.getTime() === dateB.getTime()) {
        return b.id - a.id; // По времени добавления
      }
      return dateA - dateB; // По дате
    });

    // Фильтр задач: "Все задачи" или "Завершенные задачи"
    if (filter === "completed") {
      setVisibleTasks(sortedTasks.filter((task) => task.completed));
    } else {
      setVisibleTasks(sortedTasks.filter((task) => !task.completed));
    }
  }, [tasks, filter]);

  // Завершение задачи с задержкой
  const handleCompleteWithDelay = (taskId) => {
    // Устанавливаем состояние, что задача завершена
    setIsTaskBeingCompleted(true);

    setVisibleTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isMarkingComplete: true } : task
      )
    );

    // Через 3 секунд переводим задачу в completed
    setTimeout(() => {
      toggleComplete(taskId); // Обновляем состояние задачи глобально
      setIsTaskBeingCompleted(false); // Сбрасываем состояние завершения
    }, 3000);
  };

  // Пагинация
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = visibleTasks.slice(indexOfFirstTask, indexOfLastTask);

  const nextPage = () => {
    if (indexOfLastTask < visibleTasks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Эффект для корректной работы пагинации после удаления задачи
  useEffect(() => {
    // Если на текущей странице нет задач, то переходим на предыдущую
    if (currentPage > 1 && currentTasks.length === 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentTasks, currentPage]);

  return (
    <div className="task-list">
      <h2>{filter === "completed" ? "Завершенные задачи" : "Все задачи"}</h2>
      {visibleTasks.length === 0 ? (
        <div className="empty-list-all">
          <p>Список задач пуст</p>
        </div>
      ) : (
        currentTasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.isMarkingComplete ? "completed" : ""}`}
          >
            <div
              className={`task-text ${task.isMarkingComplete ? "completed" : ""}`}
            >
              {task.text.length > 40
                ? `${task.text.slice(0, 40)}...`
                : task.text}
            </div>
            <div
              className={`dateTime ${task.isMarkingComplete ? "completed" : ""}`}
            >
              {task.dateTime.date && task.dateTime.time && (
                <span>
                  {task.dateTime.date} {task.dateTime.time}
                </span>
              )}
            </div>
            <div className="task-status">
              <button
                onClick={() => handleCompleteWithDelay(task.id)}
                disabled={task.isMarkingComplete || isTaskBeingCompleted} // Блокируем кнопки
                className={task.isMarkingComplete || isTaskBeingCompleted ? "disabled" : ""}
              >
                {task.isMarkingComplete ? "Завершается..." : "Не выполнено"}
              </button>
            </div>
          </div>
        ))
      )}
      {/* Кнопки для пагинации */}
      {visibleTasks.length > tasksPerPage && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Назад
          </button>
          <button
            onClick={nextPage}
            disabled={indexOfLastTask >= visibleTasks.length}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;






import { DateTime } from "luxon";
import React, { useState, useEffect } from "react";

const TodayPage = ({ tasks, toggleComplete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [isTaskBeingCompleted, setIsTaskBeingCompleted] = useState(false);

  const tasksPerPage = 3;

  const getOmskDate = () => {
    // Получаем дату в Омске
    const omskDate = DateTime.now().setZone('Asia/Omsk');
    // Возвращаем дату в формате YYYY-MM-DD
    return omskDate.toISODate();
  };

  useEffect(() => {
    const todayDate = getOmskDate();

    // Фильтруем задачи, оставляя только те, которые имеют сегодняшнюю дату
    const filteredTasks = tasks.filter(task => task.dateTime.date === todayDate);

    // Сортируем задачи по времени (по возрастанию)
    const sortedTasks = filteredTasks.sort((a, b) => {
      const timeA = new Date(`${a.dateTime.date}T${a.dateTime.time}`);
      const timeB = new Date(`${b.dateTime.date}T${b.dateTime.time}`);

      return timeA - timeB; // Сортировка по времени (по возрастанию)
    });

    setVisibleTasks(filteredTasks);
  }, [tasks]);

  const handleCompleteWithDelay = (taskId) => {
    setIsTaskBeingCompleted(true);

    // Обновляем локальное состояние, чтобы показать, что задача в процессе завершения
    setVisibleTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isMarkingComplete: true } : task
      )
    );

    // Через 3 секунд переводим задачу в completed
    setTimeout(() => {
      // Обновляем глобальное состояние задачи
      toggleComplete(taskId);

      // Фильтруем завершенные задачи из списка для отображения
      setVisibleTasks((prevTasks) =>
        prevTasks.filter((task) => !task.completed) // Оставляем только незавершенные задачи
      );

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
    if (currentPage > 1 && currentTasks.length === 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentTasks, currentPage]);

  return (
    <div className="task-list">
      <h2>Сегодня</h2>
      {visibleTasks.length === 0 ? (
        <div className="empty-list-all">
          <p>Задач на сегодня нет</p>
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
                disabled={task.isMarkingComplete || isTaskBeingCompleted}
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

export default TodayPage;

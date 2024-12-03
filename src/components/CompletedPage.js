import React, { useState } from "react";

const CompletedPage = ({ tasks, toggleComplete, clearCompleted }) => {
  //Состояние для текущей страницы пагинации.
  const [currentPage, setCurrentPage] = useState(1);
  //Ограничение на количество задач на странице пагинации
  const tasksPerPage = 3;

  //Индекс последней задачи на текущей странице.
  const indexOfLastTask = currentPage * tasksPerPage;
  //Индекс первой задачи на текущей странице
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  //Выбираются задачи, которые будут отображаться на страницу
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Переход на следующую страницу
  const nextPage = () => {
    if (indexOfLastTask < tasks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Переход на предыдущую страницу
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="task-list-page">
      <h2>Завершенные задачи</h2>
      <ul>
        {tasks.length === 0 ? (
          <div className="empty-list">
            <p>Нет завершенных задач</p>
          </div>
        ) : (
          currentTasks.map((task) => (
            <li key={task.id}>
              <span>{task.text}</span>
              <div > ☑</div>
            </li>
          ))
        )}
      </ul>

      {/* Кнопки для пагинации */}
      {tasks.length > tasksPerPage && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Назад
          </button>
          <button
            onClick={nextPage}
            disabled={indexOfLastTask >= tasks.length}
          >
            Вперед
          </button>
        </div>
      )}

      <button className="clear-completed" onClick={clearCompleted}>
        Очистить завершенные
      </button>
    </div>
  );
};

export default CompletedPage;


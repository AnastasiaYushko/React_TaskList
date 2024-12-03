import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddTaskPage from "./components/AddTaskPage";
import TaskListPage from "./components/TaskListPage";
import TodayPage from "./components/TodayPage";
import CompletedPage from "./components/CompletedPage";
import "./styles.css";
import { DateTime } from "luxon";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [toggleTime, setToggleTime] = useState(false);
  const [toggleDate, setToggleDate] = useState(false);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  // Загружаем задачи из localStorage, если они там есть
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks); 
    }
  }, []);

  // Сохраняем задачи в localStorage, когда они изменяются
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  /*Добавление задачи*/
  const addTask = (task) => {
    if (task.text && task.text.trim() !== "") {
      setTasks([task, ...tasks]); // Добавляем задачу в список
      setNewTaskText(""); // Очищаем поле ввода
      setDateTime({ date: "", time: "" }); // Сбрасываем дату и время
    } else {
      alert("Введите текст задачи");
    }
  };

  /*Переключение состояния задачи*/
  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  /*Очистка завершенных задач*/
  const clearCompleted = () => {
    const filteredTasks = tasks.filter((task) => !task.completed);
    setTasks(filteredTasks);
  };

  const getOmskDate = () => {
    const omskDate = DateTime.now().setZone('Asia/Omsk');
    // Возвращаем дату в формате YYYY-MM-DD
    return omskDate.toISODate();
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Страница добавления задачи */}
          <Route
            path="/add-task"
            element={
              <AddTaskPage
                addTask={addTask}
                setNewTaskText={setNewTaskText}
                newTaskText={newTaskText}
                toggleDate={toggleDate}
                toggleTime={toggleTime}
                setToggleDate={setToggleDate}
                setToggleTime={setToggleTime}
                dateTime={dateTime}
                setDateTime={setDateTime}
              />
            }
          />
          {/* Страница всех задач */}
          <Route
            path="/task-list"
            element={
              <TaskListPage
                tasks={tasks}
                toggleComplete={toggleComplete}
              />
            }
          />
          {/* Страница задач на сегодня */}
          <Route
            path="/today"
            element={
              <TodayPage
                tasks={tasks
                  .filter((task) => {
                    const today = getOmskDate();
                    return task.dateTime.date === today && !task.completed; // Фильтруем по дате и незавершенности
                  })}
                toggleComplete={toggleComplete}
              />
            }
          />
          {/* Страница завершенных задач */}
          <Route
            path="/completed"
            element={
              <CompletedPage
                tasks={tasks.filter((task) => task.completed)}
                toggleComplete={toggleComplete}
                clearCompleted={clearCompleted}
              />
            }
          />
          {/* Главная страница с переходами */}
          <Route
            path="/"
            element={
              <div>
                <h1>Task List</h1>
                <div className="task-categories">
                  <Link to="/today">
                    <button>Сегодня</button>
                  </Link>
                  <Link to="/task-list">
                    <button>Все</button>
                  </Link>
                  <Link to="/completed">
                    <button>Завершенные</button>
                  </Link>
                </div>
                <div className="add-task-button">
                  <Link to="/add-task">
                    <button>Добавить задачу</button>
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

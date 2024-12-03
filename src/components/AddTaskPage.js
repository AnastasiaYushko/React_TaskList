import React, { useState, useEffect } from "react";
import { DateTime } from 'luxon';

const AddTaskPage = ({
  addTask,
  setNewTaskText,
  newTaskText,
  toggleDate,
  toggleTime,
  setToggleDate,
  setToggleTime,
  dateTime,
  setDateTime,
}) => {
  const [error, setError] = useState("");


  const getOmskDate = () => {
    const omskDate = DateTime.now().setZone('Asia/Omsk');
    // Возвращаем дату в формате YYYY-MM-DD
    return omskDate.toISODate();
  };

  // Значения по умолчанию для даты и времени
  const defaultDate = getOmskDate();
  const defaultTime = "00:00";

  useEffect(() => {
    if (!dateTime.date) {
      setDateTime((prev) => ({ ...prev, date: defaultDate }));
    }
    if (!dateTime.time) {
      setDateTime((prev) => ({ ...prev, time: defaultTime }));
    }
  }, [dateTime.date, dateTime.time, defaultDate, defaultTime, setDateTime]); 

  // Обработка нажатия кнопки "Добавить"
  const handleAddClick = () => {
    if (!newTaskText.trim()) {
      setError("Ошибка: Введите текст задачи!");
      return;
    }

    // Текущая дата
    const currentDate = new Date();
    // Выбранная дата
    const selectedDate = new Date(dateTime.date);

    const omtskDate = new Date(
      selectedDate.toLocaleString("en-US", { timeZone: "Asia/Omsk" })
    );

    if (omtskDate < currentDate.setHours(0, 0, 0, 0)) {
      setError("Ошибка: Дата не может быть в прошлом!");
      return;
    }

    // Преобразование в дату
    if (toggleDate && toggleTime && dateTime.date && dateTime.time) {
      const [selectedHours, selectedMinutes] = dateTime.time.split(":");
      const selectedTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedHours,
        selectedMinutes,
        0,
        0
      );

      if (selectedTime < currentDate) {
        setError("Ошибка: Время не может быть в прошлом!");
        return;
      }
    }

    const newTask = {
      id: new Date().getTime(),
      text: newTaskText,
      completed: false,
      dateTime: dateTime,
    };

    addTask(newTask);

    // Обнуление после добавления
    setNewTaskText("");
    setToggleDate(false);
    setToggleTime(false);
    setDateTime({ date: defaultDate, time: defaultTime });
    setError("");
  };

  // Обработка переключателя даты
  const handleToggleDate = () => {
    setToggleDate(!toggleDate);

    // Если дата снимается, сбрасываем дату и время
    if (!toggleDate) {
      setDateTime((prev) => ({ ...prev, date: defaultDate }));
    }
    // Если дата снимается, то выключаем время и сбрасываем его
    if (toggleDate) {
      setToggleTime(false);
      setDateTime((prev) => ({ ...prev, time: defaultTime }));
    }
  };

  // Обработка переключателя времени
  const handleToggleTime = () => {
    // Если галочка времени снимается, сбрасываем время на дефолтное
    if (!toggleTime) {
      setDateTime((prev) => ({ ...prev, time: defaultTime }));
    }
    setToggleTime(!toggleTime);
  };

  return (
    <div className="add-task-page">
      <h2>Добавление задачи</h2>
      <div>
        <label>Введите задачу:</label>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          maxLength={40}
          placeholder="Мне нужно сделать..."
        />
      </div>
      <div>
        <label>Установить дату:</label>
        <input
          type="checkbox"
          checked={toggleDate}
          onChange={handleToggleDate} // Обработчик изменения чекбокса даты
        />
        {toggleDate && (
          <input
            type="date"
            value={dateTime.date}
            onChange={(e) => setDateTime({ ...dateTime, date: e.target.value })}
          />
        )}
      </div>
      <div>
        <label>Установить время:</label>
        <input
          type="checkbox"
          checked={toggleTime}
          onChange={handleToggleTime}
          disabled={!toggleDate} // Включается только если выбрана дата
        />
        {toggleTime && (
          <input
            type="time"
            value={dateTime.time}
            onChange={(e) => setDateTime({ ...dateTime, time: e.target.value })}
          />
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="add-button-container">
        <button onClick={handleAddClick}>Добавить</button>
      </div>
    </div>
  );
};

export default AddTaskPage;

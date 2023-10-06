import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

const Calendar = ({
  activeDay,
  listDay,
  isOnlyShow = false,
  setDay,
  action = () => {},
}) => {
  const [isActive, setIsActive] = useState();
  const [date, setDate] = useState(new Date());
  let year = 2023;

  const prevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    setIsActive("");
  };

  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    setIsActive("");
  };

  const getMonthName = () => {
    const options = { month: "long", year: "numeric" };
    year = date.toLocaleDateString("en-US", { year: "numeric" });

    return date.toLocaleDateString("en-US", options);
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return daysOfWeek.map((day) => (
      <div
        key={day}
        className="text-center text-gray-600 uppercase tracking-wide border border-black"
      >
        {day}
      </div>
    ));
  };

  const renderDays = () => {
    let currentMonth = date.getMonth();
    let currentYear = new Date().getFullYear();

    const daysInMonth = new Date(
      date.getFullYear(),
      currentMonth + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      currentMonth,
      1
    ).getDay();

    const days = [];
    // const prevMonth = new Date(date.getFullYear(), currentMonth - 1, 1);
    // const nextMonth = new Date(date.getFullYear(), currentMonth + 1, 1);

    // Lấy số ngày còn lại của tháng trước
    const daysInPrevMonth = new Date(
      date.getFullYear(),
      currentMonth,
      0
    ).getDate();
    const startDay = daysInPrevMonth - firstDayOfMonth + 1;

    // Ngày đầu tiên trong tuần của tháng sau
    const nextMonthStartDay = 1;

    // Ngày hiện tại
    const currentDate = new Date().getDate();

    // Lặp qua ngày của tháng trước
    for (let i = startDay; i <= daysInPrevMonth; i++) {
      const showIcon = _.find(listDay, (iconDay) => {
        return iconDay === parseFullDate(i, currentMonth, true);
      });
      const currentYear = new Date().getFullYear();

      days.push(
        <div
          key={`${currentYear}-${currentMonth}-${i}`}
          className={`calendar-day calendar-day-inactive text-gray-300 border border-black pl-1 pt-1 ${
            isOnlyShow ? "pointer-events-none" : ""
          }`}
          onClick={() =>
            dateClick(
              "prev",
              { day: i, month: currentMonth },
              parseFullDate(i, currentMonth, true)
            )
          }
        >
          <p>{i}</p>
          <div
            className={`text-right pr-2 text-[#2b78e4] ${
              !showIcon ? "opacity-0" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
        </div>
      );
    }

    // Lặp qua ngày của tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
      const showIcon = _.find(listDay, (iconDay) => {
        return iconDay === parseFullDate(day, currentMonth + 1);
      });

      const currentYear = new Date().getFullYear();
      const isCurrentDate =
        day === currentDate && currentMonth === new Date().getMonth();
      const dayClass = isCurrentDate
        ? "calendar-day calendar-day-active border border-black pl-1 pt-1"
        : "calendar-day border border-black pl-1 pt-1";
      days.push(
        <div
          key={`${currentYear}-${currentMonth + 1}-${day}`}
          className={`${currentDate + "-" + currentMonth} ${dayClass} ${
            isActive === day ? "bg-gray-300" : ""
          } 
            ${isOnlyShow ? "pointer-events-none" : ""}
          `}
          onClick={() =>
            dateClick(
              "",
              { day: day, month: currentMonth + 1, year: year },
              parseFullDate(day, currentMonth + 1, true)
            )
          }
        >
          <p>{day}</p>
          <div
            className={`text-right pr-2 text-[#2b78e4]  ${
              !showIcon ? "opacity-0" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
        </div>
      );
    }

    // Lặp qua ngày của tháng sau
    for (let i = nextMonthStartDay; days.length < 42; i++) {
      const showIcon = _.find(listDay, (iconDay) => {
        return iconDay === parseFullDate(i, currentMonth + 2);
      });

      days.push(
        <div
          key={`next-${i}`}
          className={`calendar-day calendar-day-inactive text-gray-300 border border-black pl-1 pt-1 ${
            isOnlyShow ? "pointer-events-none" : ""
          }`}
          onClick={() =>
            dateClick(
              "next",
              { day: i, month: currentMonth + 1 },
              parseFullDate(i, currentMonth + 2, true)
            )
          }
        >
          <p>{i}</p>
          <div
            className={`text-right pr-2 text-[#2b78e4] ${
              !showIcon ? "opacity-0" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
        </div>
      );
    }

    return days;
  };

  const parseFullDate = (day, month, isFormat = false) => {
    const parseMonth = month > 10 ? month : `0${month}`;
    const parseDay = day > 10 ? day : `0${day}`;

    return !isFormat
      ? `${parseMonth}${parseDay}${date.getFullYear()}`
      : `${parseMonth}-${parseDay}-${date.getFullYear()}`;
  };

  const dateClick = (action, day, date) => {
    switch (action) {
      case "next":
        nextMonth();
        break;
      case "prev":
        prevMonth();
        break;

      default:
        setIsActive(day.day);
        setDay(day);
        break;
    }
  };

  useEffect(() => {
    if (!activeDay) return;
    setIsActive(parseInt(activeDay.split("/")[0] ?? 0));
  }, []);

  useEffect(() => {
    action(renderDays());
  }, []);

  return (
    <div className="calendar-container border border-black">
      <div className="calendar-header flex justify-between items-center p-2 border border-black">
        <button
          className="calendar-nav-button focus:outline-none text-3xl"
          onClick={prevMonth}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>
        <div className="calendar-month text-xl font-bold">{getMonthName()}</div>
        <button
          className="calendar-nav-button focus:outline-none text-3xl"
          onClick={nextMonth}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>
      <div className="calendar-grid grid grid-cols-7 text-sm">
        {renderDaysOfWeek()}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;

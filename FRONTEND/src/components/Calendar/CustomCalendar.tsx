import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { isSaturday, isSunday } from "date-fns";
import "./CustomCalendar.css";

type Value = Date | [Date, Date];

function CustomCalendar() {
  const [value, setValue] = useState<Value>(new Date());

  const handleDateChange = (selectedDate: Date) => {
    setValue(selectedDate);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      if (isSaturday(date)) return "saturday";
      if (isSunday(date)) return "sunday";
    }
    return "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <main style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Calendar
          locale="en-US"
          onChange={handleDateChange}
          value={value}
          formatDay={(locale, date) => moment(date).format("DD")}
          tileClassName={tileClassName}
          showNeighboringMonth={false}
          tileContent={({ date }) => <div className="date-tile">{date.getDate()}</div>}
        />
      </main>
    </div>
  );
}

export default CustomCalendar;

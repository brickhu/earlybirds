import { createEffect, createMemo, createSignal, Match, Switch } from "solid-js";
import { displayZoneTime } from "../lib/units";
import { Icon } from "@iconify-icon/solid";
import Spinner from "./spinner";
import { createStore } from "solid-js/store";

// 获取某月的日期区间（从该月第一天所在的周日，到该月最后一天所在的周六）
function getMonthDays(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay()); // 回到周日

  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // 到周六

  const days = [];
  let date = new Date(start);
  while (date <= end) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// 获取当前周的所有日期
function getWeekDays(base){
  const start = new Date(base);
  start.setDate(base.getDate() - base.getDay()); // 本周周日
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default props => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date()
  const [view, setView] = createSignal("week");
  const [currentMonth, setCurrentMonth] = createSignal(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );


  const events = createMemo(()=>{
    const map = {};
    (props?.events || []).forEach((e) => {
      const key = new Date(e?.timestamp)?.toISOString()?.split("T")?.[0]
      map[key] = e;
    });
    return map;
  })



  const toggleView = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setView(view() === "month" ? "week" : "month");
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth().getFullYear(), currentMonth().getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (currentMonth().getTime() < thisMonth.getTime()) {
      setCurrentMonth(
        new Date(currentMonth().getFullYear(), currentMonth().getMonth() + 1, 1)
      );
    }
  };

  createEffect(()=>{
    props?.onChange && props?.onChange(currentMonth())
  })


  return(
    <div className="grid grid-cols-7 gap-2">
      <button 
        className="col-span-full divider text-xs text-current/60 gap-2"
        classList={{
          "cursor-zoom-in" : view() == "week",
          "cursor-zoom-out" : view() == "month",
        }}
        onClick={toggleView}
      >
        <span classList={{"skeleton" : props?.events?.loading}}>{displayZoneTime(currentMonth()).month}</span>
      </button>
      <div className=" col-span-full grid grid-cols-subgrid gap-2 text-xs text-current/60">
        <For each={weekdays}>
          {(w)=><div className="col-span-1 uppercase text-center">{w}</div>}
        </For>
      </div>
      <For each={view()=="month"?getMonthDays(currentMonth()) : getWeekDays(today)}>
        {(date)=>{
          const ymd = date?.toISOString()?.split("T")?.[0]; // "YYYY-MM-DD"
          const isToday =
              date?.getDate() === today?.getDate() &&
              date?.getMonth() === today?.getMonth() &&
              date?.getFullYear() === today?.getFullYear();

          const isCurrentMonth = 
            date.getMonth() === currentMonth().getMonth() &&
            date.getFullYear() === currentMonth().getFullYear();

          return(
            <div 
              className=" col-span-1 flex items-center justify-center"
            >
              <div 
                style={{
                  "--color-bg" : events()?.[ymd]?.background || "transparent",
                  "--color-text" : events()?.[ymd]?.color || "currentColor"
                }}
                className=" size-8 text-sm text-[var(--color-text)] bg-[var(--color-bg)] border-[var(--color-bg)] rounded-full border flex items-center justify-center"
                classList={{
                  "opacity-100" : isCurrentMonth,
                  "opacity-50" : !isCurrentMonth
                }}
              >
                <div className="tooltip" data-tip={events()?.[ymd]?.text}>
                  <button classList={{
                    "font-bold underline decoration-dotted decoration-4" : isToday
                  }}>
                    {date?.getDate()}
                  </button>
                </div>
              </div>
            </div>
          )
        }}
      </For>
      <Show when={view()=="month"}>
        <div className="flex items-center col-span-full justify-end gap-4 px-2">
          <button 
            className="btn btn-circle btn-sm"
            onClick={prevMonth}
            disabled={props?.loading}
          >
            <Icon icon="iconoir:arrow-left" />
          </button>
          <button 
            className="btn btn-circle btn-sm"
            disabled={currentMonth() >= new Date(today.getFullYear(), today.getMonth(), 1) || props?.loading}
            onClick={nextMonth}
          ><Icon icon="iconoir:arrow-right" /></button>
        </div>
      </Show>
    </div>
  )
}
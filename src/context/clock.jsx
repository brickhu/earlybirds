import { createContext, useContext, Suspense, createResource, createEffect, Switch, Match, ErrorBoundary, createSignal, createMemo,onCleanup} from "solid-js";
import { displayZoneTime, formatUTCOffsetString } from "../lib/units";
const ClockContext = createContext()

function getDateWithOffset(offsetMinutes,ts) {
  const now = ts?new Date(ts):new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const targetTime = new Date(utcTime - offsetMinutes * 60000);
  return targetTime;
}
function isSameDayWithOffset(timestamp1, timestamp2, offsetMinutes) {
  const offsetMs = offsetMinutes * 60 * 1000;

  const localTime1 = new Date(timestamp1 + offsetMs);
  const localTime2 = new Date(timestamp2 + offsetMs);

  return (
    localTime1.getUTCFullYear() === localTime2.getUTCFullYear() &&
    localTime1.getUTCMonth() === localTime2.getUTCMonth() &&
    localTime1.getUTCDate() === localTime2.getUTCDate()
  );
}


export const ClockProvider = (props) => {
  let frameid
  let _clock_settings
  let initial_timestamp = new Date().getTime()
  const [offset,setOffset] = createSignal(new Date().getTimezoneOffset())
  const [customOffset,setCustomOffset] = createSignal()

  const [date,setDate] = createSignal(null)
  const [time,setTime] = createSignal("00:00:00")
  const [countdown,setCountdown] =  createSignal(0)
  const [timestamp,setTimestamp] = createSignal(initial_timestamp)

  const getUTCOffsetString = (offset) => {
    const _offset = offset || 0
    const hr = _offset / 60
    const str = "utc"+(hr >= 0?"-":"+")+Math.abs(hr)
    return str
  }

  const offsetString = createMemo(()=>formatUTCOffsetString(offset()))

  const syncOffset = () => {
    setOffset(customOffset())
    _clock_settings.close()
  }

  const updateClock = () => {
    // const d = getDateWithOffset(offset())
    // const current_ts = d.getTime()
    const ts = Date.now()
    const {date,clock} = displayZoneTime(ts,offset())
    setTime(clock);
    setDate(date)
    setCountdown(ts-initial_timestamp)
    // setTimestamp(current_ts)
    // setUtcString(getUTCOffsetString(offset()))
    frameid = requestAnimationFrame(updateClock);
  };

  createEffect(() => {
    frameid = requestAnimationFrame(updateClock);
    onCleanup(() => cancelAnimationFrame(frameid));
  });

  const hooks = {
    offset,
    date,
    time,
    countdown,
    timestamp,
    changeTimeZone : (e)=> {
      if(e&&e!=offset()){
        setCustomOffset(e)
        _clock_settings.showModal()
      }
      
    },
    getUTCOffsetString,
    offsetString,
    setOffset,
    // isSameDay : (ts1,ts2,of) => isSameDayWithOffset(ts1,ts2||timestamp(),of||offset()),
    getTheUserTimeByTimestamp : (ts) => {
       const d = getDateWithOffset(offset(),ts)
       return d.toLocaleTimeString('en-US',{
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
    },
    getDateWithOffset
  }

  return(
    <ClockContext.Provider value={hooks}>
      {props.children}
      <dialog id="clock_settings" className="modal" ref={_clock_settings}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">🌎 Choose Your Time Zone!</h3>
          <div className="py-4">
            <p>Your check-in time zone is different from your system time zone. Switch now?</p>
            <p>{getUTCOffsetString(offset())} - {getUTCOffsetString(customOffset())}</p>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={syncOffset}>Switch</button>
            <form method="dialog">
              <button className="btn">Ignore</button>
            </form>
          </div>
        </div>
      </dialog>
    </ClockContext.Provider>
  )
}

export const useClock = ()=> useContext(ClockContext)
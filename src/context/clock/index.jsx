import { createContext, useContext, Suspense, createResource, createEffect, Switch, Match, ErrorBoundary, createSignal, createMemo,onCleanup} from "solid-js";
import { displayZoneTime, formatUTCOffsetString, formatOffsetHourToUTC } from "../../lib/units";
import { storage } from "../../lib/storage";
import { useWallet } from "arwallet-solid-kit";
const ClockContext = createContext()

function getDateWithOffset(offsetMinutes,ts) {
  const now = ts?new Date(ts):new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const targetTime = new Date(utcTime - offsetMinutes * 60000);
  return targetTime;
}
// function isSameDayWithOffset(timestamp1, timestamp2, offsetMinutes) {
//   const offsetMs = offsetMinutes * 60 * 1000;

//   const localTime1 = new Date(timestamp1 + offsetMs);
//   const localTime2 = new Date(timestamp2 + offsetMs);

//   return (
//     localTime1.getUTCFullYear() === localTime2.getUTCFullYear() &&
//     localTime1.getUTCMonth() === localTime2.getUTCMonth() &&
//     localTime1.getUTCDate() === localTime2.getUTCDate()
//   );
// }




export const ClockProvider = (props) => {
  let frameid
  let _clock_settings
  let initial_timestamp = new Date().getTime()
  const offsetHours =  [0,1,2,3,4,4.5,5,5.5,5.75,6,6.5,7,8,9,9.5,10,11,12,13,-1,-2,-2.5,-3,-4,-4.5,-5,-6,-7,-8,-10,-11,-12]
  const weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
  const { address } = useWallet()
 
  const [offset,setOffset] = createSignal(new Date().getTimezoneOffset())
  const [customOffset,setCustomOffset] = createSignal()
  const [owner,setOwner] = createSignal()

  const [date,setDate] = createSignal(null)
  const [time,setTime] = createSignal("00:00:00")
  const [countdown,setCountdown] =  createSignal(0)
  const [timestamp,setTimestamp] = createSignal(initial_timestamp)
  const [canlender,setCanlender] = createSignal()

  const getUTCOffsetString = (offset) => {
    const _offset = offset || 0
    const hr = _offset / 60
    const str = "utc"+(hr >= 0?"-":"+")+Math.abs(hr)
    return str
  }

  const offsetString = createMemo(()=>formatUTCOffsetString(offset()))
  const offsetInHour = createMemo(()=>offset()/60)
  const isSameTimeOffsetToSystem = createMemo(()=>offset()==new Date().getTimezoneOffset())
  // const canlender = createMemo(()=>{
  //   const weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
  //   const today = new Date(Date.now()+offset());
  //   const days = []
  //   for (let i = 6; i >= 0; i--) {
  //     const date = new Date();
  //     date.setDate(today.getDate() - i);
  //     days.push(date);
  //   }

  //   return days.map((d)=>[d.getDate(),weekdays[d.getDay()],getDateKey(d.getTime())])

  // })

  const syncOffset = () => {
    setOffset(customOffset())
    storage.set(`offset-${owner()}`,customOffset())
    _clock_settings.close()
  }

  const zones = createMemo(()=>{
    let details = {}
    offsetHours.forEach(element => {
      details[element] = {
        hour : element,
        text : formatOffsetHourToUTC(element)
      }
    });
    return details
  })

  const updateClock = () => {
    const ts = Date.now()
    const {date,clock} = displayZoneTime(ts,offset())
    setTime(clock);
    setDate(date)
    setCountdown(ts-initial_timestamp)
    frameid = requestAnimationFrame(updateClock);
  };

  createEffect(() => {
    frameid = requestAnimationFrame(updateClock);
    onCleanup(() => cancelAnimationFrame(frameid));
  });
  createEffect(()=>{
    if(address()!=null){
      const user_local_offset = storage.get(`offset-${address()}`)
      if(user_local_offset) {
        setOffset(user_local_offset)
      }
      setOwner(address())
    }
  })

  createEffect(()=>{
    const today = new Date(Date.now()+offset());
    const days = []
  })


  

  const hooks = {
    offsetHours,
    zones,
    offset,
    date,
    time,
    countdown,
    timestamp,
    displayTimeZoneSetting : (e)=>{
      setCustomOffset(e?.offset)
      setOwner(e?.owner)
      _clock_settings.showModal()
    },

    getUTCOffsetString,
    offsetString,
    setOffset,
    offsetInHour,
    getTheUserTimeByTimestamp : (ts) => {
       const d = getDateWithOffset(offset(),ts)
       return d.toLocaleTimeString('en-US',{
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
    },
    getTheClockDatetime : (ts) => {
      return displayZoneTime(ts, offset())
    },
    getDateWithOffset,
    isSameTimeOffsetToSystem
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
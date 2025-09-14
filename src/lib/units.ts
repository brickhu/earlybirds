const months   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function pad(num, length = 2) {
  return num.toString().padStart(length, '0');
}

export function getFormattedTime(tz: number) {
  const now = typeof tz === 'number' ? new Date(Date.now() + tz * 60 * 60 * 1000) : new Date();
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  return `${h}:${m}:${s}`;
}

export function toBalanceValue(balance: number, precision: number, len?: number): string {
  const n = (balance / Math.pow(10, precision)).toFixed(len || 0);
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  const _n = parseFloat(String(n))
  // return _n.toLocaleString()
  return String(n)
}

export function toBalanceQuantity(value: number, precision: number): number {
  return value * Math.pow(10, precision);
}

export function shortStr(text: string, len?: number, space?: string): string {
  const first = len || 8;
  const end = len ? -len - 1 : -7;
  return text.slice(0, first) + (space || "...") + text.slice(end);
}

// export function getDateWithOffset(offsetMinutes,ts) {
//   const now = ts?new Date(ts):new Date();
//   const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
//   const targetTime = new Date(utcTime - offsetMinutes * 60000);
//   return targetTime;
// }

// export function formatTimestampToUTCString(timestamp: number) {
//   const date = new Date(timestamp);
//   return date.toUTCString();
// }

// export function formatTimestampToISOString(timestamp: number) {
//   const date = new Date(timestamp);
//   return date.toISOString();
// }

export function formatTimeStampToDateString(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US',{
      year: "numeric",
      month: "long",
      day: "numeric",
    })
}


// export function toUTCString(timestamp: number) {
//   const d = new Date(timestamp || Date.now())
//   return d.toUTCString()
// }

// export function formatTimeStampToDateStringWithTimezone(timestamp: number, offset: number) {  
//   const  offsetMillis = offset * 60 * 1000 || 0;
//   const date = new Date(timestamp + offsetMillis);
//   const dstr =  date.toLocaleDateString('en-US',{
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   return dstr
// }

export function displayZoneTime(timestamp:number, offset: number = 0){
  const ts = (timestamp || Date.now()) - offset * 60 * 1000
  const d = new Date(ts)
  const year = d.getUTCFullYear()
  const month = d.getUTCMonth()
  const date = d.getUTCDate()
  const hour = d.getUTCHours()
  const mins = d.getUTCMinutes()
  const seconds = d.getUTCSeconds()

  const sign = offset >= 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const offsetH = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetM = String(absOffset % 60).padStart(2, "0");
  const gmtOffset = `GMT${sign}${offsetH}${offsetM}`;

  const hh_mm_ss = `${String(hour).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`

  return {
    date : `${months[month]} ${String(date).padStart(2,"0")}, ${year}`,
    clock : `${hh_mm_ss}`,
    time : `${hh_mm_ss} ${gmtOffset}`,
    full : `${months[month]} ${String(date).padStart(2,"0")} , ${year} ${String(hour).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(seconds).padStart(2,"0")} ${gmtOffset}`,
    gmt : gmtOffset,
    gmt_short : `GMT${sign}${offsetH}`
  }
}


export function displayUtcTime(timestamp){

}


export function formatOffsetHourToUTC(offset_h : number){
  const sign = offset_h > 0 ? "-" : "+";
  const absOffsetH = Math.abs(offset_h);
  return `UTC${sign}${String(absOffsetH)}`
}


export function formatUTCOffsetString(offset : number){
  return formatOffsetHourToUTC(offset / 60)
}

export function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(1,2),16);
    var g = parseInt(hexcolor.substr(3,2),16);
    var b = parseInt(hexcolor.substr(5,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}
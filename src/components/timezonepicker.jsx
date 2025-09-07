import { For,onMount } from "solid-js"
import { ModalBox, ModalTitle, ModalContent } from "./modal"
export default props =>{
  let _tzpicker
  let tzs = Intl.supportedValuesOf("timeZone").map((tz)=>{
    const date = new Date()
    const dtf = new Intl.DateTimeFormat("en-US", {
    tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = dtf.formatToParts(date).reduce((acc, p) => {
    if (p.type !== "literal") acc[p.type] = parseInt(p.value, 10);
    return acc;
  }, {});

  const asUTC = Date.UTC(
    parts.year, (parts.month || 1) - 1, parts.day || 1,
    parts.hour || 0, parts.minute || 0, parts.second || 0
  );

  const asTS = date.getTime();
  // 关键修正：用 asTS - asUTC 才与 getTimezoneOffset 同号
  const offset = (asTS - asUTC) / 60000; // 分钟
    return({
      name : tz,
      offset : offset
    })
  })
   onMount(()=>{
      props?.ref({
        show:(tz)=>{
          _tzpicker.show()
        },
        hide:(e)=>{
         _tzpicker.close()
        }
      })
    })
  return(
    <ModalBox id="eb_planner" ref={_tzpicker} closable={true}>
      <ModalTitle>choose time zone</ModalTitle>
      <ModalContent>
        <select defaultValue="Pick a color" className="select">
          <For each={tzs}>
            {({name,offset})=><option>{offset + " | " +name}</option>}
          </For>
        </select>
      </ModalContent>
    </ModalBox>
  )
}
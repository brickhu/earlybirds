import { A } from "@solidjs/router"
import { createEffect, createMemo, createSignal, mergeProps } from "solid-js"
import Avatar from "./avatar"
import { Icon } from "@iconify-icon/solid"
import { displayZoneTime,  getContrastYIQ } from "../lib/units"


import { Currency } from "./currency"
export const CheckinCard = props => {
  const {color,note,mint,mid,recipient,time,timezone,cid} = mergeProps({note:""},props)
  const [style,setStyle] = createSignal({
    "--color-bg" :  "var(--color-base-200)",
    "--color-fg" :  "var(--color-base-content)"
  })

  createEffect(()=>{
    if(color && color?.length === 7) {
      const _color = color || "#ff00ff"
      const _constras_color = getContrastYIQ(color)

      setStyle({
        "--color-bg" :  _color || "#ff00ff",
        "--color-fg" : `color-mix(in srgb, ${_color} 20%, ${_constras_color || "#00ff00"}) `
      })

    }
    
  })
  return(
    <div 
      className="aspect-3/2 bg-[var(--color-bg)] text-[var(--color-fg)] p-4 rounded-2xl overflow-hidden border-1 box-border border-[var(--color-fg)]/5 hover:border-[var(--color-fg)]/20 hover:scale-95 transition-all" 
      style={style()}>
        <A href={"/checkin/"+cid} className="flex flex-col justify-between h-full">
        <div>
          <p className="flex items-center gap-2">
            <Avatar className="size-6" username={recipient}/>
            <span>{displayZoneTime(time,timezone)?.date}</span>
          </p>
          
          <p className="text-2xl pt-2 flex-1 overflow-ellipsis line-clamp-3">
            {note}
          </p>
        </div>
       
        <div className="flex w-full items-end justify-between">
           <ul className="text-current/60 text-xs">
           <li className="flex items-center gap-2">
              <Icon icon="iconoir:clock" />
              <span>{displayZoneTime(time,timezone)?.time}</span>
            </li>
            {/* <li className="flex items-center gap-2">
              <Icon icon="iconoir:time-zone" />
              <span>{timezone && formatUTCOffsetString(timezone)}</span>
            </li> */}
            <li className="flex items-center gap-2">
              <Icon icon="iconoir:coin" />
              <Currency value={mint} precision={12} fixed={12} ticker="$WORM"/>
            </li>
        </ul>

        <div><Icon icon="iconoir:arrow-right" /></div>
        </div>   
        </A>
    </div>
  )
} 
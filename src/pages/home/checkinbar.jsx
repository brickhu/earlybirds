
import { Switch, Match, createSignal, createEffect, batch, createResource, createMemo } from "solid-js"
import { useGlobal, useUser, useClock } from "../../context"
import { useWallet } from "arwallet-solid-kit"
import { Icon } from "@iconify-icon/solid"
import Checkineditor from "../../components/checkineditor"
import { toBalanceValue,displayZoneTime } from "../../lib/units"
import { getContrastYIQ } from "../../lib/color"
import { A } from "@solidjs/router"

const voice = `https://arweave.net/IBZrhh25HHoYDUuPLa3DNbf6O5XcB4D2rzDA4P9YmP4`

const DoubleDots = props => {
  return (
    <svg className="w-full" viewBox="0 0 141 257" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="95" r="12" fill="currentColor"/>
      <circle cx="70" cy="165" r="12" fill="currentColor"/>
    </svg>
  )
}

const TimeBlock = props => {
  return <div className="grid grid-cols-8 gap-2 md:gap-3 lg:gap-4 w-full py-4 md:py-0">{props?.children}</div>
}
const TimeCharacter = props => {
  return <div className="col-span-1 w-full h-fit flex items-center justify-center leading-tight font-stretch-expanded slashed-zero lining-nums tabular-nums"><div className="text-[16cqw] md:text-[14cqw] w-fit h-fit">{props?.value || props?.children}</div></div>
}

export default props => {
  let _checkineditor
  let _voice
  const { walletConnectionCheck,address} = useWallet()
  const {time,date,timestamp} = useClock()
  const {toast,checkinProcess,setStyle} = useGlobal()
  const {profile , refetchProfile , plan , latest, openPlanner, refetchArBalance, refetchWormBalance} = useUser()
  const [color,setColor] = createSignal()
  const [checked,setChecked] = createSignal(false)
  const [checkin,setCheckin] = createSignal()

  // const renderCheckinButton = createMemo(()=>{

  //   return()
  // })

  const DateBlock = () => {
    return(
      <div className='text-2xl md:text-xl flex items-center gap-4 w-full justify-between md:justify-start md:px-2 '>
        <div 
          className='size-8 md:size-12 text-sm md:text-xl rounded-full  flex items-center justify-center'
          classList={{
            "bg-base-300 text-base-content" : !checked(),
            "bg-primary text-primary-content" : checked()
          }}
        >
          <Switch>
            <Match when={checked()}><Icon icon="iconoir:check" /></Match>
            <Match when={!checked()}><Icon icon="iconoir:calendar" /></Match>
          </Switch>
        </div>
        <span className='text-current/60'>{date()}</span>
      </div>
    )
  }

  const CheckinBlock = () => {
    return (
      <div className='flex md:flex-row flex-col-reverse items-center gap-4 w-full justify-end'>
        <Switch>
          <Match when={checked()}>
            <span className="text-sm">Checked-In & minted <b>{toBalanceValue(checkin()?.mint || 0,12,4)}</b> $WORM</span>
            <A href={`/checkin/${checkin()?.id}`} className="btn btn-outline btn-primary w-full md:w-auto  md:aspect-square md:btn-circle btn-xl md:btn-lg rounded-full">
              <span className="md:hidden">View the Check-In</span>
              <Icon icon="iconoir:arrow-right" />
            </A>
          </Match>
          <Match when={!checked()}>
            <span className='text-sm'>From 6-8 AM daily</span>
            <button 
              className='btn btn-neutral rounded-full w-full md:w-fit btn-xl md:btn-lg'
              use:walletConnectionCheck={HandleEarlyCheckin} 
              disabled={profile.loading}
              classList={{"skeleton":profile.loading}}
            >
              <Show when ={plan()&&plan()?.next} fallback={<>Start Check-in Challenge <Icon icon="iconoir:arrow-right" /></>}>
                Check-In Later <Icon icon="iconoir:arrow-right" />
              </Show>
            </button>
          </Match>
        </Switch>
    </div>
    )
  }

  const HandleEarlyCheckin = ()=>{
      if(!plan()) {
        console.log("missed plan")
        openPlanner()
        return
      }else{
        console.log("plan:",plan())
        let now = new Date().getTime()
        console.log('now: ', now);
        let start = plan()?.next
        console.log('start: ', start);
        let end = plan()?.next + 2*60*60*1000
        console.log('end: ', end);
        if(now>=end){
          openPlanner(plan())
          return
        }
        _checkineditor.show()
      }
    }
  
    createEffect(async()=>{
      if(address() && profile?.state === "ready" && profile()){
        let {latest_checkin} = profile()
        if(!latest_checkin || typeof latest_checkin !== "object"){
          batch(()=>{
            setCheckin(null)
            setColor(null)
            setChecked(false)
          })
        }
        let {timestamp,offset,color} = latest_checkin
        if(date() == displayZoneTime(timestamp,offset)?.date){
          console.log("checked!")
          batch(()=>{
            setCheckin(latest_checkin)
            setColor(color?.length === 7?color:null)
            setChecked(true)
          })
        }else{
          batch(()=>{
            setCheckin(null)
            setColor(null)
            setChecked(false)
          })
        }
      }    
    })
    createEffect((()=>{
      if(color()){
        const _color = color()
        const _constras_color = getContrastYIQ(_color)
        setStyle({
          "--color-primary" : _color,
          "--color-primary-content" : _constras_color
        })
      }else{
        setStyle({
          "--color-primary" : "",
          "--color-primary-content" : ""
        })
      }
    }))

  return(
    <>

     <div className="w-full grid gap-4 grid-cols-4 border-t border-current/20 pt-8 md:pt-0 px-4 md:px-0 pb-4">
        <div className=" col-span-4 md:col-span-2 order-1 md:order-2">
          <DateBlock/>
        </div>
        <div 
          className=" col-span-full order-2 md:order-1 p-2 md:p-0"
          classList={{
            "text-primary" : checked(),
            "text-base-content" : !checked()
          }}
        >
          <TimeBlock>
            <TimeCharacter value={checked()?displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock?.[0] : (time()?.[0] || "0")}/>
            <TimeCharacter value={checked()?displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock?.[1] : (time()?.[1] || "0")}/>
            <TimeCharacter ><DoubleDots/></TimeCharacter>
            <TimeCharacter value={checked()?displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock?.[3] : (time()?.[3] || "0")}/>
            <TimeCharacter value={checked()?displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock?.[4] : (time()?.[4] || "0")}/>
            <TimeCharacter ><DoubleDots/></TimeCharacter>
            <TimeCharacter value={checked()?displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock?.[6] : (time()?.[6] || "0")}/>
            <TimeCharacter value={checked()?displayZoneTime(checkin()?.timestamp,checkin()?.offset)?.clock?.[7] : (time()?.[7] || "0")}/>
          </TimeBlock>
        </div>
        <div className=" col-span-4 md:col-span-2 order-3"><CheckinBlock/></div>
    </div>
      <Checkineditor 
        ref={_checkineditor}
        address={address()}
        date={date()}
        onCheckedSuccessful={(checked)=>{
          batch(()=>{
            setChecked(true)
            setCheckin(checked)
          })
          toast.success(`You’ve checked in and got ${toBalanceValue(checkin()?.mint,12)} $WORM!`)
          _voice.play()
          if(props?.onCheckedSuccessful){
            props.onCheckedSuccessful(checked)
          }
        }}
      />
      {/* famale voice : good morning, earlybird */}
      <audio src={voice} controls={false} ref={_voice} />
    </>
  )
}
import { createContext, useContext, createResource, createEffect, createMemo, createSignal, Switch, Show} from "solid-js";
import { useWallet } from  "arwallet-solid-kit"
import { fetchUserProfile, fetchBalance,hbFetchUserProfile, hbFetchBalance, hbFetchPlan } from "../../api"
import { useGlobal,useClock } from "../index"
import { Icon } from "@iconify-icon/solid"
import Planner from "../../components/planner";
import { shortStr } from "../../lib/units";
import { Copyable } from "../../components/copyable";
import { Currency } from "../../components/currency";

const UserContext = createContext()

export const UserProvider = (props) => {
  let _planner
  const {address, disconnect} = useWallet()
  const {env,toast} = useGlobal()
  const {changeTimeZone,offset} = useClock()
  const [show,setShow] = createSignal(false)
  // const [plan,setPlan] = createSignal()

  const [profile,{refetch:refetchProfile}] = createResource(()=>({pid:env?.checkin_pid,address:address()}) ,hbFetchUserProfile)
  const [arBalance,{refetch:refetchArBalance}] = createResource(()=>({pid: env?.artoken_pid, address: address()}), fetchBalance)
  const [wormBalance,{refetch:refetchWormBalance}] = createResource(()=>({pid: env?.wrom_pid, address: address()}), hbFetchBalance)
  const plan = createMemo(()=>profile?.state==="ready" && profile()?.plan_detail)
  const latest = createMemo(()=>profile?.state==="ready" && profile()?.latest_checkin)
  


  const handlePlan = (plan) => {
    const timeZones = Intl.supportedValuesOf("timeZone");
    console.log('timezones: ', timeZones);
    _planner?.show()
  }
  const hooks = {
    id : address(),
    profile,
    refetchProfile,
    latest,
    plan,
    openPlanner : (plan) => handlePlan(plan),
    arBalance,
    refetchArBalance,
    wormBalance,
    refetchWormBalance
  }

  createEffect(()=>{
    if(profile.state == "ready"){
      const user_offset = profile()?.plan?.offset || profile()?.offset
      if(user_offset!==offset()){
        changeTimeZone(user_offset)
      }
    }
  })

  return(
     <UserContext.Provider value={hooks}>
      
      <div className="drawer drawer-end">
        <input id="profile-drawer" type="checkbox" className="drawer-toggle" checked={show()} onChange={() => setShow(!show())} />
        <div className="drawer-content min-h-[100vh] box-border flex flex-col">
          {props?.children}
          <Planner ref={_planner}/>
        </div>
        <div className="drawer-side z-20">
          <label htmlFor="profile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="bg-base-200 text-base-content min-h-full w-120 max-w-full p-4">
            <div class="flex items-center justify-between gap-2">
              <div><label htmlFor="profile-drawer" aria-label="close sidebar" className="drawer-button btn btn-circle btn-ghost">✕</label></div>
              <Show when={address()} fallback="not connect">
                <Copyable value={address()}>{shortStr(address(),6)}</Copyable>
              </Show>

              <div class="flex flex-col gap-2">
                <button class="btn rounded-full btn-circle btn-ghost"  onClick={() => {
                  setShow(false)
                  disconnect()
                  toast("disconnected",{icon:<Icon icon="iconoir:check" />,duration:1000})
                }}>
                  <Icon icon="solar:logout-outline" />
                </button>
              </div>
            </div>
            <div class="divider"></div>
            <div>
              <p>WAR : <Show when={arBalance?.state=="ready"} fallback="..."><Currency value={arBalance()} precision={12} fixed={6} ticker="$WAR"/></Show></p>
              <p>WORM : <Show when={wormBalance?.state=="ready"} fallback="..."><Currency value={wormBalance()} precision={12} fixed={6} ticker="$WORM"/></Show></p>
            </div>
            <div class="divider"></div>
            <Show when={profile.state === "ready"} fallback={<div>Loading...</div>}>
              <Switch>
                 <Match when={!profile()}>
                  <div>not joined</div>
                  <button className="btn btn-primary" onClick={handlePlan}>Create a plan</button>
                 </Match>
                 <Match when={profile()}>
                  <Show when={plan()} fallback="your don't have plan yet">
                    <div className="">
                      <ul>
                        <li>id : {plan()?.id}</li>
                        <li>keepdays : {plan()?.keepdays}</li>
                        <li>offset : {plan()?.offset}</li>
                        <li>updated: {plan()?.updated}</li>
                        <li>deposit : {plan()?.deposit}</li>
                        <li>duration : {plan()?.duration}</li>
                      </ul>
                    </div>
                  </Show>
                  <Show when={!plan()}>
                    <button className="btn btn-primary" onClick={handlePlan}>Create a plan</button>
                  </Show>
                  
                 </Match>
                 
              </Switch>
             
              
            </Show>
          </div>
        </div>
      </div>
     </UserContext.Provider>
  )
}

export const useUser =()=> useContext(UserContext)
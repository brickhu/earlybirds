import { createContext, useContext, createResource, createEffect, createMemo, createSignal, Switch, Show} from "solid-js";
import { useWallet } from  "arwallet-solid-kit"
import { fetchUserProfile, fetchBalance,hbFetchUserProfile, hbFetchBalance, hbFetchPlan, fetchPlan } from "../../api"
import { useGlobal,useClock } from "../index"
import { Icon } from "@iconify-icon/solid"
import Planner from "../../components/planner";
import { shortStr } from "../../lib/units";
import { Copyable } from "../../components/copyable";
import { Currency } from "../../components/currency";
import { storage } from "../../lib/storage";
import { Shorter } from "../../components/shorter";

const UserContext = createContext()

export const UserProvider = (props) => {
  let _planner
  const {address, disconnect} = useWallet()
  const {env,toast} = useGlobal()
  const {displayTimeZoneSetting,offset} = useClock()
  const [show,setShow] = createSignal(false)
  // const [plan,setPlan] = createSignal()

  const [profile,{refetch:refetchProfile}] = createResource(()=>({pid:env?.checkin_pid,address:address()}) ,fetchUserProfile)
  const [arBalance,{refetch:refetchArBalance}] = createResource(()=>({pid: env?.artoken_pid, address: address()}), fetchBalance)
  const [wormBalance,{refetch:refetchWormBalance}] = createResource(()=>({pid: env?.wrom_pid, address: address()}), fetchBalance)
  const [pwrBalance,{refetch:refetchPwrBalance}] = createResource(()=>({pid: env?.buyback_pid, address: address()}), fetchBalance)
  // const [plan,{refetch:refetchPlan}] = createResource(()=>({pid:env?.checkin_pid,key:profile()?.plan}) ,fetchPlan)
  const plan = createMemo(()=>profile?.state==="ready" && profile()?.plan_detail)
  const latest = createMemo(()=>profile?.state==="ready" && profile()?.latest_checkin)
  


  const handlePlan = (plan) => {
    _planner?.show(plan)
  }
  const hooks = {
    id : address(),
    profile,
    refetchProfile,
    latest,
    plan,
    openPlanner : (plan) => _planner?.show(plan),
    arBalance,
    refetchArBalance,
    wormBalance,
    refetchWormBalance,
    pwrBalance,
    refetchPwrBalance
  }

  createEffect(()=>{
    if(profile.state == "ready"){
      const remote_offset = profile()?.plan_detail?.offset || profile()?.offset
      if(remote_offset && remote_offset !== offset()){
        displayTimeZoneSetting({offset: remote_offset,owner: address()})
      }
    }
  })

  createEffect(()=>{
    if(address()){
      toast.custom((t)=>(
        <div 
          className={`relative max-w-sm w-auto text-center bg-base-200 shadow-lg rounded-lg pointer-events-auto  overflow-hidden border border-current/10`}
          classList={{
            'animate-enter' : t.visible == true,
            'animate-leave' : t.visible == false
          }}
        >
          <p className="flex items-center px-4 py-2 gap-2 ">
            <Icon icon="iconoir:link" /> <Shorter value={address()} length={6} /> <span>has been connected.</span>
          </p>
          
          </div>
      ),{
        duration: 2000, 
        unmountDelay: 200
      })
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
            <div className="flex items-center gap-2 justify-between">
              <div className="bg-base-300 py-2 px-4">
                <i className="text-sm uppercase text-current/60">Level</i>
                <p className="text-lg font-bold">1.1</p>
              </div>
              <div className="bg-base-300">
                <i className="text-sm uppercase text-current/60">Level</i>
                <p className="text-lg font-bold">1.1</p>
              </div>
              <div className="bg-base-300">
                <i className="text-sm uppercase text-current/60">Level</i>
                <p className="text-lg font-bold">1.1</p>
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
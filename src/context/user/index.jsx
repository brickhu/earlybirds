import { createContext, useContext, createResource, createEffect, createMemo, createSignal, Switch, Show, For, Match, Suspense} from "solid-js";
import { useWallet } from  "arwallet-solid-kit"
import { fetchUserProfile, fetchBalance,hbFetchUserProfile, hbFetchBalance, hbFetchPlan, fetchPlan, fetchUserActivites } from "../../api"
import { useGlobal,useClock } from "../index"
import { Icon } from "@iconify-icon/solid"
import Planner from "../../components/planner";
import { shortStr } from "../../lib/units";
import { Copyable } from "../../components/copyable";
import { Currency } from "../../components/currency";
import { storage } from "../../lib/storage";
import { Shorter } from "../../components/shorter";
import { Block, Blocks } from "../../components/blocks";
import { BalanceItem } from "../../components/items";
import { Table, Head, Cols, Col, Row, Cell, Body  } from "../../components/table";
import Tabs from "../../components/tabs";
import { Timelines, Timeline } from "../../components/timeline";
import { createPagination } from "../../store";
import { Moment } from "../../components/moment";
import Activites from "./activites";
import Assets from "./assets";


const UserContext = createContext()

export const UserProvider = (props) => {
  let _planner
  const menus = [{
    name : "Activites",
    key : "activites"
  },{
    name : "Assets",
    key : "assets"
  },{
    name : "Details",
    key : "details"
  }]
  const [tab,setTab] = createSignal(menus[0])
  const {address, disconnect} = useWallet()
  const {env,toast} = useGlobal()
  const {displayTimeZoneSetting,offset} = useClock()
  const [show,setShow] = createSignal(false)
  // const [plan,setPlan] = createSignal()

  const [profile,{refetch:refetchProfile}] = createResource(()=>({pid:env?.checkin_pid,address:address()}) ,fetchUserProfile)
  const [arBalance,{refetch:refetchArBalance}] = createResource(()=>({pid: env?.artoken_pid, address: address()}), fetchBalance)
  const [wormBalance,{refetch:refetchWormBalance}] = createResource(()=>({pid: env?.wrom_pid, address: address()}), fetchBalance)
  const [pwrBalance,{refetch:refetchPwrBalance}] = createResource(()=>({pid: env?.buyback_pid, address: address()}), fetchBalance)
  // const [activites,{refetch: refetchActivites,}] = createPagination(()=>({address:address(),checkin_pid:env?.checkin_pid}),fetchUserActivites,{size:100})
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
            {/* calender */}
            <div className=" pb-4">
              <div className="divider text-current/60 text-xs">Feb 2025</div>
              <div className="w-full grid grid-cols-7 gap-2">
                <For each={["1","2","3","4","5","6","7"]}>
                  {item=>{
                    return(
                      <div className=" flex items-center flex-col justify-center p-2 rounded-sm">
                        <p className="text-xs text-current/50">SUN</p>
                        <p>{item}</p>
                      </div>
                    )
                  }}
                </For>
              </div>
            </div>
            {/* main */}
            <Show when={profile.state == "ready"} fallback="Loading...">

            <Blocks>
              <div className="flex items-center gap-4 col-span-full bg-base-100 border-base-300 border rounded-field p-4">
                <div className="flex gap-2 items-center">
                  <div>
                    <div
                    className="radial-progress bg-primary text-primary-content border-primary border-4 text-xs"
                    style={{ "--value": 70, "--size":"2em", "--thickness": "3px" } } aria-valuenow={70} role="progressbar">
                    
                  </div>
                  </div>
                  <div className=" flex items-center text-sm">A 30-day plan starting on Sep 1, 2025, with a deposit of 1 $WAR</div>

                </div>
                <button className="btn btn-ghost btn-circle"><Icon icon="fluent:more-vertical-16-filled" /></button>
              </div>
              <Block label="Level" value={profile()?.level || "0"} />
              <Block label="Boost" value={profile()?.boost || "0"}/>
              <Block label="Check-ins" value={profile()?.checkins || "0"}/>
              <Block  className="col-span-full py-4">
                <Table className="text-xs">
                  <Head>
                    <Cols class="text-xs">
                      <Col class="text-xs text-left">Fund</Col>
                      <Col class="text-xs text-right">Available</Col>
                      <Col class="text-xs text-right">Total</Col>
                    </Cols>
                  </Head>
                  <Body className="text-xs">
                    <Row>
                      <Cell class="text-xs text-left">Deposit</Cell>
                      <Cell class="text-xs text-right">0.0000001</Cell>
                      <Cell class="text-xs text-right">0.0000001</Cell>
                    </Row>
                    <Row>
                      <Cell class="text-xs text-left">Rewards</Cell>
                      <Cell class="text-xs text-right">0.0000001</Cell>
                      <Cell class="text-xs text-right">0.0000001</Cell>
                    </Row>
                  </Body>
                </Table>
                  <div className="flex items-center justify-between px-1 mt-3 pt-3 border-t border-base-300">
                    <div>
                      <p className="text-xs text-current/60 uppercase">Available to claim</p>
                      <p className="text-sm"><Currency value={profile()?.funds?.[0] || 0} percision={12} ticker={"$WAR"}/></p>
                    </div>
                    <button className="btn btn-primary btn-sm " disabled={profile()?.funds?.[0] <= 0}>Claim</button>
                  </div>
              </Block>
              
            </Blocks>
            
            {/* <div className="grid grid-cols-3 gap-4">
              <div className="bg-amber-50">1</div>
              <div className="bg-amber-50">1</div>
              <div className="bg-amber-50">1</div>
              <div className="bg-amber-50">1</div>
         
            </div> */}
            
            
            {/* <Show when={profile.state === "ready"} fallback={<div>Loading...</div>}>
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
             
              
            </Show> */}
            <section className="py-4">
              <div className="pb-4">
                <Tabs items={menus} current={tab()} size="lg" variant = "border" onSelected={({item})=>setTab(item)} />
              </div>
              <Suspense fallback="loading">
                <Switch>
                  <Match when={tab()?.key == "activites"}><Activites/></Match>
                  <Match when={tab()?.key == "details"}>
                    <div className="p-4 text-sm">
                      <div className="text-current/50 text-center pb-4">TrnCnIGq...yNV6g2A</div>
                      <div className="flex flex-col gap-2">
                        <dl className="dl">
                          <dt className="w-[40%]">Timezone</dt>
                          <dd> UTC+08:00</dd>
                        </dl>
                        <dl className="dl">
                          <dt className="w-[40%]">Join at</dt>
                          <dd>Sep 18, 2025</dd>
                        </dl>
                        <dl className="dl">
                          <dt className="w-[40%]">Punishies</dt>
                          <dd>20.000000 $WAR</dd>
                        </dl>
                        <dl className="dl">
                          <dt className="w-[40%]">Total earn</dt>
                          <dd>20.000000 $WORM</dd>
                        </dl>
                      </div>
                      
                    </div>
                  </Match>
                  <Match when={tab()?.key == "assets"}><Assets/></Match>
                </Switch>
              </Suspense>
              
              {/* <ul className="timeline timeline-vertical timeline-compact w-full">
                <li>
                  <div className="timeline-middle">
                    <p className="size-5 bg-base-300 rounded-full flex items-center justify-center">1</p>
                  </div>
                  <div className="timeline-end w-full">
                    <div className="flex justify-between text-sm">
                      <div className="pl-2">First Macintosh computer</div>
                      <div className="flex items-center gap-2">
                        <p className="text-current/50 text-xs">5 mins ago</p>
                        <button className="btn btn-ghost btn-circle btn-xs"></button>
                      </div>
                    </div>
                    
                  </div>
                  <hr />
                </li>
              </ul> */}
            </section>
            </Show>
          </div>
        </div>
      </div>
     </UserContext.Provider>
  )
}

export const useUser =()=> useContext(UserContext)
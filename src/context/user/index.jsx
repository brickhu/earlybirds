import { createContext, useContext, createResource, createEffect, createMemo, createSignal, Switch, Show, For, Match, Suspense} from "solid-js";
import { useWallet } from  "arwallet-solid-kit"
import { fetchUserProfile, fetchBalance,hbFetchUserProfile, hbFetchBalance, hbFetchPlan, fetchPlan, fetchUserActivites, fetchUserFeeds, fetchUserEvents } from "../../api"
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
import { displayZoneTime, getDateKey } from "../../lib/units";
import Spinner from "../../components/spinner";
import Canlender from "../../components/canlender";
import { createStore } from "solid-js/store";
import { getContrastYIQ } from "../../lib/units";


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
  const [userEvents,{
    hasMore: hasMoreEvents,
    loadMore : loadMoreEvents,
    refetch: refetchEvents,
    loadingMore : loadingMoreEvents
  }] = createPagination(()=>({pid:env?.checkin_pid,address:address()}),fetchUserFeeds,{size:100})

  const plan = createMemo(()=>profile?.state==="ready" && profile()?.plan_detail)
  const latest = createMemo(()=>profile?.state==="ready" && profile()?.latest_checkin)


  
  const onCanlenderChange = (d) => {
    if(hasMoreEvents()){
      loadMoreEvents()
    }
  }

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
              <Canlender 
                events={userEvents()?.map((i)=>({
                  background : i?.color || "#fefefe" ,
                  color : i?.color ? getContrastYIQ(i?.color) : "#ccc",
                  text : i?.note || "",
                  id : i?.cid,
                  timestamp : i?.time
                }))} 
                onChange={onCanlenderChange}
                loading={userEvents?.loading || loadingMoreEvents()}
              />

            </div>
            {/* main */}
            <Show when={profile.state == "ready"} fallback={<Spinner/>}>
              <Switch>
                <Match when={profile()}>
                  <Blocks>
                    <div className="flex items-center gap-4 col-span-full bg-base-100 border-base-300 border rounded-field p-4">
                      <Switch>
                        <Match when={profile()?.plan_detail}>
                          <div className="flex gap-2 items-center">
                            <div>
                              <div
                              className="radial-progress bg-primary text-primary-content border-primary border-4 text-xs"
                              style={{ "--value": 70, "--size":"2em", "--thickness": "3px" } } aria-valuenow={70} role="progressbar">
                              
                            </div>
                            </div>
                            <div className=" text-sm ">A {plan()?.duration}-day plan starting on {displayZoneTime(plan()?.start,plan()?.offset)?.date}, with a deposit of <span className=" inline-flex"><Currency value={plan().deposit} precision={12} fixed={0} ticker="$WAR"/></span></div>

                          </div>
                          <button className="btn btn-ghost btn-circle"><Icon icon="fluent:more-vertical-16-filled" /></button>

                        </Match>
                        <Match when={!profile()?.plan_detail}>
                          <div className="flex items-center justify-between w-full">
                            <p>No active plan yet</p>
                            <button className="btn btn-sm btn-primary">Create new</button>
                          </div>
                          
                        </Match>
                      </Switch>
                      
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
                            <Cell class="text-xs text-right"><Currency value={profile()?.funds?.[0]} precision={12} /></Cell>
                            <Cell class="text-xs text-right"><Currency value={profile()?.funds?.[1]} precision={12} /></Cell>
                          </Row>
                          <Row>
                            <Cell class="text-xs text-left">Rewards</Cell>
                            <Cell class="text-xs text-right"><Currency value={profile()?.rewards?.[0]} precision={12} /></Cell>
                            <Cell class="text-xs text-right"><Currency value={profile()?.rewards?.[0]} precision={12} /></Cell>
                          </Row>
                        </Body>
                      </Table>
                        <div className="flex items-center justify-between px-1 mt-3 pt-3 border-t border-base-300">
                          <div>
                            <p className="text-xs text-current/60 uppercase">Available to claim</p>
                            <p className="text-sm"><Currency value={profile()?.funds?.[0] + profile()?.rewards?.[0] || 0} percision={12} ticker={"$WAR"}/></p>
                          </div>
                          <button className="btn btn-primary btn-sm " disabled={profile()?.funds?.[0] + profile()?.rewards?.[0] <= 0}>Claim</button>
                        </div>
                    </Block>
                    
                  </Blocks>
                  
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
                    
                  </section>
                </Match>
                <Match when={!profile()}>
                  <div className="flex flex-col items-center gap-4 p-6 rounded-field bg-base-100 border border-base-300">
                    <Icon icon="iconoir:circle-spark" />
                    <p className="text-center">Not in EarlyBirds yet? Start a check-in plan and catch $WORM every day!</p>
                    <button className="btn btn-primary" onClick={()=>handlePlan()}>Create a checkin plan</button>
                  </div>
                  
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
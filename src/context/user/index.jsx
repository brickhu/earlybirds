import { createContext, useContext, createResource, createEffect, createMemo, createSignal, Switch, Show, For, Match, Suspense} from "solid-js";
import { useWallet } from  "arwallet-solid-kit"
import { fetchUserProfile, fetchBalance,hbFetchUserProfile, hbFetchBalance, hbFetchPlan, fetchPlan, fetchUserActivites, fetchUserFeeds, fetchUserEvents } from "../../api"
import { useGlobal,useClock } from "../index"
import { Icon } from "@iconify-icon/solid"
import Planner from "../../components/planner";
import { shortStr } from "../../lib/units";
import { Copyable } from "../../components/copyable";
import { Currency } from "../../components/currency";
import { Shorter } from "../../components/shorter";
import { Block, Blocks } from "../../components/blocks";
import { Table, Head, Cols, Col, Row, Cell, Body  } from "../../components/table";
import Tabs from "../../components/tabs";
import { createPagination } from "../../store";
import Activites from "./activites";
import Assets from "./assets";
import { displayZoneTime } from "../../lib/units";
import Spinner from "../../components/spinner";
import Canlender from "../../components/canlender";
import { getContrastYIQ } from "../../lib/units";


const UserContext = createContext()

const Skeleton = props => (
  <div className="flex w-full flex-col gap-4">
  <For each={Array.from({length:4})}>
    {item=><div className="h-8 w-full skeleton rounded-2xl"></div>}
  </For>
  </div>
)

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
            <Show when={profile.state == "ready"} fallback={
              <div className="flex items-center gap-4 col-span-full bg-base-100 border-base-300 border rounded-field p-4 justify-center"><Spinner/></div>
            }>
              <Switch>
                <Match when={profile()}>
                  <Blocks>
                    <div 
                      className="flex items-center gap-4 col-span-full bg-base-100 border-base-300 border rounded-field p-4"
                      classList={{}}
                    >
                      <Switch>
                        <Match when={profile()?.plan_detail}>
                          <div className="flex gap-2 items-center w-full">
                            <div className="size-6 bg-info text-info-content text-xs uppercase gap-2 flex items-center justify-center rounded-full">
                              <Icon icon="ant-design:canlendar-twotone" />
                            </div>
                            <div className=" text-xs min-w-30"><Currency value={plan()?.deposit || 0} precision={12} ticker="$AO"/> <span className="text-current/50">backed plan</span></div>
                            <div className="flex items-center justify-end gpa-2 flex-1 ">
                              <span className="text-xs"> {plan()?.duration - plan()?.keepdays} days left </span>
                              <button className="btn btn-ghost btn-circle btn-sm translate-x-1"><Icon icon="fluent:more-vertical-16-filled" /></button>
                            </div>
                          </div>
                          
                          

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
                    <div className="pb-4 sticky">
                      <Tabs items={menus} current={tab()} size="lg" variant = "border" onSelected={({item})=>setTab(item)} />
                    </div>
                    <Suspense fallback={<Skeleton/>}>
                      <Switch>
                        <Match when={tab()?.key == "activites"}><Activites profile={profile}/></Match>
                        <Match when={tab()?.key == "details"}>
                          <div className="p-4 text-sm">
                            <div className="flex flex-col gap-2">
                              <dl className="dl">
                                <dt className="w-[40%]">Timezone</dt>
                                <dd> UTC+08:00</dd>
                              </dl>
                              <dl className="dl">
                                <dt className="w-[40%]">Joined</dt>
                                <dd>{new Date(profile()?.join_at).toDateString()}</dd>
                              </dl>
                              <dl className="dl">
                                <dt className="w-[40%]">Plans</dt>
                                <dd>5 → 120.00 $WAR</dd>
                              </dl>
                              <dl className="dl">
                                <dt className="w-[40%]">Rewards</dt>
                                <dd>{} → 120.00 $WAR</dd>
                              </dl>
                              <dl className="dl">
                                <dt className="w-[40%]">Penalty</dt>
                                <dd>{profile()?.penalty || 0} → 120.00 $WAR</dd>
                              </dl>
                               <dl className="dl">
                                <dt className="w-[40%]">Mints</dt>
                                <dd>{profile()?.mints || 0} → <Currency value={profile()?.mint} precision={12} ticker="$WORM"/></dd>
                              </dl>
                              <dl className="dl">
                                <dt className="w-[40%]">Claims</dt>
                                <dd>{profile()?.claims || 0} → <Currency value={profile()?.claim || 0} precision={12} ticker="$AO"/></dd>
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
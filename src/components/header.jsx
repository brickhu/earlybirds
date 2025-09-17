import Logo from "./logo.jsx";
import { useWallet } from "arwallet-solid-kit";
import Avatar from "./avatar.jsx"
import { Index,createMemo,createSignal,onMount,onCleanup,Show } from "solid-js";
import { useClock,useUser } from "../context"
import { t,setDictionarys,locale,setLocale,locales } from "../i18n"
import { A } from "@solidjs/router";
import { Icon } from "@iconify-icon/solid"

export default props => {
  let _header
  const { connected, address, connecting, showConnector } = useWallet()
  const { profile } = useUser()
  const { offset,isSameTimeOffsetToSystem,offsetString } = useClock()
  const [sticked,setStickied] = createSignal(false)
  setDictionarys("en",{
    "nav.feeds": "Feeds",
    "nav.buyback":"Buyback",
    "nav.ranks":"Ranks",
    "nav.worm": "$worm",
    "nav.docs":"Docs",
    "h.connect":"Connect",
    "h.conecting":"Connecting"
  })
  setDictionarys("zh",{
    "nav.feeds": "Feeds",
    "nav.buyback":"Buyback",
    "nav.ranks":"Ranks",
    "nav.worm": "$worm",
    "nav.docs":"Docs",
    "h.connect":"Connect",
    "h.conecting":"Connecting"
  })
  const [navs,setNavs] = createSignal([{
    name: "feeds",
    path: "/feeds",
  },{
    name: "buyback",
    path: "/buyback"
  },{
    name: "worm",
    path: "/worm"
  },{
    name: "ranks",
    path: "/ranks"
  },{
    name: "docs",
    path: locale()=="en"?"https://docs.earlybirds.day/en":"https://docs.earlybirds.day/cn",
    new: true,
    out: true
  }])

  onMount(()=>{
    window.onscroll = function (e) {
      setStickied(e.currentTarget.scrollY > _header.getBoundingClientRect().height * 0.2)
    };
  })
  onCleanup(()=>window.onscroll=null)


  return(
    <header 
      className="min-h-12 w-full flex items-center justify-between sticky top-0 grow-0 shrink-0 transition-all z-10" 
      ref={_header}
      classList={{
        "bg-base-200" : sticked()
      }}
    >
      <div className="flex items-center gap-2 px-2">
        <A href="/" >
          <Logo className="size-10" />
        </A>
        
        {/* <div className="size-8 rounded-full bg-base-content"></div> */}
        <p className="text-xs text-base-content/60 flex items-center gap-1">{offsetString()} <Show when={!isSameTimeOffsetToSystem()}><Icon icon="iconoir:warning-triangle" className=" scale-75" /></Show></p>
      </div>
      <div className="flex items-center gap-2 px-2 justify-end">
        <div className=" flex-1 gap-1 lg:gap-2 items-center flex justify-end">
        <div class="dropdown dropdown-bottom dropdown-center lg:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content panel rounded-box z-2 m-3 w-52 p-2 bg-base-200 ">
            <Index each={navs()} fallback={<div>Loading...</div>}>
              {(item) => (
                <li>
                  <A 
                    href={item()?.path} 
                    activeClass="text-base-content bold"
                    inactiveClass="text-secondary link link-hover"
                    class="inline-flex items-center gap-1 text-lg w-full justify-between"
                    classList={{
                      "after:content-['_↗']" : item()?.out
                    }}
                    target={`${item().new?"_blank":"_self"}`}>
                      {t(`nav.${item()?.name}`)}
                  </A>
                </li>
              )
              }
            </Index>
          </ul>
        </div>
        <ul className="hidden lg:flex items-center menu menu-horizontal">
          <Index each={navs()} fallback={<div>Loading...</div>}>
            {(item) => (
              <li>
                <A 
                  href={item()?.path} 
                  activeClass="text-base-content bold"
                  inactiveClass="text-secondary link link-hover"
                  class="inline-flex items-center gap-1 text-lg rounded-full"
                  classList={{
                      "after:content-['_↗']" : item()?.out
                    }}
                  target={`${item().new?"_blank":"_self"}`}>
                    {t(`nav.${item()?.name}`)} 
                </A>
              </li>
            )
            }
          </Index>        
        </ul>
      </div>
        <Show when={connected()} fallback={<button className="btn rounded-full" onClick={showConnector}>Connect</button>}>
          <label 
            htmlFor="profile-drawer" 
            className="btn btn-circle drawer-button rounded-full"
            classList={{
              "skeleton" : profile.loading,
              "" : !profile.loading,
              "border border-accent" : profile.state == "ready" && profile() !== null
            }}
          >
            <Avatar username={address()} className="size-6"/>
          </label>
            
          
          
        </Show>
      </div>
    </header>
  )
}
import { Currency } from "../../components/currency"
import { Moment } from "../../components/moment"
import { Timelines, Timeline } from "../../components/timeline"
import { For } from "solid-js"
import { useWallet } from "arwallet-solid-kit"
import { useGlobal } from "../global"
import { createPagination } from "../../store"
import { fetchUserActivites } from "../../api"

export default props=>{
  const {address} = useWallet()
  const {env} = useGlobal()
  const [activites,{refetch: refetchActivites,}] = createPagination(()=>({address:address(),checkin_pid:env?.checkin_pid}),fetchUserActivites,{size:100})
  return(
    <div className="py-4 px-2">
      <Timelines>
        <For each={activites()} fallback="Loading...">
          {item=>{
            let tags = item.tags
            let icon,id,text,time,action
            switch (item.action) {
              case "Checked-In":
                icon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M7.53 11.97a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l7-7a.75.75 0 0 0-1.06-1.06L10 14.44z" clip-rule="evenodd"/></svg>,
                text = <>checked-in and earn <Currency value={tags?.['Mint-Amount']} precision={12} fixed={4} ticker="$WORM"/></>
                break;
              case "Plan-Created":
                icon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" stroke-width="1.5" clip-rule="evenodd"><path d="M18.992 15.25a.75.75 0 0 1 .75.75v2.25H22a.75.75 0 0 1 0 1.5h-2.258V22a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1 0-1.5h2.25V16a.75.75 0 0 1 .75-.75"/><path d="M3 9.25a.75.75 0 0 0-.75.75v9A2.75 2.75 0 0 0 5 21.75h11a.75.75 0 0 0 .53-.22l.212-.212v-.068h-.75a2.25 2.25 0 1 1 0-4.5h.75V16a2.25 2.25 0 1 1 4.5 0v.75h.069l.22-.22a.75.75 0 0 0 .219-.53v-6a.75.75 0 0 0-.75-.75z"/><path d="M7 1.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V4.75H5c-.69 0-1.25.56-1.25 1.25v4a.75.75 0 0 1-1.5 0V6A2.75 2.75 0 0 1 5 3.25h1.25V2A.75.75 0 0 1 7 1.25m8 0a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V4.75H10.5a.75.75 0 0 1 0-1.5h3.75V2a.75.75 0 0 1 .75-.75M17.75 4a.75.75 0 0 1 .75-.75h.5A2.75 2.75 0 0 1 21.75 6v4a.75.75 0 0 1-1.5 0V6c0-.69-.56-1.25-1.25-1.25h-.5a.75.75 0 0 1-.75-.75"/></g></svg>,
                text = <>created a {tags?.['Plan-Duration']}-day plan with <Currency value={tags?.['Plan-Cost']} precision={12} fixed={4} ticker="$WORM"/> deposit.</>
                break;
            
              default:
                icon = ""
                text = id
                break;
            }
            return(
              <Timeline 
                icon={icon || <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M7.53 11.97a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l7-7a.75.75 0 0 0-1.06-1.06L10 14.44z" clip-rule="evenodd"/></svg>} 
                id={item.id}
                text={text}
                time={<Moment ts={item?.timestamp}/>}
              >
              </Timeline>
            )
          }}
        </For>
        <li className="border-t border-base-300">
          ddd
        </li>
      </Timelines>
    </div>
  )
}
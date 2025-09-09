import { cacheResource } from "../../store"
import { useGlobal } from "../../context"
import { createEffect, createResource } from "solid-js"
import { fetchMints } from "../../api"
import { createPagination } from "../../store"
export default (props) => {
  const {env} = useGlobal() 
  const [mints,{refetch:refetchMints}] = cacheResource("mints-"+env?.wrom_pid,()=>createPagination(()=>({from:env?.wrom_pid,to:env?.checkin_pid}),fetchMints,{size:100}))
  return(
    <div className="w-full">
      <Show when={mints?.state=="ready"} fallback="loading...">
        {mints()?.length || "0"}
        <For each={mints()}>
          {item=><div>
            <ul>
               <div className="divider">{item?.id}</div>
              <li>quantity:  {item?.quantity}</li>
              <li>address:  {item?.address}</li>
            </ul>
           
            </div>}
        </For>
      </Show>
    </div>
  )
}
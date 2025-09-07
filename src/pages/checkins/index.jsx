import { cacheResource } from "../../store"
import { createEffect, For } from "solid-js"
import { fetchFeeds } from "../../api"
import { useGlobal } from "../../context"
import { createPagination } from "../../store"
import { A } from "@solidjs/router"
import { CheckinCard } from "../../components/checkincard"
export default props => {
  const {env} = useGlobal()
  const [feeds,{loadMore,hasMore,loadingMore,refetch}]  = cacheResource("feeds",()=>createPagination(()=>env?.checkin_pid,fetchFeeds,{size:100}))
  createEffect(()=>{
    console.log(feeds())
  })
  return(
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8  items-stretch p-4 lg:p-8">
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Show when={feeds.state == "ready"} fallback="loading...">
        <For fallback="no data" each={feeds()}>
          {item=><CheckinCard {...item} />}
        </For>
        <Show when={hasMore()}>
          <div className="bg-base-200 rounded-2xl flex items-center justify-center">
            <button className="btn btn-outline">Load More</button>
          </div>
        </Show>
        
      </Show>

      </div>
      
    </div>
  )
}
import {t,setDictionarys} from '../../i18n';
import { Icon } from "@iconify-icon/solid"
import Aologo from "../../components/aologo"
import CheckinBar from "../../components/checkinbar"
import { batch, createEffect, createResource, For, onMount, Show } from 'solid-js';
import { useGlobal } from '../../context';
import { cacheResource } from '../../store';
import { fetchDataByAction } from '../../api';
import Avatar from '../../components/avatar';
import { Currency } from '../../components/currency';
import { A } from '@solidjs/router';
import { FaqItem,FaqContainer } from './faq';




export default () => {
  const {env,checkinState, refetchCheckinState} = useGlobal()
  const [latestCheckers,{refetch: refetchLatestCheckers}] = cacheResource("latestCheckers",()=>createResource(()=>({pid:env?.checkin_pid,action: "LatestCheckers" }),fetchDataByAction))
  // const [feeds,{loadMore,hasMore,loadingMore,refetch}]  = cacheResource("feeds",()=>createPagination(()=>env?.checkin_pid,fetchFeeds,{size:100}))
  // createEffect(()=>console.log("latestCheckers",latestCheckers()))
  const faqs = [{
    title : "What is Earlybirds?",
    content : <p>content!</p>
  },{
    title : "How does it work?",
    content : <p>content!</p>
  },{
    title : "What is $worm and how to earn it?",
    content : <p>content!</p>
  },{
    title : "Why did we choose to build on AO?",
    content : <p>content!</p>
  },{
    title : "Is my fund safe?",
    content : <p>content!</p>
  },{
    title : "What’s the meaning of getting up early?",
    content : <p>content!</p>
  },{
    title : "What should I prepare before joining?",
    content : <p>content!</p>
  }]

  return (
    
    <main class=" flex flex-col items-center justify-center min-h-full">

      <div class="w-full flex flex-col gap-4 lg:gap-8 items-center justify-center " >
        {/* heading */}
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 container items-stretch py-12">
          <div class="col-span-1 lg:col-span-8">
            <h2 className=" text-4xl text-center lg:text-left lg:text-7xl uppercase font-black"><span class="text-primary">Earlybirds</span> catch the 🐛$worm</h2>
          </div>
          <div class="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-end gap-2 flex-1">
            <p className=" text-center lg:text-right lg:text-xl text-lg">A decentralized check-in community permanently running on <i class="inline-flex justify-center items-center border size-[1.2em] rounded-full"><Aologo class="w-[0.7em]"/></i>, helping you rise early and earn $worm on-chain.</p>
          </div>
        </div>

        <CheckinBar onCheckedSuccessful={()=>{
          batch(()=>{
            refetchLatestCheckers()
            refetchCheckinState()
          })
        }}/>

        {/* status */}
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 container items-stretch py-8">
          <div class="col-span-1 lg:col-span-8">
            <p className=" text-center lg:text-left text-current/60 lg:text-lg gap-2">
              
              <b class="text-base-content"><Show when={checkinState.state==="ready"} fallback="...">{checkinState()?.players}</Show></b> <span className='inline-flex'>Early Birds,</span> 
              <b class="text-base-content"><Show  when={checkinState.state==="ready"} fallback="...">{checkinState()?.checkins}</Show></b> <span className='inline-flex'>total check-ins, and  </span> 
              <b class="text-base-content"><Show  when={checkinState.state==="ready"} fallback="..."> <Currency value={checkinState()?.mints} precision={12} fixed={1}/></Show></b> <span className='inline-flex'> $worm circulating!</span>
            </p>
          </div>
          <div class="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-end gap-1 flex-1">
            <div class=" flex flex-row gap-2 items-center justify-center lg:justify-end">
              <Show when={latestCheckers.state == "ready"} fallback="...">
                  <For each={latestCheckers()?.slice(0,2)}>
                    {item=><Avatar username={item} className="size-7"/>}
                  </For>
                  <A href='/feeds' class="btn btn-sm rounded-full btn-circle size-7"><Icon icon="iconoir:more-horiz" /></A>
              </Show>
            </div>
          </div>
        </div>

        {/* faq */}
        
      </div>

      <div className=' container flex flex-col items-center py-8'>
        <div className='text-4xl lg:text-6xl pb-8 uppercase text-center'>Getting up early is the key to a successful, healthy life.</div>
        <p className='text-center'>Studies have found that long-term early risers enjoy stronger longevity and vitality in their brain and nerve cells — a habit many successful people keep to maintain a healthy mind.</p>
        <FaqContainer className="max-w-4xl">
          <For each={faqs}>
            {item=><FaqItem  title={item?.title} content={item?.content}/>}
          </For>
        </FaqContainer>
      </div>
      
    </main>
  );
}
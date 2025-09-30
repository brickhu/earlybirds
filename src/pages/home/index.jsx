import {t,setDictionarys} from '../../i18n';
import { Icon } from "@iconify-icon/solid"
import Aologo from "../../components/aologo"
import Checkinbar from './checkinbar';
import { batch, createEffect, createResource, For, Match, onMount, Show, Switch } from 'solid-js';
import { useGlobal } from '../../context';
import { cacheResource } from '../../store';
import { fetchDataByAction } from '../../api';
import Avatar from '../../components/avatar';
import { Currency } from '../../components/currency';
import { A } from '@solidjs/router';
import {FaqContainer, FaqItem} from './faq';
import { shortNumber } from '../../lib/units';


const Status = props => {
  return(
    <div className='w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 pt-12 px-2'>{props?.children}</div>
  )
}

const StatuBlock = props => {
  return(
    <div 
      className='col-span-1 md:col-span-2 lg:col-span-3 bg-base-300/70 border border-base-300 hover:bg-base-100 transition-all rounded-box p-4 flex items-center justify-between'
      classList={{
        "skeleton" : props?.loading
      }}
    >
      <Switch>
        <Match when={props?.children}>{props?.children}</Match>
        <Match when={!props?.children}>
          <div>
            <p className='text-xs text-current/60 uppercase'>{props?.title}</p>
            <p className='text-3xl'><Show when={!props?.loading} fallback="...">{props?.value}</Show></p>
          </div>
          <A href={props?.link || ""} disabled={!props?.link} className='btn btn-circle '>
            <Icon icon="iconoir:arrow-up-right" />
          </A>
        </Match>
      </Switch>
      
    </div>
  )
} 

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
    
    <main class=" flex flex-col items-center min-h-full">
      <div className='container'>
        <div className='w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 py-12 px-2 gap-4 md:gap-6 lg:gap-8 '>
          <div className='col-span-1 md:col-span-5 lg:col-span-7 text-center md:text-left'>
            <p className='text-4xl md:text-5xl lg:text-6xl uppercase font-black'>
              <span className='text-primary'>Earlybirds</span> catch the 🐛$worm
            </p>
          </div>
          <div className='col-span-1 col-start-1 md:col-start-7 lg:col-start-9 md:col-span-3 lg:col-span-4 text-center md:text-left md:text-xl line-clamp-4 pt-4 lg:pt-2'>
            A decentralized <b>check-in</b> community permanently running on <i class="inline-flex justify-center items-center border size-[1.2em] rounded-full"><Aologo class="w-[0.7em]"/></i>, helping you rise early and earn <b>$worm</b> on-chain
          </div>
        </div>

        <Checkinbar onCheckedSuccessful={()=>{
          batch(()=>{
            refetchCheckinState()
            refetchLatestCheckers()
          })
        }}/>

        <Status>
          <StatuBlock title="EarlyBirds" value={shortNumber(checkinState()?.players || 0)} loading={checkinState.loading} link="/ranks"/>
          <StatuBlock title="Check-ins" value={checkinState()?.checkins || 0} loading={checkinState.loading} link="/feeds"/>
          <StatuBlock title="$worm minted" value={shortNumber(checkinState()?.mint || 0,12,1)} loading={checkinState.loading} link="/worm"/>
          <StatuBlock loading={latestCheckers?.loading}>
            <div className="avatar-group -space-x-6">
              <Show when={latestCheckers?.state == "ready"} fallback="...">
                 <For each={Array.from({length:4})}>
                  {(item,idx)=>(
                    <div className="avatar">
                      <div className="w-10">
                        <Avatar username={latestCheckers()?.[idx()]}/>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
              
            </div>
            <A className='btn btn-circle ' href='/feeds'>
              <Icon icon="iconoir:arrow-up-right" />
            </A>
          </StatuBlock>

        </Status>

        <div className='w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 pt-12 px-2 pb-24'>

          <div className='col-span-full'>
            <div className='text-3xl md:text-4xl lg:text-5xl text-center py-4'>Everything your need to know</div>
          </div>
          
          <FaqContainer>
            <For each={faqs}>
              {({title,content},index)=><FaqItem title={title} content={content} index={index()}/>}
            </For>
          </FaqContainer>

          <div className='col-span-full flex flex-col items-center justify-center'>
            <div className=' text-center py-4 text-current/60 p-2 text-xs md:text-sm lg:text-md'><b>earlybirds™</b> <span>is fully community-driven. Any other questions? Join our official Discord for support!</span></div>
            <div>
              <button className='btn btn-secondary'> <Icon icon="carbon:logo-discord"/>Join Discord</button>
            </div>
          </div>
          {/* <div className="join join-vertical col-span-full">
            <div className="collapse collapse-arrow join-item border-base-300 border-y rounded-none">
              <input type="radio" name="my-accordion-4" defaultChecked />
              <div className="collapse-title font-semibold">How do I create an account?</div>
              <div className="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input type="radio" name="my-accordion-4" />
              <div className="collapse-title font-semibold">I forgot my password. What should I do?</div>
              <div className="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input type="radio" name="my-accordion-4" />
              <div className="collapse-title font-semibold">How do I update my profile information?</div>
              <div className="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
            </div>
          </div> */}

        </div>

         {/* <div className='w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 pt-12 px-2 pb-24'>
          <div className='col-span-1 md:col-span-3 lg:col-span-4 flex flex-col items-center md:items-start justify-between'>
            <div>
              <div className='text-3xl'><Icon icon="iconoir:chat-bubble-question" /></div>
              <div className='text-3xl md:text-4xl lg:text-5xl'>Everything your need to know</div>
            </div>
            
            <div>ddd</div>
          </div>
          <div className='col-span-1 md:col-span-5 lg:col-span-8'>2</div>
         </div> */}

        
      </div>
    </main>
  );
}
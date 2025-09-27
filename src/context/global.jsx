import { createContext, useContext, createResource, createSignal} from "solid-js";
import toast, { Toaster } from 'solid-toast';
import { fetchProcessInfo, hbFetchState,fetchState } from "../api"
import { env } from "../store"
import { ModalBox, ModalTitle } from "../components/modal";
import { MetaProvider, Title, Style } from "@solidjs/meta";


const GlobalContext = createContext()

const greetings = [{
  date:"20250723",
  content: "You are stronger than you think.",
  lang: "en"
},{
  content: "Never stop dreaming.",
  lang: "en"
},{
  content: "Do your best and never quit.",
  lang: "en"
},{
  content: "Believe, achieve, succeed.",
  lang: "en"
}]

export const GlobalProvider = (props) => {
  let _popup
  const [pageTitle,setPageTitle] = createSignal(env.app_name)
  const [checkinProcess,{refetch:refetchCheckinProcess}] = createResource(()=>env?.checkin_pid,fetchProcessInfo)
  const [arProcess,{refetch:refetchArProcess}] = createResource(()=>env?.artoken_pid ,fetchProcessInfo)
  const [wormProcess,{refetch:refetchWormProcess}] = createResource(()=>env?.wrom_pid ,fetchProcessInfo)
  // const [captchaProcess,{refetch:refetchCaptchProcess}] = createResource(()=>env?.captcha_pid ,fetchProcessInfo)

  const [checkinState,{refetch:refetchCheckinState}] = createResource(()=>env?.checkin_pid,fetchState)
  const [style,setStyle] = createSignal()

  const hooks = {
    env,
    toast,
    checkinProcess,
    refetchCheckinProcess,
    arProcess,
    refetchArProcess,
    wormProcess,
    refetchWormProcess,
    setPageTitle,
    setStyle,
    checkinState,
    refetchCheckinState,
    getARandomGreeting : (date) =>{
      const _date = date || new Date().toDateString('en-US',{
      year: "numeric",
      month: "long",
      day: "numeric",
    })
      const result = greetings.filter((g)=>g.date == _date || g.date==null)
      const r = Math.floor(Math.random() * (result.length -1))
      return result[r]
    }
  }
  return(
    <GlobalContext.Provider value={hooks}>

      <div style={style()} className="transition-all">
         {props?.children}
      </div>
     
      
      <Toaster
        position="bottom-center"
        // Spacing between each toast in pixels
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options that each toast will inherit. Will be overwritten by individual toast options
          className: 'alert alert-info',
          duration: 5000,
        }}
      />
      <ModalBox ref={_popup}>
        <ModalTitle>detail</ModalTitle>
      </ModalBox>
    </GlobalContext.Provider>
  )
}

export const useGlobal =()=> useContext(GlobalContext)
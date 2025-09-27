import { createSignal, onMount, createEffect, onCleanup,Show } from "solid-js"
import { Icon } from "@iconify-icon/solid"
import { ColorPicker,randomAColor } from "./colorpicker"
import { hexToHsl,getContrastYIQ,hslToHex } from "../lib/color"
import Avatar from "./avatar"
import { useClock, useGlobal,useUser } from "../context"
import { useWallet } from "arwallet-solid-kit"
import { AoCaptcha } from "aocaptcha-sdk"
import { storage } from "../lib/storage"
import Spinner from "./spinner"

const views = Object.freeze({
  EDITING: 1,
  CHECKED: 2,
  FAILD: 3
});


export default props => {
  let _color_picker
  let _editor
  let maxLength = 140
  const {env,toast,checkinProcess,getARandomGreeting,refetchCheckinState} = useGlobal()
  const {address, wallet} = useWallet()
  const {plan, profile, refetchProfile} = useUser()
  const {timestamp} = useClock()
  const [visable,setVisable] = createSignal(false)
  const [view,setView] = createSignal(views.EDITING)
  const [posting,setPosting] = createSignal(false)
  const [color,setColor] = createSignal("#8d4fff")
  const [style,setStyle] = createSignal()
  const [greeting, setGreeting ] = createSignal()
  const [isEditorFocused, setIsEditorFocused] = createSignal(false);

  const cacheUserCheckinTheme = (address,theme)=>{
    const key = `greeting_${address}`
    storage.set(key,theme,{type: "sessionStorage"})
  }

  const clearCachedUserCheckinTheme = (address) => {
    const key = `greeting_${address}`
    storage.delete(key,"sessionStorage")
  }

  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  
  const updateText = () => {
    let content = _editor.innerText.replace(/\r/g, "");
    if (content.length > maxLength) {
      content = content.slice(0, maxLength);
      _editor.innerText = content;
      placeCaretAtEnd(_editor);
    }
    setGreeting(content);
    clearCachedUserCheckinTheme(address(),{
      color : color(),
      greeting : greeting()
    })
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const plain = (e.clipboardData || window.clipboardData).getData("text");
    const current = _editor.innerText;
    const remaining = maxLength - current.length;
    const toInsert = plain.slice(0, remaining);

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(toInsert));
    selection.collapseToEnd();

    updateText();
  };

  const HandleSubmitCheckin = async()=>{
    try{
      setPosting(true)
      let now = new Date().getTime()
      console.log('now: ', now);
      if(!props?.address || !address()) return
      if(!plan()) {
        console.log("Missed plan")
        return
      }
      if(!plan()?.next) {
        console.log("the plan is expired")
        return
      }
      let start = plan()?.next
      console.log('start: ', start);
      let end = plan()?.next + 2*60*60*1000
      console.log('end: ', end);
      const captcha = new AoCaptcha(env?.captcha_pid)
      console.log('captcha: ', captcha);
      if(now>=start&&now<=end){

        const request = await captcha.request({
          Recipient : env.checkin_pid,
          ['Request-Type'] : "Checkin",
          ['X-Note'] : greeting()||getARandomGreeting(),
          ['X-Color']: color()
        },wallet())
        if(!request){throw("request failed")}
        console.log('request: ', request);
        
        const verified = await captcha.verify(request,wallet())
        if(!verified){throw("verified failed")}
        console.log('verified: ', verified);

        await refetchProfile()
        
        let { latest_checkin } = await profile()
        console.log('checkin: ', latest_checkin);


        if(latest_checkin){
          clearCachedUserCheckinTheme(address())
        }
        
        if(props?.onCheckedSuccessful){
          props?.onCheckedSuccessful(latest_checkin)
        }
        _color_picker.hide()
      }else{
        throw("Outside check-in time.")
      } 
    }catch(err){
      console.error(err)
      toast.error("Checked in Failed!")
    }finally{
      setPosting(false)
    }
  }

  const show = () =>{
    const key =  `greeting_${address()}`
    const cached = storage.get(key,"sessionStorage")
    console.log('cached: ', cached);
    const g = cached?.greeting || getARandomGreeting()?.content
    const c = cached?.color || hslToHex(randomAColor())
    setGreeting(g || "Earlybirds catch the 🐛$worm")
    _editor.innerText = g
    setColor(c)
    setView(views.EDITING)
    setVisable(true)

  }

  const hide = () => {
    if(address()){
      console.log("cached theme")
      cacheUserCheckinTheme(address(),{
        greeting : greeting(),
        color : color()
      })
    }
    setIsEditorFocused(false)
    setGreeting(null)
    setVisable(false)
  }

  onMount(()=>{
    props?.ref({
      show:show,
      hide:hide
    })
     _editor.addEventListener("paste", handlePaste);
  })

  onCleanup(()=>{
    _editor.removeEventListener("paste", handlePaste);
  })
  createEffect((()=>{
    if(color()){
      const _color = color()
      const _constras_color = getContrastYIQ(_color)
      setStyle({
        "--color-bg" : _color,
        "--color-fg" : _constras_color,
        "--divider-color" : _constras_color
      })
    }
  }))



  return(
    <div style={style()} className="transition-all">
      <div 
        className="fixed top-0 left-0 w-full h-full bg-[var(--color-bg)] text-[var(--color-fg)] z-10 transition-all p-4 lg:p-6 flex flex-col justify-between"
        classList={{
          "translate-y-full" : !visable(),
          "translate-y-0" : visable()
        }}
      >
        <div className="w-full flex items-center justify-between">
          <div className="text-current/60 text-lg lg:text-xl flex items-center gap-2 lg:gap-4">
          <Avatar username={props?.address || "2dgfgf"} className=" size-6 lg:size-7"/>
          <span>{props?.date}</span>
          
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="btn btn-ghost btn-circle " onClick={()=>_color_picker.show()} disabled={posting()} ><Icon icon="iconoir:fill-color" /></button>
            <button disabled={posting()} onClick={hide} className="btn btn-ghost btn-circle">
              <Icon icon="ri:close-large-line" />
            </button>
          </div>
        </div>
        <div className="divider"></div>  

        {/* <Editable maxLength={140} disabled={posting() || !inputing()}>{greeting()}</Editable> */}
        <div className="w-full flex-1">
          <p 
            ref={_editor}
            className="text-2xl lg:text-3xl w-full" 
            contentEditable={posting()?"false":"plaintext-only"}
            class=" whitespace-pre-wrap break-words"
            style={{ outline: "none" }}
            onInput={updateText}
            onFocus={()=>setIsEditorFocused(true)}
            onBlur={()=>setIsEditorFocused(false)}
          >
          </p>

        </div>
        
        <div className="divider"></div>  
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center">
            
            <button 
              className="btn btn-ghost btn-circle " 
              disabled={posting() || isEditorFocused()}
              onClick={()=>{
                  const g = getARandomGreeting()
                  const content = g?.content || "Earlybirds catch the 🐛$worm"
                  _editor.innerText = content
                  updateText()
              }}
            >
              <Show when={isEditorFocused()} fallback={<Icon icon="lets-icons:sort-random-light" />}><Icon icon="iconoir:edit-pencil" /> </Show>
              
            </button>
            <div className="divider divider-horizontal"></div>
            <div className="text-current/50 text-sm">{greeting()?.length || 0}/{maxLength} <Show when={greeting()?.length > maxLength || greeting()?.length <= 1}> <Icon icon="bxs:error" /></Show></div>
          </div>
          <div>
            <Show when={timestamp()>=(plan()?.next)&&timestamp()<=(plan()?.next + 7200000)&&!posting()} fallback={<span>Not within check-in hours(6-8 AM)</span>}>
              <button 
                className="btn btn-circle bg-[var(--color-fg)] border-[var(--color-fg)] disabled:border-transparent text-[var(--color-bg))] btn-lg"
                disabled={posting() || greeting()?.length <= 1 || greeting()?.length > maxLength || isEditorFocused()}
                onClick={HandleSubmitCheckin}
              >
                <Show when={posting()} fallback={<Icon icon="iconoir:check" />}> <Spinner/></Show>
              </button>
            </Show>
          </div>
        </div>
        </div>
        <ColorPicker 
          ref={_color_picker} onChange={e=>{
            if(e?.[0]){
              setColor(hslToHex(e?.[0]))
            }
          }} 
          defaultValue={color()}
        />
    </div>
  )
}
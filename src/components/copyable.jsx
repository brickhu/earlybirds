import { Icon } from '@iconify-icon/solid';
import { createSignal, Show } from 'solid-js';

export function Copyable(props){
  const [copied,setCopied] = createSignal(false)
  return(
    <span 
      class="inline-flex items-center gap-2 group"
      
    >
      {props?.children}
      <button 
        class="group-hover:visible invisible cursor-pointer tooltip"
        data-tip={copied()?"Copied":"Copy"}
        onMouseLeave={()=>setCopied(false)}
        onClick={async ()=>{
          await navigator.clipboard.writeText(props?.value)
          setCopied(true)
        }}
      >
        <Show when={copied()} fallback={<Icon icon="carbon:copy" className="scale-90" />}>
          <Icon icon="iconoir:check" className="scale-90"></Icon>
        </Show>
        
      </button>
      
    </span>
  )
}
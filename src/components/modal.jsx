import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
import { Show, onMount } from "solid-js"

export const ModalBox = props => {
  let _modal
  onMount(()=>{
    props?.ref({
      show:(e)=>{
        _modal.showModal()
      },
      hide:(e)=>{
       _modal.close()
      }
    })
  })

  return(
    <dialog id={props?.id} className="modal " ref={_modal} onCancel={(e)=>!props?.cancelable && e.preventDefault()}>
      <div className={mergeClasses("modal-box border-base-300 border",`${props?.class || props?.className}`)}>
         <Show when={props?.closable}>
          <form method="dialog">
              <button className="btn btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        </Show>
        {props?.children}
        <Show when={props?.cancelable}>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </Show>
        
      </div>
    </dialog>
  )
}

export const ModalTitle = props => <h3 className="text-lg font-bold">{props?.children}</h3>
export const ModalContent = props => <p className={mergeClasses("py-4",`${props?.class || props?.className}`)}>{props?.children}</p>
export const ModalAction = props => <div className={mergeClasses("modal-action",`${props?.class || props?.className}`)}>{props?.children}</div>
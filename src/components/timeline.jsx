import { Icon } from "@iconify-icon/solid"
import { Show } from "solid-js"
export const Timelines = props => {
  return(
    <ul className="timeline timeline-vertical timeline-compact w-full timeline-snap-icon gap-0">{props?.children}</ul>
  )
}

export const Timeline = props => {
  return(
    <li>
      <hr />
      <div className="timeline-middle bg-base-300 rounded-full size-6 flex items-center justify-center ">
        <div className="-top-1">{props?.icon}</div>
      </div>
      <div className="timeline-end w-full pt-1">
        <div className="flex justify-between text-sm pl-2 items-start">
          <div >{props?.text}</div>
          <div className="flex items-center gap-2 min-w-24 justify-end">
            <p className="text-current/50 text-xs">{props?.time}</p>
            <a className="btn btn-ghost btn-circle btn-xs" href={`https://www.ao.link/#/message/${props?.id}`} target="_blank">
              <Icon icon="iconoir:open-new-window" />
            </a>
          </div>
        </div>
        <Show when={props?.children}>
          <div className="p-2">{props?.children}</div>
        </Show>
      </div>
      <hr />
    </li>
  )
}
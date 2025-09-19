
import mergeClasses from "@robit-dev/tailwindcss-class-combiner"


export const Blocks = props => {
  return(
    <div className={mergeClasses("grid grid-cols-3 gap-4",props?.className || props?.class)}>{props?.children}</div>
  )
}

export const Block = props => {
  return (
   <div className={mergeClasses("bg-base-100 py-2 px-4 w-full rounded-field border border-base-300",props?.className || props?.class)}>
    <Show when={props?.label}><label className="text-xs uppercase text-current/60">{props?.label}</label></Show>
    <Show when={props?.value}>
      <p className="font-bold">{props?.value}</p>
    </Show>
    <Show when={props?.children}>
      <div>{props?.children}</div>
    </Show>
  </div>
)
}
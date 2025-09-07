
import { createMemo, mergeProps,Show } from "solid-js"

export const Shorter = props => {

 const s = mergeProps({ value: "", length: 8, space: "..." }, props);
const short_display = createMemo(()=>{
  const text = s?.value
  const first = s?.length || 8;
  const end = -first - 1
  return text.slice(0, first) + (s?.space || "...") + text.slice(end);
})

  return (
    <div className="tooltip inline-block"  data-tip={s.value}>
      <span className={props?.class || props?.className}>{short_display()}</span>
    </div>
  )
}
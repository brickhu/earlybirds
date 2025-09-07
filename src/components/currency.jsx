
import { createMemo, mergeProps,Show } from "solid-js"

export const Currency = props => {
  const p = mergeProps({ value: 0, precision: 1, fixed: 0 }, props);
  const result = createMemo(()=>{
    const n = (p?.value / Math.pow(10, p?.precision))
    const fixed = n.toFixed(p?.fixed || 0);
    return {
      tooltip : String(n),
      display : fixed > 0 ? String(fixed) : String(n)
    }
  })
  return (
    <div className="tooltip inline-block z-0"  data-tip={result()?.tooltip}>
      <span className={props?.class || props?.className}>{props?.symbol}{result()?.display}<Show when={props?.ticker}> {props?.ticker}</Show></span>
    </div>
  )
}

import { createMemo, mergeProps,Show } from "solid-js"

export const Currency = props => {
  const p = mergeProps({ value: 0, precision: 1, fixed: 0 }, props);
  const result = createMemo(()=>{
    const n = (p?.value / Math.pow(10, p?.precision))
    const fixed = n.toFixed(p?.fixed || 0);
    return {
      tooltip : String(n),
      display : fixed > 0 ? String(fixed) : String(n),
    }
  })
  return (
    <div className="tooltip inline-block z-0 oldstyle-nums slashed-zero "  data-tip={result()?.tooltip}>
      <span className={props?.class || props?.className}>{props?.symbol}<span classList={{"font-bold" : p?.value>0, "text-current/80" : p?.value<=0}}>{result()?.display}</span><Show when={props?.ticker}> <span className=" font-normal tracking-tighter">{props?.ticker}</span></Show></span>
    </div>
  )
}
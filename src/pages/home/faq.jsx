import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
import { mergeProps } from "solid-js"

export const FaqContainer = props => {
  return <div className="join join-vertical col-span-full">{props?.children}</div>
}

export const FaqItem = props=> {
  const {title,content} = mergeProps({title:null,content:null},props)

  return (
    <div className="collapse collapse-arrow join-item border-base-300 border-y rounded-none">
      <input type="radio" name="my-accordion-4" />
      <div className="collapse-title">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-3 lg:gap-4">
          <div className="col-span-1 md:col-span-3 lg:col-span-3 hidden md:block text-current/50">{String(props?.index + 1 || 0).padStart(2, "0")}</div>
          <div 
            className="col-span-1 md:col-span-5 lg:col-span-8 font-semibold"
     
          >{title}</div>
        </div>
      </div>
      <div className="collapse-content ">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 ">
          <div className="col-span-1 md:col-span-3 lg:col-span-3 hidden md:block text-current/50"> </div>
          <div className="col-span-1 md:col-span-5 lg:col-span-8">{content}</div>
        </div>
      </div>
    </div>
  )
}


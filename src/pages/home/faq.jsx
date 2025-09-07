import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
import { mergeProps } from "solid-js"
export const FaqContainer = props => {
  return <div className={mergeClasses("flex flex-col w-full gap-4 ",props?.class || props?.className)}>{props?.children}</div>
}

export const FaqItem = props=> {
  const {title,content,checked} = mergeProps({title:null,content:null},props)

  return <div className="bg-base-200 border-base-300 collapse border collapse-arrow w-full hover:bg-base-100">
          <input type="checkbox" className="peer" checked={checked} />
          <div
            className="collapse-title peer-checked:bg-base-100 peer-checked:text-base-content font-bold"
          >
            {title}
          </div>
          <div
            className="collapse-content peer-checked:bg-base-100 peer-checked:text-base-content"
          >
            {content}
          </div>
        </div>
}
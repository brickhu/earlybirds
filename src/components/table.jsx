import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
export const Table = props => <table class={mergeClasses("table-auto text-xs md:text-sm lg:text-base w-full box-border border-collapse ",`${props?.class || props?.className}`)}>{props?.children}</table>
export const Caption = props => <caption className={mergeClasses("p-6",`${props?.class || props?.className}`)}>{props?.children}</caption>
export const Head = props => <thead className={mergeClasses("",`${props?.class || props?.className}`)}>{props?.children}</thead>
export const Body = props => <tbody className={mergeClasses(" divide-y divide-base-200",`${props?.class || props?.className}`)}>{props?.children}</tbody>
export const Cols = props => <tr className={mergeClasses(" border-b border-base-200",`${props?.class || props?.className}`)}>{props?.children}</tr>
export const Col = props => <th scope="col" className={mergeClasses("text-left p-1 md:p-2 font-normal text-current/50 uppercase whitespace-nowrap truncate",`${props?.class || props?.className}`)}>{props?.children}</th>
export const Row = props => <tr className={mergeClasses(" hover:bg-base-200",`${props?.class || props?.className}`)}>{props?.children}</tr>
export const Cell = props => <td className={mergeClasses("whitespace-nowrap truncate text-left px-1 md:px-2 py-2 md:py-1 overflow-visible",`${props?.class || props?.className}`)}>{props?.children}</td>
export const Actions = props => <div className={mergeClasses("px-2 py-4 flex flex-col w-full md:flex-row items-center justify-center md:justify-end",`${props?.class || props?.className}`)}>{props?.children}</div>

import mergeClasses from "@robit-dev/tailwindcss-class-combiner"
export default props => (
  <svg class={mergeClasses("inline",props?.class || props?.className)} viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 11.9721H3.99308L4.80799 9.76843L2.97444 6.01404L0 11.9721Z" class="fill-current"/>
  <path d="M10.5939 8.99303L6.15259 0.0559692L4.80798 3.11661L9.00479 11.9721H12.028L10.5939 8.99303Z" class="fill-current"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.014 11.972C21.32 11.972 24 9.292 24 5.98601C24 2.68003 21.32 0 18.014 0C14.708 0 12.028 2.68003 12.028 5.98601C12.028 9.292 14.708 11.972 18.014 11.972ZM18.014 9.6224C20.0223 9.6224 21.6503 7.99432 21.6503 5.98601C21.6503 3.97771 20.0223 2.34965 18.014 2.34965C16.0057 2.34965 14.3776 3.97771 14.3776 5.98601C14.3776 7.99432 16.0057 9.6224 18.014 9.6224Z" class="fill-current"/>
  </svg>
)
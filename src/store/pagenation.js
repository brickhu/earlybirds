import { createResource,createSignal,createEffect,batch } from "solid-js"

/**
 * Creates a pagination utility for managing paginated data fetching.
 *
 * @param {Function} signal - A reactive signal function that provides a dependency for the resource.
 * @param {Function} fetcher - A function to fetch data, which accepts an array of parameters and options.
 * @param {Object} [options] - Optional configuration for pagination.
 * @param {number} [options.size=100] - The number of items to fetch per page.
 * @returns {Array} - An array containing:
 *   - `res`: The reactive resource containing the fetched data.
 *   - `controls`: An object with the following properties:
 *       - `refetch`: A function to refetch the data.
 *       - `hasMore`: A signal indicating whether there are more items to load.
 *       - `loadingMore`: A signal indicating whether more items are currently being loaded.
 *       - `loadMore`: A function to load the next page of data.
 *   - `state`: An object with the following properties:
 *       - `size`: The size of each page.
 *       - `page`: The current page number.
 *
 * @throws {Error} - Throws an error if an exception occurs during the creation of the pagination utility.
 */
export const createPagination = (signal, fetcher, options) => {
  try {
    let size = options?.size || 100
    const [hasMore,setHasMore] = createSignal(false)
    const [page,setPage] = createSignal(1)
    const [loadingMore,setLoadingMore] = createSignal(false)
    const [res,{refetch,mutate}] = createResource(()=>([signal(),{size}]),fetcher)
    const loadMore = async()=>{
      if(hasMore()&&!loadingMore()){
        setLoadingMore(true)
        const length = res()?.length
        const newRes = await fetcher([signal(),{size,page:page(),cursor:res()?.[length-1]?.cursor}],{refetching:false})
        batch(()=>{
          mutate((current)=>{
            return [...(current||[]),...newRes||[]]
          })
          setPage(page()+1)
          setLoadingMore(false)
        })
      }
    }
    createEffect(()=>setHasMore(res()?.length>=size*page()))
    return [
      res,
      {
        refetch:()=>{
          refetch()
          setHasMore(false)
          setPage(1)
        },
        hasMore,
        loadingMore,
        loadMore
      },
      {size,page}
    ]
    
  } catch (error) {
    throw error
  }
  
}




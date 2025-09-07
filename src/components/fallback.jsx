export const ErrorFallback =(error, reset)=>(
  <div role="alert">
    <p>Something went wrong!</p>
    <p>{error.message}</p>
    <p><button className="btn btn-secondary" onClick={reset}>try again</button></p>
  </div>
)
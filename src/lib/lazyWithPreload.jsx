import { lazy } from 'react'

/**
 * React.lazy with a `preload()` that also removes the first-render pause.
 *
 * A plain lazy component always suspends the first time it renders, even when
 * its code was fetched long ago, which shows the fallback for a beat. Once
 * `preload()` has finished, this wrapper renders the loaded component directly,
 * so navigating to it is instant (and a photo flying in never waits on it).
 */
export function lazyWithPreload(factory) {
  let Loaded = null
  let promise = null
  const preload = () => {
    promise ??= factory().then((module) => {
      Loaded = module.default
      return module
    })
    return promise
  }
  const Lazy = lazy(preload)

  function Page(props) {
    return Loaded ? <Loaded {...props} /> : <Lazy {...props} />
  }
  Page.preload = preload
  return Page
}

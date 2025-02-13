import type { FC, ReactNode } from 'react'
import { Suspense } from 'react'

export function LazyLoad(Component: FC): ReactNode {
  return (
    <Suspense fallback={<div className="route-loading"></div>}>
      <Component />
    </Suspense>
  )
}

import type { Params } from "react-router-dom"
import { useParams, useSearchParams } from "react-router-dom"

import { getReadonlyRoute, useReadonlyRouteSelector } from "~/atoms/route"
import {
  FEED_COLLECTION_LIST,
  ROUTE_ENTRY_PENDING,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_PENDING,
} from "~/constants"
import { FeedViewType } from "~/lib/enum"

// '0', '1', '2', '3', '4', '5',
const FeedViewTypeValues = (() => {
  const values = Object.values(FeedViewType)
  return values.slice(values.length / 2).map((v) => v.toString())
})()
export const useRouteView = () => {
  const [search] = useSearchParams()
  const view = search.get("view")

  return (
    (view && FeedViewTypeValues.includes(view) ? +view : FeedViewType.Articles) ||
    FeedViewType.Articles
  )
}

export const useRouteEntryId = () => {
  const { entryId } = useParams()
  return entryId
}

export const useRouteFeedId = () => {
  const { feedId } = useParams()
  return feedId
}

export interface BizRouteParams {
  view: FeedViewType
  entryId?: string
  feedId?: string
  isCollection: boolean
  isAllFeeds: boolean
  isPendingEntry: boolean

  folderName?: string
}

const parseRouteParams = (params: Params<any>, search: URLSearchParams): BizRouteParams => {
  const _view = search.get("view")

  const view =
    (_view && FeedViewTypeValues.includes(_view) ? +_view : FeedViewType.Articles) ||
    FeedViewType.Articles

  return {
    view,
    entryId: params.entryId || undefined,
    feedId: params.feedId || undefined,
    // alias
    isCollection: params.feedId === FEED_COLLECTION_LIST,
    isAllFeeds: params.feedId === ROUTE_FEED_PENDING,
    isPendingEntry: params.entryId === ROUTE_ENTRY_PENDING,
    folderName: params.feedId?.startsWith(ROUTE_FEED_IN_FOLDER)
      ? params.feedId.slice(ROUTE_FEED_IN_FOLDER.length)
      : undefined,
  }
}

export const useRouteParms = () => {
  const params = useParams()
  const [search] = useSearchParams()

  return parseRouteParams(params, search)
}
const noop = [] as any[]
export const useRouteParamsSelector = <T>(
  selector: (params: BizRouteParams) => T,
  deps = noop,
): T =>
  useReadonlyRouteSelector((route) => {
    const { searchParams, params } = route

    return selector(parseRouteParams(params, searchParams))
  }, deps)

export const getRouteParams = () => {
  const route = getReadonlyRoute()
  const { searchParams, params } = route
  return parseRouteParams(params, searchParams)
}

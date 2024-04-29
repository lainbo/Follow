import { parseHtml } from "@renderer/lib/parse-html"
import { ActivedEntry } from "@renderer/lib/types"
import { useEffect, useState } from "react"
import { m } from "framer-motion"

export function EntryContent({ entry }: { entry: ActivedEntry }) {
  const [content, setContent] = useState<JSX.Element>()

  useEffect(() => {
    if (entry?.content) {
      parseHtml(entry?.content).then((parsed) => {
        setContent(parsed.content)
      })
    }
  }, [entry?.content])

  return (
    <m.div
      className="px-4 py-5 overflow-y-auto h-full"
      initial={{ opacity: 0.01, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.01, y: -50 }}
      key={entry?.id}
    >
      <div>
        <a
          href={entry?.url}
          target="_blank"
          className="block hover:bg-zinc-100 max-w-[598px] mx-auto p-6 rounded-md transition-colors cursor-pointer"
        >
          <div className="text-3xl font-bold select-text">{entry?.title}</div>
          <div className="mt-2 text-[13px] text-zinc-500 font-medium">
            {entry?.feeds?.title}
          </div>
          <div className="text-[13px] text-zinc-500">
            {entry?.publishedAt && new Date(entry?.publishedAt).toUTCString()}
          </div>
        </a>
        <div className="max-w-[550px] mx-auto mt-10 prose text-[15px] prose-zinc select-text">
          {content}
        </div>
      </div>
    </m.div>
  )
}
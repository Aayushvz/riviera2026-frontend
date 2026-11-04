export const EventSkeleton = () => {
  return (
    <div className="min-h-screen animate-pulse bg-[#f5ebe5]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex gap-8">
          <div className="h-[230px] w-[230px] flex-shrink-0 rounded-lg bg-gray-300" />
          <div className="flex-1">
            <div className="mb-2 h-10 w-3/4 rounded bg-gray-300" />
            <div className="mb-6 h-6 w-1/2 rounded bg-gray-300" />
            <div className="h-8 w-32 rounded bg-gray-300" />
          </div>
        </div>
        <div className="mb-6 h-32 rounded bg-gray-300" />
      </div>
    </div>
  )
}

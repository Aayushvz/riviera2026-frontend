export default function Screen1() {
  return (
    <div className="absolute inset-0 z-0 flex">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden">
          <div className="strip-col bg-primary h-full w-full border-r border-black/80"></div>
        </div>
      ))}
      <h1 className="font-bebas-rounded absolute top-1/2 left-1/2 -translate-1/2 text-center text-9xl uppercase">
        Try your luck!
      </h1>
    </div>
  )
}

const ITEMS = [
  'SOFTWARE ENGINEER',
  'TECHNICAL WRITER',
  'SEO STRATEGIST',
  'LAGOS, NIGERIA',
]

export default function Ticker() {
  return (
    <div className="bg-ink border-b-2 border-ink py-3 px-5 md:px-10">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="font-mono text-[0.65rem] md:text-xs tracking-widest text-yellow border border-yellow/40 px-3 py-1.5"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 text-center"
    >
      <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-coral uppercase">
        404
      </p>
      <h1 className="font-display mt-4 text-5xl leading-[0.95] font-bold tracking-tighter text-balance sm:text-6xl">
        That one&rsquo;s off the <span className="text-sunset">line-up</span>.
      </h1>
      <p className="mt-5 text-base text-muted">
        The event you were looking for either finished, moved, or never made it onto the
        calendar.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber via-coral to-violet px-7 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:scale-[1.03]"
      >
        Back to what&rsquo;s on
      </Link>
    </main>
  );
}

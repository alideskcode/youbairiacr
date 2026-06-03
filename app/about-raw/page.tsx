export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#A2C2E0] text-gray-900 px-2">
      <div className="w-full max-w-xl sm:max-w-2xl rounded-xl shadow-lg bg-white p-6 sm:p-10 border border-[#A2C2E0]">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center flex items-center gap-2">
          <span role="img" aria-label="globe">🌐</span>
          About Youbairia
        </h1>
        <p className="text-base sm:text-lg mb-8 text-center font-medium">
          <span className="font-bold text-[#A2C2E0]">Welcome to Youbairia</span> – The Digital Marketplace for <span className="text-[#B7E4D7]">Builders</span>, <span className="text-[#A2C2E0]">Hustlers</span> & <span className="text-[#B7E4D7]">Creators</span>.<br />
          <span className="italic text-gray-700">Digital products deserve a digital-first home.</span><br /><br />
          <span className="font-semibold text-gray-800">We're the operating system for the new-age entrepreneur.</span>
        </p>
      </div>
    </main>
  )
}
// }
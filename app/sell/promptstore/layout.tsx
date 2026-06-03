export default function PromptstoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-none px-0">
      {children}
    </div>
  )
}

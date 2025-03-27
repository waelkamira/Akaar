import type React from "react"


export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
   
      <main className="min-h-screen bg-five">{children}</main>
    </>
  )
}


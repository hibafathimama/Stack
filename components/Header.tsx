"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"




export default function Header() {
   const router = useRouter()

const handleLogout = async () => {
  try {
    await fetch("/api/auth/clear-cookie", {
      method: "POST",
    })

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    router.push("/login")
  } catch (error) {
    console.log("Logout error:", error)
  }
}
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <Link href="/">
          <img
            src="/shazam-3-512.jpg"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </Link>


        <nav className="flex items-center gap-6">
          {/* <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </Link> */}

          <Link
  href="/user/profile/view"
  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E8D8C3] hover:bg-[#DCC8AE] transition"
>
  <span className="text-[#6B4F3A] text-lg">
    👤
  </span>
</Link>
          {/* <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link> */}

             <button
            onClick={handleLogout}
            className="bg-[#6B4F3A] text-white px-4 py-2 rounded-lg hover:bg-[#543C2C] transition"
          >
            Logout
          </button>
        </nav>

      </div>
    </header>
  )
}
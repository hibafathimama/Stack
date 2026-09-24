"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <img
            src="/shazam-3-512.jpg"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">

          {/* <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link> */}

          <Link
            href="/registration"
            className="bg-[#6B4F3A] text-white px-4 py-2 rounded-lg hover:bg-[#543C2C] transition"
          >
            Register
          </Link>

        </nav>

      </div>
    </header>
  )
}
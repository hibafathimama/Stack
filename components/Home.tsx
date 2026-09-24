"use client"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5EDE3]">

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">

        <div className="text-center max-w-2xl">

          <h1 className="text-5xl md:text-6xl font-bold text-[#3E3025]">
            Welcome to Our Store
          </h1>

          <p className="mt-5 text-lg text-[#78695A]">
            Discover amazing products at great prices.
            Find something you love and shop with Us.
          </p>

          <div className="mt-8 flex justify-center gap-4">

           

            <Link
              href="/login"
              className="border-2 border-[#6B4F3A] text-[#6B4F3A] px-7 py-3 rounded-lg font-semibold hover:bg-[#6B4F3A] hover:text-white transition"
            >
              Login
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}
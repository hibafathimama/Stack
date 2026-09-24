
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import ProductCard from "@/components/Productcard"
import { ProductType } from "@/types/product"
import api from "@/lib/api"

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 8
  const skip = (currentPage - 1) * limit
  const totalPages = Math.ceil(total / limit)


  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await api.get(
  `/products/listallproduct?limit=${limit}&skip=${skip}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

      console.log("PRODUCT RESPONSE:", response.data)

      setProducts(response.data.data || [])
      setTotal(response.data.total || 0)
    } catch (error: any) {
      console.log("PRODUCT ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  )

  if (!confirmDelete) {
    return
  }

  try {
    const token = localStorage.getItem("token")

    await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    alert("Product deleted successfully")

    // Get updated product list
    getProducts()

  } catch (error: any) {
    console.log("DELETE ERROR:", error)
    console.log("SERVER RESPONSE:", error.response?.data)

    alert(
      error.response?.data?.message ||
      "Failed to delete product"
    )
  }
}
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "null")

  setRole(user?.role || "")

  getProducts()
}, [currentPage])

  return (
<div className="min-h-screen bg-[#E8D5B5]">
              <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading + Add Product */}
        <div className="flex flex-col items-center justify-center mb-10">

          <h1 className="text-4xl font-bold text-white mb-5">
            Products
          </h1>

          {role ==="seller" &&(
            <Link
          href="/products/add"
          className="bg-[#6B4F3A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#543C2C] transition"
        >
          + Add Product
        </Link>
          )}
        

        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white text-center text-lg">
            Loading products...
          </p>
        )}

        {/* No products */}
        {!loading && products.length === 0 && (
          <p className="text-white text-center text-lg">
            No products found.
          </p>
        )}

              {/* Products */}
        {!loading && products.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}

          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="w-full flex justify-center items-center mt-10">
            <div className="flex items-center gap-2">

              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#E8D8C3] text-[#6B4F3A] font-semibold disabled:opacity-40"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    currentPage === index + 1
                      ? "bg-[#6B4F3A] text-white"
                      : "bg-[#E8D8C3] text-[#6B4F3A]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#E8D8C3] text-[#6B4F3A] font-semibold disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </div>
        )}

      </main>
        

    

      
    </div>
  )
}


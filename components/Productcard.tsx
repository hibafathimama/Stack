import Link from "next/link"
import { ProductType } from "@/types/product"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: ProductType
  onDelete: (id: string) => void
}

export default function ProductCard({
  product,
  onDelete,
}: ProductCardProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const role = user?.role

  const router = useRouter()

  const imageUrl = product.image
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "")}/${product.image.replaceAll("\\", "/")}`
    : "/logo.png.jpg"

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#E8D8C3] hover:shadow-xl transition duration-300">

      {/* Image - structure unchanged */}
      <div className="w-full h-56 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover px-10"
        />
      </div>

      {/* Card Content */}
      <div className="p-5">

        {/* Title */}
        <h2 className="text-xl font-bold text-[#4A3528] text-center">
          {product.title}
        </h2>

        {/* Category */}
        <div className="flex justify-center mt-2">
          <span className="px-3 py-1 bg-[#F5EDE3] text-[#6B4F3A] text-xs font-semibold rounded-full">
            {product.cateogary}
          </span>
        </div>

        {/* Price */}
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-[#6B4F3A]">
            ₹{product.price}
          </p>
        </div>

        {/* Description */}
        <div className="mt-4 bg-[#FAF7F2] rounded-xl p-3">
          <p className="text-sm text-gray-600 leading-6 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* View Product */}
        <Link
          href={`/products/${product._id}`}
          className="block w-full mt-4 bg-[#6B4F3A] text-white py-2.5 rounded-xl font-semibold text-center hover:bg-[#543C2C] transition"
        >
          View Product
        </Link>

        {/* Seller Buttons */}
        {role === "seller" && (
          <div className="flex gap-2 sm:gap-3 mt-4 w-full">

            <button
              onClick={() => router.push(`/products/edit/${product._id}`)}
              className="flex-1 sm:flex-none sm:w-28 h-10 sm:h-11 w-28 h-11 bg-[#E8D8C3] text-[#6B4F3A] rounded-lg font-semibold border border-[#D6C1A8] hover:bg-[#DCC8AE] transition duration-200"
            >
              Update
            </button>

            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 sm:flex-none sm:w-28 h-10 sm:h-11 w-28 h-11 bg-[#F3D6D6] text-[#A94442] rounded-lg font-semibold border border-[#E6B8B8] hover:bg-[#EBC3C3] transition duration-200"
            >
              Delete
            </button>

          </div>
        )}

      </div>
    </div>
  )
}
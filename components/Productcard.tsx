import Link from "next/link"
import { ProductType } from "@/types/product"
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: ProductType
  onDelete: (id: string) => void
}

export default function ProductCard({
  product,
  onDelete,
}: ProductCardProps)
 { 
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const role = user?.role

   const router = useRouter();

  const imageUrl = product.image
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "")}/${product.image.replaceAll("\\", "/")}`
    : "/logo.png.jpg"

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  
  <div className="w-full h-56 bg-gray-100">
    <img
      src={imageUrl}
      alt={product.title}
      className="w-full h-full object-cover px-10"
    />
  </div>

      <div className="p-5">

        <h2 className="text-xl font-bold text-gray-800 text-center ">
          {product.title}
        </h2>

        <p className="text-sm text-gray-500 mt-1 text-center">
          {product.cateogary}
        </p>

        <p className="text-xl font-bold text-[#6B4F3A] mt-3 text-center">
          ₹{product.price}
        </p>

        <p className="text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <Link
          href={`/products/${product._id}`}
          className="block w-full mt-4 bg-[#6B4F3A] text-white py-2.5 rounded-xl font-semibold text-center hover:bg-[#543C2C] transition"
        >
          View Product
        </Link>
         <div className="flex gap-3 mt-4">

          
         {role === "seller" && (
  <div className="flex gap-3 mt-1">

    <button
      onClick={() => router.push(`/products/edit/${product._id}`)}
      className="w-28 h-11 bg-[#E8D8C3] text-[#6B4F3A] rounded-lg font-semibold border border-[#D6C1A8] hover:bg-[#DCC8AE] transition duration-200"
    >
      Update
    </button>

    <button
      onClick={() => onDelete(product._id)}
      className="w-28 h-11 bg-[#F3D6D6] text-[#A94442] rounded-lg font-semibold border border-[#E6B8B8] hover:bg-[#EBC3C3] transition duration-200"
    >
      Delete
    </button>

  </div>
)}

        </div>
      </div>
    </div>
  )
}
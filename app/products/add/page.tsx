
"use client"

import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

const schema = yup.object({
  title: yup.string().required("Title is required"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .moreThan(0,"price must be greater than 0"),

  cateogary: yup.string().required("Category is required"),

  description: yup.string().required("Description is required")
  .min(10,"Description must be atleast 10 letters"),

  image: yup
    .mixed<FileList>()
    .test(
      "required",
      "image is required",
      (value) =>{
      const files = value as FileList | undefined;
      return !!files && files.length > 0;

      }
    ),
})

type ProductForm = yup.InferType<typeof schema>

export default function AddProductPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: ProductForm) => {
    try {
      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("price", String(data.price))
      formData.append("cateogary", data.cateogary)
      formData.append("description", data.description)

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0])
      }

      const token = localStorage.getItem("token")

      const response = await api.post(
        "/products/addproduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("ADD PRODUCT RESPONSE:", response.data)

      alert("Product added successfully")

      router.push("/products")
    } catch (error: any) {
      console.log("ADD PRODUCT ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)

      alert(
        error.response?.data?.message ||
        "Failed to add product"
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add Product
          </h1>

          <p className="text-gray-500 mb-8">
            Add a new product to your store
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-5"
          >

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title
              </label>

              <input
                type="text"
                {...register("title")}
                placeholder="Enter product title"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>

              <input
                type="number"
                {...register("price")}
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <input
                type="text"
                {...register("cateogary")}
                placeholder="Enter category"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.cateogary && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cateogary.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                {...register("image")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />

              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                {...register("description")}
                placeholder="Enter product description"
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Add Product
              </button>

              <button
                type="button"
                onClick={() => router.push("/products")}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  )
}


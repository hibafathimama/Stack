"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Link from "next/link"


import Header from "@/components/Header"
import api from "@/lib/api"

interface UserType {
  firstName: string
  lastName: string
  email: string
  role: string
  image?: string
}

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z ]+$/, "Only letters are allowed"),

  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z ]+$/, "Only letters are allowed"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
})

type UpdateForm = yup.InferType<typeof schema>

export default function UpdateProfilePage(){
    const router=useRouter()

  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [serverError, setServerError] = useState("")

  const{
    register,
    handleSubmit,
    reset,
    formState:{errors,isSubmitting},
  }=useForm<UpdateForm>({
    resolver:yupResolver(schema),
  })

  //get current user
  const getUser =async()=>{
    try{
        const token = localStorage.getItem("token")

        if(!token){
            router.push("/login")
            return
        }
         const response = await api.get("/users/getoneuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const userData = response.data.data

      setUser(userData)

      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      })
         // Existing profile image
      if (userData.image) {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "")

        const imageUrl = `${backendUrl}/${userData.image.replaceAll(
          "\\",
          "/"
        )}`
                setImagePreview(imageUrl)
    }
    }catch(error:any){
        console.log("GET USER ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)

      setServerError(
        error.response?.data?.message || "Failed to load profile"
      )
    }
    finally{
        setLoading(false);
    }
  }
  useEffect(()=>{
    getUser()
  },[])

    // Image selection
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Check image type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setServerError("Only JPG, JPEG, PNG and WEBP images are allowed")
      return
    }

    // Check image size
    if (file.size > 5 * 1024 * 1024) {
      setServerError("Image size must be less than 5MB")
      return
    }

    setServerError("")
    setSelectedImage(file)

    // Preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }
  
  const onSubmit =async(data:UpdateForm)=>{
    try{
           setServerError("")

      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

            const formData = new FormData()

      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("email", data.email)

      if (selectedImage) {
        formData.append("image", selectedImage)
      }
            const response = await api.put(
        "/users/updateuser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("UPDATE RESPONSE:", response.data)

      // Update localStorage user information
      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      )
const updatedUser = {
        ...oldUser,
        ...response.data.data,
      }

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      )

      alert("Profile updated successfully")

      router.push("/user/profile/view")

    }catch(error:any){
              console.log("UPDATE USER ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)

      setServerError(
        error.response?.data?.message ||
          "Failed to update profile"
      )

    }
  }
    if (loading) {
    return (
      <div className="min-h-screen bg-[#E8D5B5] flex items-center justify-center">
        <p className="text-white text-lg">
          Loading profile...
        </p>
      </div>
    )
  }
    return (
    <div className="min-h-screen bg-[#E8D5B5]">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Update Profile
        </h1>
        {/* Back button */}
        <Link
          href="/products"
          className="text-[#6B4F3A] font-semibold hover:text-[#543C2C]"
        >
          ← Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#E8D5B5] shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#E8D5B5] flex items-center justify-center">
                <span className="text-[#6B4F3A] text-4xl font-bold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <label className="mt-4 cursor-pointer bg-[#E8D8C3] text-[#6B4F3A] px-5 py-2 rounded-lg font-semibold hover:bg-[#DCC8AE] transition">
              Change Image

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center mb-5">
              {serverError}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4F3A] mb-2">
                First Name
              </label>

              <input
                type="text"
                {...register("firstName")}
                className="w-full border border-[#D6C1A8] rounded-lg px-4 py-3 outline-none focus:border-[#6B4F3A]"
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4F3A] mb-2">
                Last Name
              </label>

              <input
                type="text"
                {...register("lastName")}
                className="w-full border border-[#D6C1A8] rounded-lg px-4 py-3 outline-none focus:border-[#6B4F3A]"
              />

              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4F3A] mb-2">
                Email
              </label>

              <input
                type="email"
                {...register("email")}
                className="w-full border border-[#D6C1A8] rounded-lg px-4 py-3 outline-none focus:border-[#6B4F3A]"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-3">

              <button
                type="button"
                onClick={() =>
                  router.push("/user/profile/view")
                }
                className="w-1/2 bg-[#E8D8C3] text-[#6B4F3A] py-3 rounded-lg font-semibold hover:bg-[#DCC8AE] transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 bg-[#6B4F3A] text-white py-3 rounded-lg font-semibold hover:bg-[#543C2C] transition disabled:opacity-50"
              >
                {isSubmitting
                  ? "Updating..."
                  : "Update Profile"}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  )


}
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import api from "@/lib/api"
import Link from "next/link"


interface UserType {
  firstName: string
  lastName: string
  email: string
  role: string
  image: string
}

export default function ViewProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  const getUser =async()=>{
    try{
        const token = localStorage.getItem("token");

        if(!token){
            router.push("/login")
            return
        }
        const response = await api.get("/users/getoneuser",{
            headers:{
                Authorization :`Bearer ${token}`,
            },
        })
              console.log("USER RESPONSE:", response.data)
              setUser(response.data.data)
    }
    catch(error:any){
        console.log("USER ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)
    }
    finally{
        setLoading(false)
    }
  }
  useEffect(()=>{
    getUser()
  },[])

    // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8D5B5] flex items-center justify-center">
        <p className="text-white text-lg">
          Loading profile...
        </p>
      </div>
    )
  }

    // User not found
  if (!user) {
    return (
      <div className="min-h-screen bg-[#E8D5B5] flex items-center justify-center">
        <p className="text-white text-lg">
          User not found
        </p>
      </div>
    )
  }

   const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "");

  const imageUrl = user.image
    ? `${backendUrl}/${user.image.replaceAll("\\", "/")}`
    : null;

return (
  <div className="min-h-screen bg-[#E8D5B5]">
    <Header />

    <main className="max-w-2xl mx-auto px-6 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        My Profile
      </h1>

       {/* Back button */}
        <Link
          href="/products"
          className="text-[#6B4F3A] font-semibold hover:text-[#543C2C]"
        >
          ← Back to Products
        </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#E8D5B5] shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#E8D5B5] flex items-center justify-center border-4 border-[#D6C1A8]">
              <span className="text-[#6B4F3A] text-4xl font-bold">
                {user.firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* First Name */}
          <div className="bg-[#F8F1E8] rounded-xl p-4 border border-[#E8D8C3]">
            <p className="text-sm font-semibold text-[#6B4F3A]">
              First Name
            </p>
            <p className="text-base text-gray-700 mt-1">
              {user.firstName}
            </p>
          </div>

          {/* Last Name */}
          <div className="bg-[#F8F1E8] rounded-xl p-4 border border-[#E8D8C3]">
            <p className="text-sm font-semibold text-[#6B4F3A]">
              Last Name
            </p>
            <p className="text-base text-gray-700 mt-1">
              {user.lastName}
            </p>
          </div>

          {/* Email */}
          <div className="bg-[#F8F1E8] rounded-xl p-4 border border-[#E8D8C3] sm:col-span-2">
            <p className="text-sm font-semibold text-[#6B4F3A]">
              Email
            </p>
            <p className="text-base text-gray-700 mt-1 break-all">
              {user.email}
            </p>
          </div>

          {/* Role */}
          <div className="bg-[#F8F1E8] rounded-xl p-4 border border-[#E8D8C3] sm:col-span-2">
            <p className="text-sm font-semibold text-[#6B4F3A]">
              Role
            </p>
            <p className="text-base text-gray-700 mt-1 capitalize">
              {user.role}
            </p>
          </div>

        </div>
<button
  onClick={() => router.push("/user/profile/edit")}
  className="w-full mt-6 bg-[#6B4F3A] text-white py-3 rounded-xl font-semibold hover:bg-[#543C2C] transition duration-200"
>
  Edit Profile
</button>


      </div>
    </main>
  </div>
)

}
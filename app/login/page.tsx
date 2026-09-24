"use client"

import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import api from "@/lib/api"


const loginschema= yup.object({
    email:yup.string().email("Enter a valid email").required("email is required"),
    password:yup.string().required("password is required")
})

type LoginForm=yup.InferType<typeof loginschema>
export default function LoginPage() {

        const router = useRouter()
        const {
            register,
            handleSubmit,
            formState:{errors},
        }=useForm<LoginForm>({
            resolver:yupResolver(loginschema),
        })
    
 const onsubmit = async(data :LoginForm)=>{
    try{
        const response=await api.post("/users/login",data)
        console.log("LOGIN RESPONSE:", response.data)

        const token=response.data.accestoken
        const user = response.data.data

         // Save user information
        localStorage.setItem("user",JSON.stringify(user))
        //save token 
        localStorage.setItem("token",token)

        alert("Login successful")
        router.push("/products")


    }
    catch(error:any){
        console.log("LOGIN ERROR:", error)
        console.log("SERVER RESPONSE:", error.response?.data)
        alert(
        error.response?.data?.message || "Invalid email or password"
        )
    }
 }

 return (
  <div className="min-h-screen bg-[#E8D5B5] from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">

    <div className="w-full max-w-md">

      {/* Logo / App name */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Product App
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and explore your products
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-gray-900 text-center ">
            Welcome Back !
          </h2>

          <p className="text-gray-500 mt-1 text-1g font-bold text-center">
  Login to you account
</p>
        </div>

        <form
          onSubmit={handleSubmit(onsubmit)}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#6B4F3A]   text-white py-3 rounded-xl font-semibold hover:bg-[#6B4F3A]   active:scale-[0.98] transition duration-200 shadow-md"
          >
            Login
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-7 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}

            <a
              href="/registration"
              className="text-[#6B4F3A]   font-semibold hover:text-[#6B4F3A]   hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>

      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 Product App
      </p>




    </div>
    </div>

 )
 }









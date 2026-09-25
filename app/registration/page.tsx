"use client"

import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import api from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required"),

  lastName: yup
    .string()
    .required("Last name is required"),

  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  role: yup
    .string()
    .required("Role is required"),

  image: yup
  .mixed<FileList>()
  .test(
    "required",
    "Image is required",
    (value) => {
      if (!value) return false;

      return value.length > 0;
    }
  ),
})

type RegistrationForm = yup.InferType<typeof schema>
export default function RegistrationPage() {
  const router = useRouter();

  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegistrationForm>({
  resolver: yupResolver(schema),
})

  const onSubmit = async (data: RegistrationForm) => {
    try {
      const formData = new FormData()

      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("role", data.role)
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0])
      }
            const response = await api.post("/users/register", formData)

      console.log("RESPONSE:", response.data)

      alert("Registration successful")
      if(response.data){
        router.push("/login")
      }

    } catch (error: any) {

      console.log("REGISTRATION ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)
      console.log("STATUS:", error.response?.status)

      alert(
        error.response?.data?.message || "Registration failed"
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#E8D5B5] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Register to continue
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        
        >

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>

            <input
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               />

            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>

            <input
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black "
            />

            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>

            <select
              {...register("role")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Role</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>

            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700"
            />

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#6B4F3A]  0 text-white py-3 rounded-lg font-semibold hover:bg-[#6B4F3A]    transition duration-200"
          >
            Register
          </button>
          

        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an Account?{""}
          <Link  href="/login" className="text-[#6B4F3A] font-semibold hover:text-[#543C2C]">
          Login
          </Link>
        </p>
      </div>
    </div>
  )
}
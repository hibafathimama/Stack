"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//validation schema
const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .matches(
      /^[A-Za-z ]+$/,
      "Title should contain only letters and spaces"
    ),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),

  cateogary: yup
    .string()
    .required("Category is required")
    .matches(
      /^[A-Za-z ]+$/,
      "Category should contain only letters and spaces"
    ),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),

  image: yup
    .mixed<FileList>()
    .test(
      "fileType",
      "Only JPG, JPEG and PNG images are allowed",
      (value) => {
        if (!value || value.length === 0) {
          return true;
        }

        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
        ].includes(value[0].type);
      }
    )
    .optional(),
});

type FormData =yup.InferType<typeof schema>

export default function Editproductpage(){

    //get product id from URL
    const params =useParams();
    const id = params.id as string;

    //used for navigation 
    const router =useRouter();

    //loading state 
    const[loading,setLoading]=useState(true)

    //react hookform

    const{
        register,
        handleSubmit,
        setValue,
        formState:{errors},
    }=useForm<FormData>({
        resolver:yupResolver(schema)
    });

  useEffect(() => {
  const getProduct = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log("PRODUCT RESPONSE:", result);

      if (!response.ok) {
        alert(result.message || "Product not found");
        return;
      }

      const product = result.data;

      // Put existing values into form
      setValue("title", product.title);
      setValue("price", product.price);
      setValue("cateogary", product.cateogary);
      setValue("description", product.description);

    } catch (error) {
      console.log("GET PRODUCT ERROR:", error);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    getProduct();
  }

}, [id, setValue]);

  // update product
const onSubmit = async (data: FormData) => {
  try {
    const token = localStorage.getItem("token");

    // Create FormData
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("price", String(data.price));
    formData.append("cateogary", data.cateogary);
    formData.append("description", data.description);

    // Add image only if a new image is selected
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    // Send update request
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    console.log("UPDATE RESPONSE:", result);

    if (!response.ok) {
      alert(result.message || "Update failed");
      return;
    }

    alert("Product updated successfully");

    // Go back to products page
    router.push("/products");

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    alert("Something went wrong");
  }
};
     // -------------------------
  // 6. Loading screen
  // -------------------------

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <p className="text-lg">
          Loading product...
        </p>

      </div>
    );
  }


  // -------------------------
  // 7. Form UI
  // -------------------------

  return (

    <div className="min-h-screen bg-[#F5EDE3] py-10">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-[#6B4F3A] mb-6">
          Edit Product
        </h1>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >


          {/* ---------------- TITLE ---------------- */}

          <div>

            <label className="block mb-1 font-medium">
              Title
            </label>

            <input
              type="text"
              {...register("title")}
              placeholder="Enter product title"
              className="w-full border rounded-lg p-3"
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}

          </div>


          {/* ---------------- PRICE ---------------- */}

          <div>

            <label className="block mb-1 font-medium">
              Price
            </label>

            <input
              type="number"
              {...register("price")}
              placeholder="Enter product price"
              className="w-full border rounded-lg p-3"
            />

            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}

          </div>


          {/* ---------------- CATEGORY ---------------- */}

          <div>

            <label className="block mb-1 font-medium">
              Category
            </label>

            <input
              type="text"
              {...register("cateogary")}
              placeholder="Enter category"
              className="w-full border rounded-lg p-3"
            />

            {errors.cateogary && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cateogary.message}
              </p>
            )}

          </div>


          {/* ---------------- DESCRIPTION ---------------- */}

          <div>

            <label className="block mb-1 font-medium">
              Description
            </label>

            <textarea
              {...register("description")}
              placeholder="Enter product description"
              rows={5}
              className="w-full border rounded-lg p-3"
            />

            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}

            
          </div>

          {/* ---------------- IMAGE ---------------- */}

            <div>
            <label className="block mb-1 font-medium">
                Product Image
            </label>

            <input
                type="file"
                accept=".jpg,.jpeg,.png"
                {...register("image")}
                className="w-full border rounded-lg p-3"
            />

            {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
                </p>
            )}
            </div>


          {/* ---------------- BUTTONS ---------------- */}

          <div className="flex gap-3 pt-3">

            <button
              type="submit"
              className="bg-[#6B4F3A] text-white px-6 py-3 rounded-lg hover:bg-[#543C2C]"
            >
              Update Product
            </button>


            <button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
     
    

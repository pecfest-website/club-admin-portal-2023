import Layout from "@/components/Layout";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

interface LoginType {
    email: string;
    password: string;
}
const LoginPage = () => {
    const methods = useForm<LoginType>({ mode: "onBlur" });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const router = useRouter();

    const onSubmit = async (data: LoginType) => {
        try {
            signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: true,
                callbackUrl: '/dashboard'
            });
        } catch (error: any) {
            console.log(error.message);
        }
    };
    return (
        <Layout>
            <div className="w-full h-full bg-[url('/bg1.png')] bg-cover bg-center pt-40">
                <div className="container mx-auto w-96 border-gray-400 glassmorphism py-10 rounded-lg">
                    <Head>
                        <title>Admin Login | PECFEST&apos;23</title>
                    </Head>
                    <h2 className="px-12 text-center text-2xl font-semibold text-white">
                        Log In
                    </h2>
                    <FormProvider {...methods}>
                        <form
                            action=""
                            className="w-80 mx-auto pb-12 px-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor=""
                                        className="block mb-3 font-sans text-white"
                                    >
                                        Email
                                    </label>
                                </div>

                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                    className={`border border-solid rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                                />
                                {errors.email && (
                                    <p className="text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor=""
                                        className="block mb-3 font-sans text-white"
                                    >
                                        Password
                                    </label>
                                </div>

                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    className={`border border-solid rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                                />
                                {errors.password && (
                                    <p className="text-red-400">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-center pt-8">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </Layout>
    );
};

export default LoginPage;

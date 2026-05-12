import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-4xl font-poppins font-extrabold text-gray-800">
                        <span className="text-black">Sobremesa</span>
                        <span className="text-red-500">.</span>
                    </h1>
                </div>

                {/* Komponen Outlet ini sangat penting untuk merender child route */}
                <Outlet/>

                <p className="text-center text-sm text-gray-500 mt-6">
                    © 2026 Project Kelompok9 Dashboard.
                </p>
            </div>
        </div>
    )
}
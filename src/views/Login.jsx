import React, { useContext, useRef } from "react";
import { ThemeContext } from "../ThemeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { theme, setTheme } = useContext(ThemeContext);
    const inputUsername = useRef(null);
    const inputPassword = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const username = inputUsername.current.value;
        const password = inputPassword.current.value;

        // Validasi input
        if (!username || !password) {
            console.error("Username dan password wajib diisi!");
            alert("Username dan password wajib diisi!");
            return;
        }

        try {
            // Kirim permintaan ke API
            const response = await axios.post(
                "https://aksamedia-test-production.up.railway.app/api/login",
                {
                    username: username,
                    password: password,
                }
            );

            // Tangani respons dari API
            if (response.status === 200 && response.data.status === "success") {
                console.log("Login berhasil:", response.data);
                // Simpan token atau data pengguna jika ada
                localStorage.setItem("authToken", response.data.data.token);
                console.log(
                    "Token disimpan:", localStorage.getItem("authToken")
                );
                // Navigasi ke halaman lain jika diperlukan
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert(
                    "Login gagal: " +
                        (error.response.data.message ||
                            "Username atau password salah.")
                );
            } else {
                // Kesalahan lain (misalnya server down)
                alert("Terjadi kesalahan. Silakan coba lagi.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            ref={inputUsername}
                            type="username"
                            className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            ref={inputPassword}
                            type="password"
                            className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

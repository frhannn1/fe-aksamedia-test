import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
    const { theme, setTheme } = useContext(ThemeContext);
    const [user, setUser] = useState(null); // Menyimpan data pengguna
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");

    // Fetch data pengguna
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            axios
                .get("https://aksamedia-test-production.up.railway.app/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pastikan token disertakan dengan benar
                    },
                })
                .then((response) => {
                    if (response.data && response.data.user) {
                        setUser(response.data.user); // Asumsi data pengguna berada di response.data.user
                    } else {
                        console.error("No user data in the response.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setUser(null); // Mengatur user ke null jika terjadi error
                });
        }
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        const token = localStorage.getItem("authToken");
        if (token) {
            axios
                .post(
                    "https://aksamedia-test-production.up.railway.app/api/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {

                    localStorage.removeItem("authToken");
                    navigate("/"); // Navigasi ke halaman login atau home
                })
                .catch((error) => {
                    console.error("Error during logout:", error);
                });
        }
    };

    const handleEdit = ()=>{
        setIsEditing(true);
        setNewName(user.name);
    }

    const handleSave = () => {
        const token = localStorage.getItem("authToken");
        if (token && user?.id) { // Pastikan token dan ID pengguna tersedia
            axios
                .put(
                    `https://aksamedia-test-production.up.railway.app/api/user/${user.id}`, // Sertakan ID pengguna di URL
                    { name: newName }, // Data baru yang dikirim ke API
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {

                        setUser({ ...user, name: newName });
                        setIsEditing(false);


                })
                .catch((error) => {
                    console.error("Error updating user data:", error);
                });
        } else {
            console.error("User ID or auth token is missing.");
        }
    };


    return (
        <nav className="p-4 bg-gray-700 dark:bg-gray-50 text-gray-100 dark:text-gray-800 flex justify-between items-center">
            {/* Theme Switcher */}
            <div className="space-x-4">
                <button
                    className={`px-4 py-2 rounded ${
                        theme === "light"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-white"
                    }`}
                    onClick={() => setTheme("light")}
                >
                    Light
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        theme === "dark"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-white"
                    }`}
                    onClick={() => setTheme("dark")}
                >
                    Dark
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        theme === "system"
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 text-white"
                    }`}
                    onClick={() => setTheme("system")}
                >
                    System
                </button>
            </div>

            {/* User Dropdown */}
            <div className="relative">
                {user ? (
                    <>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded focus:outline-none"
                        >
                            <span>{user.name}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded shadow-lg z-10">
                                <button
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={handleEdit}
                                >
                                    edit
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <span className="text-gray-50 dark:text-gray-800">
                        Not logged in
                    </span>
                )}
            </div>


            {isEditing && (
                <div className="absolute top-16 right-0 w-64 p-4 bg-white dark:bg-gray-800 rounded shadow-lg z-20">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edit Name</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mt-2 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

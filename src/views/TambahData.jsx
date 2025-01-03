import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TambahData() {
    const [formData, setFormData] = useState({
        image: "",
        name: "",
        phone: "",
        division_id: "",
        position: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files[0] });
    };

    // Submit data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        if(token){
            try {
                const response = await axios.post("https://aksamedia-test-production.up.railway.app/api/employees", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Response:", response.data);
                alert("Data berhasil ditambahkan!");
                navigate("/dashboard"); // Arahkan ke halaman utama atau daftar
            } catch (err) {
                console.error("Error:", err);
                setError(err.response?.data?.message || "Terjadi kesalahan!");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Tambah Data Karyawan
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Nama
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Nomor Telepon
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="division_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Divisi
                    </label>
                    <select
                        id="division_id"
                        name="division_id"
                        value={formData.division_id}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-200 rounded-lg"
                    >
                        <option value="">Pilih Divisi</option>
                        <option value="1">Mobile Apps</option>
                        <option value="2">QA</option>
                        <option value="3">Full Stack</option>
                        <option value="4">Backend</option>
                        <option value="5">Frontend</option>
                        <option value="6">UI/UX Designer</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Posisi
                    </label>
                    <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Gambar
                    </label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="w-full mt-1 p-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 px-4 text-white rounded-lg bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    Tambah Data
                </button>
            </form>
        </div>
    );
}

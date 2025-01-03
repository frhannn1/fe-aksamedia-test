import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditData() {
    const { id } = useParams(); // Ambil id dari parameter URL
    const [employee, setEmployee] = useState(null); // State untuk data pegawai
    const [loading, setLoading] = useState(true); // State untuk loading
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            axios
                .get(`https://aksamedia-test-production.up.railway.app/api/employees`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setEmployee(response.data.data.employees); // Simpan data pegawai
                    setLoading(false); // Nonaktifkan loading
                })
                .catch((error) => {
                    console.error("Error fetching employee data:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    const EditDataPegawai = ({ employeeId, divisions, onUpdate }) => {
        const [employee, setEmployee] = useState({
            name: "",
            phone: "",
            position: "",
            division_id: "",
            image: null,
        });
    }

    const handleUpdate = () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            axios
                .put(
                    `https://aksamedia-test-production.up.railway.app/api/employees/${id}`,
                    employee,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {
                    alert("Data berhasil diperbarui");
                    navigate("/dashboard"); // Kembali ke dashboard
                })
                .catch((error) => {
                    console.error("Error updating employee data:", error);
                });
        }
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files[0] });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 dark:text-white">Edit Data Pegawai</h1>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
            }}
            className="space-y-6"
        >
            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">Name:</label>
                <input
                    type="text"
                    value={employee.name || ""}
                    onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">Phone:</label>
                <input
                    type="text"
                    value={employee.phone || ""}
                    onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">Position:</label>
                <input
                    type="text"
                    value={employee.position || ""}
                    onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="division_id" className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Divisi
                </label>
                <select
                    id="division_id"
                    name="division_id"
                    value={employee.division_id}
                    onChange={(e) => setEmployee({ ...employee, division_id: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

            <div className="mb-4">
                <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Foto
                </label>
                <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    className=" py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
                >
                    Update
                </button>
            </div>
        </form>
    </div>


    );
}

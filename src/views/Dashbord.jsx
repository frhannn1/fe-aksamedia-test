import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [employees, setEmployees] = useState([]); // Data karyawan
    const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
    const [divisions, setDivisions] = useState([]); // Menyimpan data divisi
    const [selectedDivision, setSelectedDivision] = useState(""); // Divisi yang dipilih
    const [searchTerm, setSearchTerm] = useState(""); // Kata pencarian

    const rowsPerPage = 5; // Jumlah baris per halaman
    const navigate = useNavigate();

    // Fetch employees data
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            axios
                .get(
                    `https://aksamedia-test-production.up.railway.app/api/employees`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    if (response.data.data.employees) {
                        setEmployees(response.data.data.employees);
                    } else {
                        console.error("No employees data in the response.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching employees data:", error);
                });

            // Fetch divisi
            axios
                .get("https://aksamedia-test-production.up.railway.app/api/divisions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (
                        response.data.data &&
                        Array.isArray(response.data.data.divisions)
                    ) {
                        setDivisions(response.data.data.divisions);
                    } else {
                        console.error(
                            "Data divisions tidak valid:",
                            response.data
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error fetching divisions data:", error);
                });
        }
    }, [currentPage]); // Refetch data saat currentPage berubah



    // Filter employees based on search term and selected division
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearchTerm =
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm);
        const matchesDivision = selectedDivision
            ? employee.division.id === selectedDivision
            : true;
        return matchesSearchTerm && matchesDivision;
    });

    // Paginate filtered employees
    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // delete data
    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (isConfirmed) {
          const token = localStorage.getItem("authToken");
          if (token) {
            axios
              .delete(`https://aksamedia-test-production.up.railway.app/api/employees/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(() => {
                setEmployees(employees.filter(employee => employee.id !== id));
                alert("Data berhasil dihapus");
              })
              .catch((error) => {
                console.error("Error deleting employee data:", error);
                alert("Gagal menghapus data");
              });
          }
        }
      };



    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-2">
            <h1 className="text-3xl text-center p-5">Data Pegawai</h1>
            <div className="m-5">
                <div className="flex flex-col md:flex-row items-center md:justify-between mb-5 space-y-2 md:space-y-0">
                    <form
                        className="flex flex-col md:flex-row items-center w-full md:space-x-2 space-y-2 md:space-y-0"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={selectedDivision}
                            onChange={(e) =>
                                setSelectedDivision(e.target.value)
                            }
                            className="w-full md:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Divisi</option>
                            {divisions.map((division) => (
                                <option key={division.id} value={division.id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                    </form>
                    <button
                        className="w-full md:w-auto bg-green-500 text-white py-2 px-2 rounded-lg hover:bg-green-600 whitespace-nowrap"
                        onClick={() => navigate("/tambahdata")}
                    >
                        Tambah Data
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden mt-2 dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 text-center">
                                <th className="py-2 px-2 sm:py-3 sm:px-4">
                                    Name
                                </th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4">
                                    Phone
                                </th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4">
                                    Position
                                </th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4">
                                    Division
                                </th>
                                <th className="py-2 px-2 sm:py-3 sm:px-4">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600"
                                >
                                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                                        {employee.name}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                                        {employee.phone}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                                        {employee.position}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                                        {employee.division.name}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                                            <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 w-full sm:w-auto"
                                                    onClick={()=>navigate(`/editdata/${employee.id}`)}
                                            >
                                                Update
                                            </button>
                                            <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 w-full sm:w-auto"
                                                    onClick={() => handleDelete(employee.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-5 space-x-2">
                    {pageNumbers.map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={`py-1 px-3 rounded ${
                                currentPage === pageNumber
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            }`}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            </div>
        </div>

    );
}

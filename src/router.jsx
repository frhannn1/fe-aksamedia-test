import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Dashbord from "./views/Dashbord";
import Navbar from "./views/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import TambahData from "./views/TambahData";
import EditData from "./views/EditData";
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Navbar></Navbar>
                <Login></Login>
            </>
        ),
    },
    {
        path: "/dashboard",

        element: (
            <>
                <ProtectedRoute>
                    <Navbar></Navbar>
                    <Dashbord></Dashbord>
                </ProtectedRoute>
            </>
        ),
    },
    {
        path: "/tambahdata",
        element: (
            <>
                 <ProtectedRoute>
                    <Navbar></Navbar>
                    <TambahData></TambahData>
                </ProtectedRoute>
            </>
        )

    },
    {
        path: "/editdata/:id",
        element: (
            <>
                 <ProtectedRoute>
                    <Navbar></Navbar>
                    <EditData></EditData>
                </ProtectedRoute>
            </>
        )
    }
]);

export default router;

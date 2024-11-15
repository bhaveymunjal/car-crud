import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import ProtectedRoutes from "./Utils/ProtectedRoutes";
import GuestRoutes from "./Utils/GuestRoutes";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import NotFoundPage from "./Pages/NotFoundPage";
import AddCar from "./Pages/Upload";
import CarDetail from "./Pages/CarDetails";

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="mt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/add-car" element={<AddCar />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route element={<ProtectedRoutes />}>
          </Route>
          <Route path="/login" element={<GuestRoutes element={<Login />} />} />
          <Route path="/signup" element={<GuestRoutes element={<SignUp />} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

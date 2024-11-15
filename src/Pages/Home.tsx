/* eslint-disable no-unused-vars */
import { UserContext } from "@/Utils/UserProvider";
import { Button } from "@/Components/ui/button";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GuestHome from "@/Components/Home/GuestHome";
import { User } from "@/Types/user";
import NoCars from "@/Components/Home/NoCars";
import { Car } from "@/Types/car";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  document.title = "Home";
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>({} as User);
  const [cars, setCars] = useState<Car[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userContext = useContext(UserContext);
  const token = userContext?.token;

  const getUserInfo = () => {
    axios
      .get(`${backendUrl}/profile`, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
      });
  };

  const getUserCars = () => {
    axios
      .get(`${backendUrl}/cars`, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then((response) => {
        setCars(response.data);
      });
  };

  const handleDeleteClick = (id: number) => {
    setLoading(true);
    axios
      .delete(`${backendUrl}/car/${id}`, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then(() => {
        getUserCars();
      }).catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete car",
        });
      }).finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (token) {
      getUserInfo();
      getUserCars();
    }
  }, [token]);
  
  if (!token) {
    return <GuestHome />;
  }
  return (
    <div className=" mx-auto p-4">
      <h1 className="text-5xl font-bold mb-4">Welcome, {userInfo.name}!</h1>
      <Button variant="outline" onClick={() => navigate('/add-car')}>Add New Car &#x2192;</Button>
      {cars.length === 0 ? (
          <NoCars />
        ) : (
          <ul className="space-y-4 my-4">
            {cars.map((car) => (
              <li
                key={car.id}
                className="flex items-center justify-between p-4 bg-white shadow-sm rounded-md border border-gray-200"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {car.description}
                  </h3>
                  <p className="text-sm text-gray-600">{car.title}</p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={()=>navigate(`/car/${car.id}`)} variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button disabled={loading} onClick={()=>handleDeleteClick(car.id)} variant="destructive" size="sm">
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                </div>

              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

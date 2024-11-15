/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Car {
  id: number;
  title: string;
  description: string;
  images: string[];
  tags: { [key: string]: string };
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}`);
        setCar(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch car details.");
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-6">Loading car details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-6">{error}</div>;
  }

  if (!car) {
    return <div className="text-center mt-6">Car not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-4">{car.title}</h1>

      {/* Description */}
      <p className="text-gray-700 mb-6">{car.description}</p>

      {/* Images */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {car.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Car Image ${index + 1}`}
              className="rounded-lg shadow-md object-cover w-full h-40"
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tags</h2>
        {Object.keys(car.tags).length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(car.tags).map(([key, value], index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
              >
                <p className="font-medium text-gray-800">{key}</p>
                <p className="text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tags available.</p>
        )}
      </div>

      {/* Metadata */}
      <div className="text-gray-500 text-sm mt-8">
        <p>
          <span className="font-medium">Created By:</span> User {car.userId}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {new Date(car.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Last Updated:</span>{" "}
          {new Date(car.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

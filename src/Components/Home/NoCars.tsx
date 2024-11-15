import { Button } from "@/Components/ui/button";
import NoCarImage from "@/assets/no-cars.svg"
import { useNavigate } from "react-router-dom";

export default function NoCars() {
    const navigate = useNavigate();
  return (
    <div className="flex mx-auto flex-col max-w-3xl items-center justify-center text-center p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
      <img
        src={NoCarImage}
        alt="No Cars"
        className="w-40 h-40 mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No Cars Found</h2>
      <p className="text-gray-600 mb-4">
        It looks like you haven’t added any cars yet. Start managing your cars by adding a new one now!
      </p>
      <Button variant="default" onClick={()=> navigate('/add-car')} className="px-6 py-2 text-sm">
        Add Your First Car
      </Button>
    </div>
  );
}

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { useNavigate } from "react-router-dom";

export default function GuestHome() {
  const navigate = useNavigate();
  return (
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
        <CardDescription>
          Please login to access and manage your cars.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </CardContent>
    </Card>
  );
}

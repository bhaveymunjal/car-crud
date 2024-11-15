import { useContext, useState } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/Utils/UserProvider";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { toast } = useToast()
  document.title = "Login";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { updateToken } = userContext;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/login`, formData);

      if (response.status === 200 || response.status === 201) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Login successful",
        });
        setFormData({
          username: "",
          password: "",
        });
        updateToken(response.data.token);
        console.log("Token:: ", response.data.token);
        Cookies.set("token", response.data.token);
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: response?.data?.message,
        });
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        toast({
          variant: "destructive",
          title: error.response.data.message,
          description: "Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "An unexpected error occurred.",
          description: "Something went wrong.",
        });
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <Card className="max-w-sm w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your username and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="abc123"
                autoComplete="username"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="********"
                required
              />
            </div>

            <Button className="w-full" type="submit">
              Login
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm text-nowrap">
          Don&apos;t have an account?
          <Link to="/signup" className="underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

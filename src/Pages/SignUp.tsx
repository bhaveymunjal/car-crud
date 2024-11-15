/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
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
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "@/Utils/UserProvider";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  document.title = "MyGarage | SignUp";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();
  const userContext = useContext(UserContext);
  const updateToken = userContext?.updateToken ?? (() => {});
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (formData.password.length < 7) return;
  
    if (formData.contactNumber.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid contact number",
        description: "Contact number must be 10 digits long.",
      });
      return;
    }
  
    try {
      const response = await axios.post(`${backendUrl}/signup`, formData);
      
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        contactNumber: "",
      });
  
      toast({
        variant: "default",
        title: "Success!",
        description: "Account created successfully. Manage your cars now.",
      });
  
      updateToken(response.data.user.token);
      Cookies.set("token", response.data.user.token);
  
    } catch (error: any) {
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
  

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <Card className="max-w-sm w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account and manage your tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                autoComplete="name"
                onChange={handleInputChange}
                placeholder="Max"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                autoComplete="username"
                onChange={handleInputChange}
                placeholder="max123"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                autoComplete="email"
                onChange={handleInputChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {formData.password && formData.password.length < 7 && (
                <p className="text-red-500 text-sm">
                  Password must be at least 7 characters long.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                autoComplete="tel"
                onChange={handleInputChange}
                placeholder="1234567890"
                required
              />
              {formData.contactNumber &&
                formData.contactNumber.length !== 10 && (
                  <p className="text-red-500 text-sm">
                    Contact number must be 10 digits long.
                  </p>
                )}
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm text-nowrap">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

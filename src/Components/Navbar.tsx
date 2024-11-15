import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext } from "react";
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie";
import { UserContext } from "@/Utils/UserProvider";

const Navbar: React.FC = () => {
    const { toast } = useToast()
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const token = userContext?.token ?? "";
    const updateToken = userContext?.updateToken ?? (() => {});

    const handleLogin = () => {
        navigate('login');
    }

    const handleSignUp = () => {
        navigate('signup');
    }

    const handleLogout = async () => {
        updateToken("");
        Cookies.remove("token");
        toast({
            variant: "default",
            title: "Success!",
            description: "You have been logged out successfully",
        });
        navigate("/");
    }

    return (
        <div className="bg-slate-100 p-3 shadow-md flex justify-between items-center h-[80px] fixed w-full top-0 z-10">
            <div>
                <Link to="/" className="text-xl font-bold">MyGarage</Link>
            </div>
            <div className="flex gap-2">
                <Button onClick={token === "" ? handleLogin : handleLogout}>
                    {token === "" ? "Login" : "Logout"}
                </Button>
                {token === "" && (
                    <Button onClick={handleSignUp}>Sign Up</Button>
                )}
            </div>
        </div>
    );
}

export default Navbar;

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="mx-auto flex px-4 sm:px-6 pt-28 lg:px-2 items-center justify-center">
        <div className="text-7xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Nebula Nest
        </div>
      </div>
      <div className="mx-auto flex px-4 sm:px-6 sm:py-10 lg:px-2 items-center justify-center">
        <div className="text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          An easier way to deploy frontend of your Application
        </div>
      </div>
    <div className="flex items-center justify-center">
      <Button
        className="hover:bg-indigo-900"
        onClick={() => {
          navigate("/deploy");
        }}
      >
        Get Started
      </Button>
    </div>
    </div>
  );
}

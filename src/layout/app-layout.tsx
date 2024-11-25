import { Outlet } from "react-router";
import Header from "../components/header";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="container min-h-screen  mx-auto ">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 mt-10 bg-gray-800 text-center">Made by me </div>
    </div>
  );
};

export default AppLayout;

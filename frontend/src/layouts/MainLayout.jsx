import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-body text-text-main font-body">
      <Navbar />
      <main className="flex-grow pt-24 px-4 md:px-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

import Navbar from "@/components/navbar";
import HomePage from "@/components/home";
import AboutUs from "@/components/about";
import Menu from "@/components/menu";
import User from "@/components/register";
export default function Home() {
  return (
    <div>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Sections */}
      <div id="home">
        <HomePage />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="menu">
        <Menu />
      </div>
      <div id="registration">
        <User />
      </div>
    </div>
  );
}
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import authImg from "../assets/images/site/auth.jpg";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-1 flex mt-24 mb-10 w-11/12 mx-auto items-center justify-center">
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center ">
          {children}
        </div>

        {/* Right: Image */}
        <div className="hidden lg:block lg:w-1/2 ">
          <img
            src={authImg}
            alt="Auth"
            className="w-full h-[500px]  object-cover rounded-[40px]"
          />
          
        </div>
      </div>

      <Footer />
    </div>
  );
}

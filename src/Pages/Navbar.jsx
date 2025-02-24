import { FaSignOutAlt } from "react-icons/fa";
import useAuth from "../Context/useAuth";

const Navbar = () => {
  const { user, singOutUser } = useAuth();

  return (
    <nav className=" fixed top-0 right-0 left-0 max-w-[1280px] mx-auto shadow-sm z-50">
      <div className=" px-4 sm:px-6 lg:px-10 h-16">
        <div className="flex justify-between items-center h-full">
          {/* Title */}
          <h1 className="text-xl font-bold text-gray-800">Task Guru</h1>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                alt="PPic"
                src={user?.photoURL}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={singOutUser}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt className="text-xl cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { FaGoogle } from "react-icons/fa";

import useAuth from "../Context/useAuth";
import { useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const { singInWIthGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    console.log("google login");

    try {
      const { user } = await singInWIthGoogle();

      const name = user?.displayName;
      const email = user?.email;

      const userInfo = {
        name,
        email,
      };

      console.log(userInfo);

      // axios.post("/users", userInfo);

      navigate("/");
    } catch (error) {
      console.log("Social login ERROR", error);
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={handleGoogleLogin}
          className="btn w-60 flex mx-auto gap-2 items-center cursor-pointer"
        >
          <FaGoogle className="text-3xl"></FaGoogle>
          <span className="text-xl">Sign In With Google</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;

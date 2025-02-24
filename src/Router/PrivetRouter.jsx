import { Navigate } from "react-router";
import useAuth from "../Context/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log(user);

  if (loading) {
    return <progress className="progress w-56"></progress>;
  }

  if (user) {
    return children;
  }
  return <Navigate to="/welcome"></Navigate>;
};

export default PrivateRoute;

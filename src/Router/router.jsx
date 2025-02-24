import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "../Pages/WelcomePage";
import Home from "../Layout/Home";
import PrivateRoute from "./PrivetRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home></Home>
      </PrivateRoute>
    ),
  },
  {
    path: "welcome",
    element: <WelcomePage></WelcomePage>,
  },
]);

export default router;

import { Outlet } from "react-router-dom";
import TaskBoard from "../TaskGuru/TaskBoard";
import Navbar from "../Pages/Navbar";

const Home = () => {
  return (
    <div>
      <TaskBoard></TaskBoard>
      <Outlet></Outlet>
    </div>
  );
};

export default Home;

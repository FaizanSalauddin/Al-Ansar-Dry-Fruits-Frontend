import { Outlet } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";


function MainLayout() {
  const { loading } = useLoader();

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;

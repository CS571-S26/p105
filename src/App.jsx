import { RouterProvider } from "react-aria-components";
import { useNavigate, useHref } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import AppRouter from "./router";

function App() {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Navbar />
      <div className="pt-24">
        <AppRouter />
      </div>
    </RouterProvider>
  );
}

export default App;

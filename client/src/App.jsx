import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import DecryptPage from "./components/DecryptPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />,
  },
  {
    path: "/sharing",
    element: <DirectoryView />,
  },
   {path:"/decrypt/:fileId",
     element:<DecryptPage />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

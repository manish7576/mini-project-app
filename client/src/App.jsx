import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import DecryptPage from "./components/DecryptPage";
 const url = "/api"; 
const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView BASE_URL={url} />,
  },
  {
    path: "/register",
    element: <Register  BASE_URL={url} />,
  },
  {
    path: "/login",
    element: <Login  BASE_URL={url}/>,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView  BASE_URL={url}/>,
  },
  {
    path: "/sharing",
    element: <DirectoryView  BASE_URL={url}/>,
  },
   {path:"/decrypt/:fileId",
     element:<DecryptPage BASE_URL={url}/>}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

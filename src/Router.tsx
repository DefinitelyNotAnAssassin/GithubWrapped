import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GitHubWrapped from "./components/GithubWrapped";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
      
    },
    { 
        path: "/wrapped/:username",
        element: <GitHubWrapped />,
    },

])

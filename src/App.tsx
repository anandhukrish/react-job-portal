import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/app-layout";
import JobPage from "./pages/job";
import Landing from "./pages/landing";
import PostJob from "./pages/post-job";
import JobListing from "./pages/job-listing";
import SavedJob from "./pages/saved-job";
import { ThemeProvider } from "./context/theme-provider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/jobs",
        element: <JobListing />,
      },
      {
        path: "/job/:id",
        element: <JobPage />,
      },
      {
        path: "/post-job",
        element: <PostJob />,
      },
      {
        path: "/my-jobs",
        element: <SavedJob />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme" defaultTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

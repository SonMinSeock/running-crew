import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import LoginLayout from "./components/LoginLayout";
import Login from "./pages/Login";
import PostDetail from "./pages/PostDetail";
import PostCreate from "./pages/PostCreate";
import PostUpdate from "./pages/PostUpdate";
import Profile from "./pages/Profile";
import ProfileUpdate from "./pages/ProfileUpdate";
import ProfileUpdateLayout from "./components/ProfileUpdateLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "post/:id",
        children: [
          {
            index: true,
            element: <PostDetail />,
          },
          {
            path: "update",
            element: (
              <ProtectedRoute>
                <PostUpdate />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "post/create",
        element: (
          <ProtectedRoute>
            <PostCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/profile/update",
    element: <ProfileUpdateLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <ProfileUpdate />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true, // v7 동작 방식을 미리 활성화
  },
});

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    #root {
      height: 100%;
    }
  }


`;

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

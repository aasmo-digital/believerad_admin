import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection

// Redux
import { useSelector } from "react-redux";

// Constants
import { layoutTypes } from "../constants/layout";

// Layouts
import NonAuthLayout from "../Layout/NonAuthLayout";
import VerticalLayout from "../Layout/VerticalLayout/index";
import HorizontalLayout from "../Layout/HorizontalLayout/index";
import { AuthProtected } from "../AuthProtected";

import { authProtectedRoutes, publicRoutes } from "./routes";

const getLayout = (layoutType) => {
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      return VerticalLayout;
    case layoutTypes.HORIZONTAL:
      return HorizontalLayout;
    default:
      return VerticalLayout;
  }
};

const Index = () => {
  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));

  const Layout = getLayout(layoutType);

  return (
    <Routes>
      {/* Redirect from root path "/" to "/home" */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <NonAuthLayout>
              {route.component}
            </NonAuthLayout>
          }
        />
      ))}

      {/* Auth Protected Routes */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <AuthProtected>
              <Layout>{route.component}</Layout>
            </AuthProtected>
          }
        />
      ))}
    </Routes>
  );
};

export default Index;

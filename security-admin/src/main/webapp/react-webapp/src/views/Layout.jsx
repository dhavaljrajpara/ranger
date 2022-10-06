import React, { lazy } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { hasAccessToPath } from "Utils/XAUtils";

const HeaderComp = lazy(() => import("Views/Header"));

const Layout = () => {
  let location = useLocation();
  return (
    <>
      <HeaderComp />
      {location.pathname === "/" && (
        <Navigate to="/policymanager/resource" replace={true} />
      )}
      <section className="container-fluid">
        <div id="ranger-content">
          {hasAccessToPath(location.pathname) ? <Outlet /> : <ErrorPage />}
        </div>
        <footer>
          <div className="main-footer">
            <div className="pull-left copy-right-text">
              <p className="text-left">
                <a
                  target="_blank"
                  href="http://www.apache.org/licenses/LICENSE-2.0"
                  rel="noopener noreferrer"
                >
                  Licensed under the Apache License, Version 2.0
                </a>
              </p>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default Layout;

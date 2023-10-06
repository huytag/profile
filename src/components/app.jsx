import React from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import BottomNavigationPage from "../components/bottom-navigation";
import Notice from "./snackbar/index";
import LoadingComponent from "./loading";
import NotFoundPage from "../pages/NotFound";
import MiddlewareComponent from "./middleware";
import routes from "../router/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

const MyApp = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App>
          <SnackbarProvider>
            <Notice />
            <LoadingComponent />
            <ZMPRouter>
              <AnimationRoutes>
                {routes.map(({ path, component, permissions }) => (
                  <Route
                    path={path}
                    key={path}
                    element={
                      <MiddlewareComponent
                        permissions={permissions}
                        component={component}
                      />
                    }
                  />
                ))}

                <Route path="/*" element={<NotFoundPage />} />
              </AnimationRoutes>
              <BottomNavigationPage />
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </QueryClientProvider>
    </RecoilRoot>
  );
};
export default MyApp;

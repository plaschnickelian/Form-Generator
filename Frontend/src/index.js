import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginScreen from './screens/LoginScreen'
import ProtectedAdminRoute from './routing/ProtectedAdminRoute'
import AdminHome from './screens/admin/AdminHome'
import ProtectedRoute from './routing/ProtectedUserRoute'
import SearchFieldFormPage from './forms/components/SearchFieldFormPage'
import HomePage from './screens/user/HomePage'
import FormPage from './forms/components/FormPage'
import AdminUsers from './screens/admin/users/AdminUsers'
import AdminUsersCreate from './screens/admin/users/AdminUsersCreate'
import AdminProjects from './screens/admin/projects/AdminProjects'
import AdminProjectsCreate from './screens/admin/projects/AdminProjectsCreate'
import AdminOfferTypes from './screens/admin/offer-types/AdminOfferTypes'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginScreen />
      },
      {
        element: <ProtectedAdminRoute />,
        children: [
          {
            path: "admin",
            element: <AdminHome />
          },
          {
            path: "admin/users",
            element: <AdminUsers />
          },
          {
            path: "admin/users/create",
            element: <AdminUsersCreate />
          },
          {
            path: "admin/projects",
            element: <AdminProjects />
          },
          {
            path: "admin/projects/create",
            element: <AdminProjectsCreate />
          },
          {
            path: "admin/offer-types",
            element: <AdminOfferTypes />
          },
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "user",
            element: <HomePage />
          },
          {
            path: "user/dataCollection",
            element: <SearchFieldFormPage />
          },
          {
            path: "user/project",
            element: <FormPage />
          },
          {
            path: "user/event",
            element: <SearchFieldFormPage />
          }
        ]
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Billing from "./pages/Billing";
import CustomerDetails from "./pages/CustomersDetails";
import Products from "./pages/Products";
import RegularEntries from "./pages/RegularEntries";
import CustomerCardPage from "./pages/CustomerCardsPage";
import EntriesPage from "./pages/EntriesPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import Account from "./pages/Account"

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="account" element={<Account />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Customers */}
          <Route path="customer" element={<Customer />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route
            path="customers/:id/card"
            element={<CustomerCardPage />}
          />

          {/* Products */}
          <Route path="products" element={<Products />} />

          {/* Entries */}
          <Route path="entries" element={<EntriesPage />} />
          <Route path="regularentries" element={<RegularEntries />} />

          {/* Billing */}
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
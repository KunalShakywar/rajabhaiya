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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent Layout */}
        <Route path="/" element={<Layout />}>
          {/* Default page */}
          <Route index element={<Dashboard />} />

          {/* Child pages */}
          <Route
            path="/customers/:id/card"
            element={<CustomerCardPage />}
          />
          <Route path="entries" element={<EntriesPage />} />
          <Route path="regularentries" element={<RegularEntries />} />
          <Route path="products" element={<Products />} />
          <Route path="customer" element={<Customer />} />
          <Route path="billing" element={<Billing />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
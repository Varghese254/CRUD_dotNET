import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import AdminHome from "./pages/admin/AdminHome";
import UserHome from "./pages/user/UserHome";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Income Pages
import IncomeList from "./pages/user/income/IncomeList";
import AddIncome from "./pages/user/income/AddIncome";
import EditIncome from "./pages/user/income/EditIncome"; // Uncommented

// Import Expense Pages
import ExpenseList from "./pages/user/expense/ExpenseList";
import AddExpense from "./pages/user/expense/AddExpense";
import EditExpense from "./pages/user/expense/EditExpense";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Forgot Password Routes */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute role="admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard */}
      <Route
        path="/user/home"
        element={
          <ProtectedRoute role="user">
            <UserHome />
          </ProtectedRoute>
        }
      />

      {/* Income Routes */}
      <Route
        path="/user/income"
        element={
          <ProtectedRoute role="user">
            <IncomeList />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user/income/add"
        element={
          <ProtectedRoute role="user">
            <AddIncome />
          </ProtectedRoute>
        }
      />
      
      {/* Edit Income Route - Now uncommented */}
      <Route
        path="/user/income/edit/:id"
        element={
          <ProtectedRoute role="user">
            <EditIncome />
          </ProtectedRoute>
        }
      />

      {/* Expense Routes */}
      <Route
        path="/user/expenses"
        element={
          <ProtectedRoute role="user">
            <ExpenseList />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user/expenses/add"
        element={
          <ProtectedRoute role="user">
            <AddExpense />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user/expenses/edit/:id"
        element={
          <ProtectedRoute role="user">
            <EditExpense />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
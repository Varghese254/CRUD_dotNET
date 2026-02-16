import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import AdminHome from "./pages/admin/AdminHome";
import UserHome from "./pages/user/UserHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/user/home" element={<UserHome />} />
    </Routes>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Account from "./components/Account";
import Profile from "./components/Profile/Profile";
import Delete from "./components/Profile/Delete";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />}>
              <Route path="profile" element={<Profile />} />
              <Route path="delete" element={<Delete />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

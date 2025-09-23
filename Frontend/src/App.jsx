import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OAuthCallback from "./components/OAuthCallback";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateSheet from "./components/Profile/CreateSheet";
import ExistingSheet from "./components/Profile/ExistingSheet";
import SelectAccount from "./components/Profile/SelectAccount";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />} />
            <Route path="/sheets/create" element={<CreateSheet />} />
            <Route path="/sheets/existing" element={<ExistingSheet />} />
            <Route path="/sheets/connect/:formId" element={<SelectAccount />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

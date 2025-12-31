import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import ODRequests from "./pages/ODRequests";
import Marks from "./pages/Marks";
import "./App.css";
import Profile from "./pages/Profile";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/od-requests" element={<ODRequests />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

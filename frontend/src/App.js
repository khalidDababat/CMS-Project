import AdminLogin from "./Components/AdminLogin/AdminLogin.jsx";
import ComplaintForm from "./Components/CreateComplint/ComplaintForm.jsx";
import Home from "./Components/HomePage/Home.jsx";
import ComplaintTrack from "./pages/ComplaintTrack.jsx";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard.jsx";
import EmployeePage from "./Components/EmployeePage/EmployeePage.jsx";
import EmployeeMangment from "./Components/AdminDashboard/EmployeeMangment.jsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoutes from "./utils/PrivateRoutes.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import { EmployeeProvider } from "./utils/EmployeeContext.js";

import ForgetPassword from "./pages/ForgotePassword.jsx";
import AdminSettings from "./Components/AdminDashboard/AdminSettings.jsx";

import NotFound from "./pages/NotFound.jsx";
import FooterPart from "./Components/FooterPart/FooterPart.jsx";
import HeaderPart from "./Components/HeaderPart/Header.jsx";




import EditComplaint from "./Components/AdminDashboard/EditComplaint.jsx";
import ComplaintsIssuedAdmin from "./Components/AdminDashboard/ComplaintsIssuedAdmin.jsx";
import ComplaintsReceivedAdmin from "./Components/AdminDashboard/ComplaintsReceivedAdmin.jsx";

import MagicLoginHandler from "./pages/MagicLoginHandler.jsx";

import ResetPasswordAdmin from "./pages/ResetPasswordAdmin.jsx";
import ResetPasswordEmployee from "./pages/ResetPasswordEmployee.jsx";

import EditComplaintEmployee from "./Components/EmployeePage/EditComplaintEmployee.jsx";
import EmployeeSettings from "./Components/EmployeePage/EmployeeSettings.jsx";
import ComplaintsIssuedEmployee from "./Components/EmployeePage/ComplaintsIssuedEmployee.jsx";
import ComplaintsReceiveEmployee from "./Components/EmployeePage/ComplaintsReceiveEmployee.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-complaint" element={<ComplaintForm />} />
        <Route path="/loginAdmin" element={<AdminLogin />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/Complaint_Track" element={<ComplaintTrack />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/magic-login" element={<MagicLoginHandler />} />

        <Route path="/ResetPasswordAdmin" element={<ResetPasswordAdmin />} />
        <Route
          path="/ResetPasswordEmployee"
          element={<ResetPasswordEmployee />}
        />

        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ComplaintsIssuedAdmin"
          element={
            <ProtectedRoute>
              <ComplaintsIssuedAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ComplaintsReceivedAdmin"
          element={
            <ProtectedRoute>
              <ComplaintsReceivedAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ComplaintsIssuedEmployee"
          element={
            <ProtectedRoute>
                  <EmployeeProvider>

                  <ComplaintsIssuedEmployee />
                  </EmployeeProvider>
            
            </ProtectedRoute>
          }
        />
        <Route
          path="/ComplaintsReceiveEmployee"
          element={
            <ProtectedRoute>
               <EmployeeProvider>
               <ComplaintsReceiveEmployee />
               </EmployeeProvider>
             
            </ProtectedRoute>
          }
        />

        <Route
          path="/EditComplaint/:id"
          element={
            <ProtectedRoute>
              <EmployeeProvider>
                <EditComplaint />
              </EmployeeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/AdminSettings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/EmployeeSettings"
          element={
            <ProtectedRoute>
              <EmployeeProvider>
                <EmployeeSettings />
              </EmployeeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/EmployeePage"
          element={
            <ProtectedRoute>
              <EmployeeProvider>
                <EmployeePage />
              </EmployeeProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/EmployeeMangment"
          element={
            <ProtectedRoute>
              <EmployeeProvider>
                <EmployeeMangment />
              </EmployeeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/EditComplaintEmployee/:id"
          element={
            <ProtectedRoute>
              <EmployeeProvider>
                <EditComplaintEmployee />
              </EmployeeProvider>
            </ProtectedRoute>
          }
        />

        <Route path="/HeaderPart" element={<HeaderPart />} />
      </Routes>
    </div>
  );
}

export default App;

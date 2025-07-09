import React from "react";
//import logo from "../Assets/Logo_image.jpg";
import logo from "../Assets/NotFound Logo.jpg"
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#f8f9fa", textAlign: "center", padding: "20px" }}
    >
      <img src={logo} alt="Logo" style={{ width: "100px", marginBottom: "20px" }} />

      <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
        <h1 className="display-5 mb-3 text-danger">404</h1>
        <h4 className="mb-3">الصفحة غير موجودة</h4>
        <p className="text-muted">
          عذرًا! الصفحة التي تبحث عنها غير متوفرة.
        </p>

        <Link to="/" className="btn btn-primary mt-3">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

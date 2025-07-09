import React, { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ChangePassword.module.css";
import logo from "../Assets/Logo_image.jpg"; 

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotePassword = () => {
  const location = useLocation();
  const role = location.state?.role;

  

  const [email, setEmail] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني ");
      return;
    }
    
   
    try {
      const res = await fetch("http://localhost:5000/api/request-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (res.ok) {
        toast.success(
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني "
        );

      }else{
        toast.error("البريد الإلكتروني غير موجود ");

      }

     
    } catch (err) {
      toast.error("فشلت عملية إعادة كلمة المرور ");
    }
  };


  return (
    <Fragment>
      <ToastContainer position="middle-right" autoClose={7000} />

      {/* <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h3 className="mb-4 text-center">نسيت كلمة المرور؟</h3>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="form-label">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            required
          />

          <button type="submit" className="btn btn-primary w-100">
            إرسال رابط تعيين كلمة السر
          </button>
        </form>
      </div> */} 

<div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6">
            <div className="card shadow p-4">
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" width="100" className="mb-3" />
                <h4 className="fw-bold">نسيت كلمة المرور؟</h4>
                <p className="text-muted small">أدخل بريدك الإلكتروني لإرسال رابط التعيين</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    إرسال 
                  </button>
                </div>
              </form>
            </div>
            <div className="text-center mt-4 text-muted small">
              جميع الحقوق محفوظة ©2025. نظام إدارة الشكاوي لبلدية عنبتا
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotePassword;

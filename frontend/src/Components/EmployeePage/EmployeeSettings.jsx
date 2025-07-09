import React, { useState } from "react";
import { Fragment } from "react";

import HeaderEmployee from "./HeaderEmployee.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = location.state || {};

  // const [fullName ,setFullName] =useState();
  // const [Email ,setEmail] =useState();

  const [Password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  console.log("hi ", employee);

  const goBack = () => {
    navigate("/EmployeePage");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/employees/update-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: Password,
            confirmPassword: confirmPassword,
          }),
        }
      );

      if (res.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح ");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error("فشل في تغيير كلمة المرور");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <Fragment>
      <div>
        <HeaderEmployee employee={employee} />
      </div>

      <ToastContainer position="middle-right" autoClose={7000} />

      <div className="container mt-5" dir="rtl">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h4 className="text-center mb-4">تغيير كلمة مرور </h4>
          <form onSubmit={handleSubmit}>
            {/* <div className="mb-3">
              <label className="form-label">اسم الموظف</label>
              <input
                type="text"
                className="form-control"
                value={employee.FullName}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                className="form-control"
                value={employee.email}
                readOnly
              />
            </div> */}

            <div className="mb-3">
              <label className="form-label">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="form-control"
                placeholder="أدخل كلمة المرور الجديدة"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">تأكيد كلمة المرور</label>
              <input
                type="password"
                className="form-control"
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              حفظ الإعدادات
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-3"
              onClick={goBack}
            >
              العودة إلى الرئيسية
            </button>
          </form>
        </div>
      </div>
      <footer className="footer bg-white text-center py-3 border-top mt-5">
        <div className="container">
          <p className="mb-0 text-muted">
            جميع الحقوق محفوظة ©2025. نظام إدارة الشكاوي لبلدية عنبتا
          </p>
        </div>
      </footer>
    </Fragment>
  );
};

export default EmployeeSettings;

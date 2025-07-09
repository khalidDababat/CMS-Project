import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../utils/PrivateRoutes";
import { useNavigate ,useSearchParams } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import HeaderAdmin from "./HeaderAdmin";
const AdminSettings = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  // console.log("The User ",user);


  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  // console.log("form ",formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // setMessage("كلمتا المرور غير متطابقتين.");
      // setMessageType("danger");
      toast.error("كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("لا يوجد توكن تسجيل الدخول");
        setMessageType("danger");
        return;
      }
        
     
      const response = await fetch(
        "http://localhost:5000/api/admin/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      

      if (response.ok) {
        toast.success("تم تحديث إعدادات مدير النظام بنجاح"); 
        // setMessage("تم تحديث إعدادات مدير النظام بنجاح ");
        // setMessageType("success");
         // navigate("/AdminDashboard");
      } else {
        // setMessage(data.message || "حدث خطأ أثناء تحديث البيانات.");
        // setMessageType("danger");
        toast.error(data.message || "حدث خطأ أثناء تحديث البيانات.");
        console.error(data);
      }
    } catch (error) {
      console.error(error);
      setMessage("فشل الاتصال بالخادم.");
      setMessageType("danger");
    }
  };
 

  const goBack = ()=>{
    navigate("/AdminDashboard");
  }



  return (
    <Fragment>
      <div>
        <HeaderAdmin />
      </div>
      <ToastContainer position="bottom-right" autoClose={7000} />

      <div className="container mt-5 mb-5 h-100" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4 text-center">تعديل إعدادات مدير النظام</h3>

        {/* {message && (
          <div
            className={`alert alert-${messageType} text-center`}
            role="alert"
          >
            {message}
          </div>
        )} */}

        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded shadow-sm bg-light"
        >
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              إسم المستخدم
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="اتركها فارغة إذا لا تريد تغييرها"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أعد كتابة كلمة المرور"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-warning px-4">
              حفظ التغييرات
            </button>

            <button type="button" 
                    className="btn btn-primary px-4 me-5"
                    onClick={() => goBack()}>
              العودة الى الصفحة الرئيسية
            </button>
              
          </div>
        </form>
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

export default AdminSettings;

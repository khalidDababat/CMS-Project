import React, { Fragment, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/PrivateRoutes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordEmployee = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const Navigate = useNavigate();

  const { token, role, userId } = location.state;

  console.log("wwwwwwwwww token ", token, " role ", role, "userId ", userId);

  React.useEffect(() => {
    if (!token || !role || !userId) {
      Navigate("/loginAdmin");
      toast.error("لم يتم تعيين كلمة المرور ");
    }
  }, [token, role, userId, Navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين ");
      return;
    }

    // console.log("Sending to server:", {
    //   password,
    //   confirmPassword,
    //   userId,
    //   role,
    //   token,
    // });

    // هنا ترسل كلمة المرور الجديدة للسيرفر

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmPassword,
          userId,
          role,
          token,
        }),
      });
      const data = await res.json();
      // login({token});

      if (res.ok) {
        toast.success("تم تعيين كلمة المرور بنجاح ");
       setTimeout(() => {
        Navigate("/loginAdmin");
       }, (2000));
       
      } else {
        toast.error("حدث خطأ أثناء تعيين كلمة المرور ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <ToastContainer position="middle-right" autoClose={7000} />

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "400px", width: "100%" }}
          dir="rtl"
        >
          <h3 className="mb-4 text-center">تعيين كلمة المرور الجديدة</h3>
          <form onSubmit={handleSubmit}>
            {/* {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}
        {success && (
          <div className="alert alert-success text-center">{success}</div>
        )} */}

            <div className="mb-3 text-start">
              <label className="form-label">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="form-control text-start"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">تأكيد كلمة المرور</label>
              <input
                type="password"
                className="form-control text-start"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="أعد كتابة كلمة المرور"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              حفظ كلمة المرور
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ResetPasswordEmployee;

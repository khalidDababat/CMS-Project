import React, { useState, Fragment ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/Logo_image.jpg"; 
import {useAuth} from  "../../utils/PrivateRoutes.js"; 
// import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const navigate = useNavigate();
 
   const {login} = useAuth(); 
  const [userType, setUserType] = useState("admin");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [ID_Number, setID_Number] = useState("");
  const [passwordEmployee, setPasswordEmployee] = useState("");

  const [messageField, setMessageField] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/api/login";
    const payload =
      userType === "admin"
        ? { username: username.trim(), password: password.trim(), role: userType }
        : { ID_Number: ID_Number.trim(), password: passwordEmployee.trim(), role: userType };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json"
               
       },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    //  console.log("What the Data from login ",data);

    if (res.status === 200) {   

      localStorage.setItem("token",data.token); 

      if(userType === "admin"){
        login(data);   // save user data globally
        navigate("/AdminDashboard");
      }else{
        login(data);
        navigate("/EmployeePage");
      }
      
     
    } else {
      if(userType === "admin"){
      setMessageField("إسم المستخدم او كلمة المرور خطأ ");
      setTimeout(() => setMessageField(""), 2000);
      }else{
      setMessageField("رقم الهوية او كلمة المرور خطأ ");
      setTimeout(() => setMessageField(""), 2000);
      }
    }
  };
 

  useEffect(() => {
    setUsername("");
    setPassword("");
    setID_Number("");
    setPasswordEmployee("");
    setMessageField("");
  }, [userType]);
  
  return (
    <Fragment>
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6">
            <div className="card shadow-lg p-4">
              <div className="text-center mb-3">
                <img src={logo} alt="Logo" width="100" />
                <h3 className="mt-3">تسجيل دخول الموظفين</h3>
              </div>

              {messageField && (
                <div className="alert alert-danger text-center  ">{messageField}</div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3 ">

                  <select
                    className="form-select fw-bold"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="admin">مسؤول النظام</option>
                    <option value="employee">موظف</option>
                  </select>
                </div>

                {userType === "admin" && (
                  <>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="adminUsername"
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <label htmlFor="adminUsername">اسم المستخدم</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="adminPassword"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="adminPassword">كلمة المرور</label>
                    </div>
                    <div className="text-end mb-3">
                      <Link to="/ForgetPassword" 
                            className="text-decoration-none"
                            state={{role:"admin"}}
                            >
                        هل نسيت كلمة المرور؟
                      </Link>
                    </div>
                  </>
                )
               
                }
        
                {userType === "employee" && (
                  <>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="employeeID"
                        placeholder="رقم الهوية"
                        value={ID_Number}
                        onChange={(e) => setID_Number(e.target.value)}
                        required
                      />
                      <label htmlFor="employeeID">رقم الهوية</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="employeePassword"
                        placeholder="كلمة المرور"
                        value={passwordEmployee}
                        onChange={(e) => setPasswordEmployee(e.target.value)}
                        required
                      />
                      <label htmlFor="employeePassword">كلمة المرور</label>
                    </div>
                    <div className="text-end mb-3">
                      <Link to="/ForgetPassword" 
                            className="text-decoration-none"
                            state={{role:"employee"}}
                            >
                        هل نسيت كلمة المرور؟
                      </Link>
                    </div>
                  </>
                )}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    تسجيل دخول
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

export default AdminLogin;

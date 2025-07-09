import React, { Fragment, use, useEffect, useState } from "react";
import logo_image from "../../Assets/Logo_image.jpg";
import { FaBars, FaUser, FaBell } from "react-icons/fa";
import styles from "./EmployeePage.module.css";

import { FaImage } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/PrivateRoutes.js";
import { useEmployee } from "../../utils/EmployeeContext.js";
import HeaderEmployee from "./HeaderEmployee.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";

const EmployeePage = () => {
  const { user, logOut } = useAuth();

  const { employee } = useEmployee();

  const navigate = useNavigate();
  const [complaintsAssigned, setcomplaintsAssigned] = useState([]);
  const [currentEmployee, setcurrentEmployee] = useState({});
  const [incomingComplaints, setIncomingComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("assigned");

  //http://localhost:5000/api/admin/getCountstatus?status=assign

  // console.log("the User ", user.id);
   
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/incomingComplaints?type=employee&user_id=${user.id}`
        );
        const data = await res.json();
       // console.log("ddddd",data);
       setcomplaintsAssigned(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchComplaint();
  }, [user.id]);

  useEffect(() => {
    const EmployeeInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/employees/");
        const data = await res.json();
        const employeeData = data.find((emp) => emp.id === user.id);

        setcurrentEmployee(employeeData);
      } catch (error) {
        console.log("error", error);
      }
    };

    if (user.id) {
      EmployeeInfo();
    }
  }, [user.id]);
  
  
  
  useEffect(() => {
    const getIncomingComplaints = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/outgoingComplaints?type=employee&user_id=${user.id}`
        );
        const data = await res.json();
        // console.log("the Data ", data);
        setIncomingComplaints(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    getIncomingComplaints();
  }, [user.id]); 
   
  
  const employeeID =  user.id;
  const openEditComplaint = (complaint_id) => {
    navigate(`/EditComplaintEmployee/${complaint_id}`,{state:{employeeID}});
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div>
          <HeaderEmployee employee={employee} />
        </div>

        <div className={`m-4 ${styles.content}`}>
          <div className={`bg-light p-3 rounded`}>
            {employee ? (
              <div>
                <h4>{`مرحبا، ${employee.FullName} 🖐 `}</h4>
                <p>{currentEmployee.department_Name}</p>
              </div>
            ) : (
              <p> تحميل ...</p>
            )}
          </div>

          <div className="mt-5">
            <div className="d-flex justify-content-start bg-light rounded px-2">
              <button
                className={`btn ${
                  activeTab == "assigned"
                    ? "bs-body-bg fw-bold border"
                    : "text-dark"
                } ${styles.btn_width}`}
                onClick={() => setActiveTab("assigned")}
              >
                الشكاوي المكلف بها
              </button>

              <button
                id="btn_width"
                className={`btn ${
                  activeTab === "issued"
                    ? "bs-body-bg fw-bold border"
                    : " text-dark"
                } p-3 ${styles.btn_width}`}
                onClick={() => setActiveTab("issued")}
              >
                الشكاوي الصادرة
              </button>
            </div>
          </div>

          {activeTab === "assigned" && (
            <div className="mt-3">
              <h5 className="mb-3">الشكاوى المسندة إليك</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-secondary">
                    <tr>
                      <th>رقم الشكوى</th>
                      <th>موضوع الشكوى</th>
                      <th>الحالة</th>
                      <th>تاريخ الإسناد</th>
                      <th>الملاحظات</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                    {complaintsAssigned
                    .filter((complaint) => complaint.status !== "return" && complaint.status !== "مغلقة"   )
                     .map((complaint) => (
                      <tr key={complaint.id}>
                        <td>{complaint.complaint_id}</td>
                        <td>{complaint.title}</td>
                      
                        <td>
                        <span
                        className={`badge ${
                          complaint.status === "assign"
                            ? "bg-warning"
                            : complaint.status === "قيد المعالجة"
                            ? "bg-info"
                            : complaint.status === "return"
                            ? "bg-success"
                            : complaint.status === "مغلقة"
                            ? "bg-secondary"
                            : "bg-dark"
                        }`}
                      > 
                       
                        {complaint.status}
                      </span>
                        
                        </td>
                        <td>
                          {new Date(complaint.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              timeZone: "Asia/Hebron",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>{complaint.note}</td>

                        <td>
                         
                          <Button
                            onClick={() => openEditComplaint(complaint.complaint_id)}
                            className="btn btn-sm btn-warning"
                            disabled={
                              complaint.status === "مغلقة" }
                          >
                            عرض وتحديث
                          </Button>
                        </td>

               
                      </tr>
                    ))}
                    <tr>
                      {complaintsAssigned.length === 0 && (
                        <td colSpan={7} className="text-center fs-3">
                          لا يوجد شكاوي واردة
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "issued" && (
            <div className="mt-3">
              <h5 className="mb-3">الشكاوي الصادرة </h5>
              <p>الشكاوي التي تم إرسالها إلى مدير النظام</p>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-secondary">
                    <tr>
                      <th>رقم الشكوى</th>
                      <th>موضوع الشكوى</th>
                      <th>حالة الشكوى </th>
                      <th>تاريخ الإرجاع</th>
                      <th>الملاحظات</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                    {incomingComplaints.filter((comp) =>comp.status === "return")
                    .map((complaint) => (
                      <tr key={complaint.id}>
                        <td>{complaint.complaint_id}</td>
                        <td>{complaint.title}</td>
                        <td>
                        <span
                        className={`badge ${
                          complaint.status === "assign"
                            ? "bg-warning"
                            : complaint.status === "قيد المعالجة"
                            ? "bg-info"
                            : complaint.status === "return"
                            ? "bg-success"
                            : complaint.status === "مغلقة"
                            ? "bg-secondary"
                            : "bg-light"
                        }`}
                      >
                        {complaint.status}
                      </span>




                        </td>
                        <td>
                          {new Date(complaint.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              timeZone: "Asia/Hebron",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>{complaint.note}</td>

                        <td>
                          <Button
                          
                            onClick={() =>
                              openEditComplaint(complaint.complaint_id)
                            }
                            className="btn btn-sm btn-warning"
                          >
                            عرض وتحديث
                          </Button>
                        </td>

              
                      </tr>
                    ))}
                    <tr>
                      {incomingComplaints.length === 0 && (
                        <td colSpan={7} className="text-center fs-3">
                          لا يوجد شكاوي صادرة 
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div> 




        <footer className="footer bg-white text-center py-3 border-top mt-5">
        <div className="container">
          <p className="mb-0 text-muted">
            جميع الحقوق محفوظة ©2025. نظام إدارة الشكاوي لبلدية عنبتا
          </p>
        </div>
      </footer>
      </div>
    </Fragment>
  );
};

export default EmployeePage;

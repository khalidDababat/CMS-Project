import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import HeaderEmployee from "./HeaderEmployee.jsx";
import { useEmployee } from "../../utils/EmployeeContext.js";
import styles from "./EmployeePage.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReturnComplaint from "../Model/ReturnComplaint.jsx";
const EditComplaintEmployee = () => {
  const { id } = useParams();

  const location = useLocation();

  const { employee } = useEmployee();
  const nevigate = useNavigate();

  const [infoComplaint, setInfoComplaint] = useState();
  const [complaints, setComplaints] = useState([]);

  const [newStatus, setNewStatus] = useState("");
  const [Note, setNote] = useState();

  const [showModal, setShowModal] = useState(false);

  const userID = location.state?.employeeID;
  

  useEffect(() => {
    const GetInfoComplaint = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/complaint/${id}`
        );
        const data = await res.json();
        //  console.log("tttteee" ,data);
        setInfoComplaint(data);
        // setStatus(infoComplaint[0].status);
      } catch (error) {
        console.log("error", error);
      }
    };



    
    const fetchComplaint = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/incomingComplaints?type=employee&user_id=${userID}`
        );
        const data = await res.json();

        const selectedComplaint = data.find(
          (com) => com.complaint_id === Number(id)
        );

        setComplaints(selectedComplaint);

        // setStatus(data[0].status);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchComplaint();
    GetInfoComplaint();
  }, []);

  const handleConfirm = async () => {
    setShowModal(false);
    handleSubmit(new Event("submit"));
  };

  const handleCancel = () => {
    setShowModal(false);
    toast.info("لم يتم إرجاع الشكوى إلى الموظف");
    return;
  };

  const handleStatusChange = async (e) => {
    const selectedStatus = e.target.value;
    setNewStatus(selectedStatus);

    try {
      const res = await fetch("http://localhost:5000/api/admin/updateStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintId: infoComplaint[0].complaint_id,
          status: selectedStatus,
        }),
      });

      if (res.ok) {
        toast.success("تم تحديث حالة الشكوى بنجاح");
      } else {
        toast.error("فشل في تحديث الحالة");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحديث الحالة");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/returnComplaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaint_id: complaints.complaint_id,
            employee_id: employee.id,
            admin_id: 1,
            note: Note,
          }),
        }
      );

      if (res.ok) {
        toast.success("تم إرجاع الشكوى الى مسؤول النظام");
        setNote("");
        // nevigate("/EmployeePage");
      } else {
        toast.error("لا يمكن إعادة إرسال الشكوى مرة أخرى");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("حدث خطأ أثناء الإرسال !");
    }
  };

  const goHome = () => {
    nevigate("/EmployeePage");
  };

  return (
    <Fragment>
      <div>
        <HeaderEmployee employee={employee} />
      </div>
      <ToastContainer position="bottom-right" autoClose={7000} />
      <div className="container mt-4">
        <div className={`card p-4 shadow ${styles.content_Complaint}`}>
          {infoComplaint ? (
            <h3 className="text-center mb-4">
              تعديل شكوى رقم {complaints.complaint_id}
            </h3>
          ) : (
            <h5 className="text-center">جاري تحميل الشكوى...</h5>
          )}

          {infoComplaint && (
            <form action="" onSubmit={handleSubmit}> 
               
               <div >
              <label >تاريخ إرسال الشكوى</label>
                <input type="text"
                       className="form-control"
                       value={
                        new Date(infoComplaint[0].created_at).toLocaleDateString(
                          "en-GB",)}
                       readOnly
                />
              </div>
             
              
              <div className="mb-2">
                <label htmlFor="">إسم المواطن</label>
                <input type="text"
                className="form-control"
                value={infoComplaint[0].full_name || "غير مدخل"}
                readOnly
                />
              </div>
              

              <div className="mb-2"> 
                <label htmlFor="">رقم جوال المواطن</label>
                <input type="text"
                       className="form-control"
                       value={infoComplaint[0].phone}
                       readOnly
                />
              </div> 
            

          

              <div className="mb-2">
                <label className={styles.form_label}>موضوع الشكوى</label>
                <input
                  type="text"
                  className="form-control"
                  value={complaints.title}
                  readOnly
                />
              </div>

              {/* الوصف */}
              <div className="mb-3">
                <label className={styles.form_label}>وصف الشكوى</label>
                <textarea
                  className="form-control"
                  value={infoComplaint[0].description}
                  rows="3"
                  readOnly
                />
              </div>

              {/* القسم */}
              <div className="mb-3">
                <label className={styles.form_label}>القسم</label>
                <input
                  type="text"
                  className="form-control"
                  value={infoComplaint[0].department_name}
                  readOnly
                />
              </div>
              {/* عرض الصورة */}
              {infoComplaint[0].image_path && (
                <div className="mb-3">
                  <div>
                    
                    <a
                      href={`http://localhost:5000/api/admin/download-images/${id}`}
                      className="btn btn-primary"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      تنزيل ملفات الشكوى
                    </a>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label>حالة الشكوى</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => handleStatusChange(e)}
                  disabled={complaints.status === "return"}
                >
                  <option value="">-تغيير الحالة-</option>
                  {/* <option value="جديدة">جديدة</option> */}
                  <option value="قيد المعالجة">قيد المعالجة</option>
                  <option value="تم الحل">تم الحل</option>
                </select>
              </div>

              {/* الملاحظات */}
              <div className="mb-3">
                <label className={styles.form_label}>ملاحظات</label>
                <textarea
                  className="form-control"
                  value={Note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="أضف ملاحظاتك هنا"
                  rows="3"
                  required
                  disabled={complaints.status === "return"}
                />
              </div>

              {/* زر الإرسال */}
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-warning px-5"
                  onClick={() => setShowModal(true)}
                  disabled={complaints.status === "return"}
                >
                  إرسال
                </button>

                <button
                  type="button"
                  onClick={goHome}
                  className="btn btn-primary px-5 me-5"
                >
                  العودة الى الصفحة الرئيسة ←
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ReturnComplaint
        show={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

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

export default EditComplaintEmployee;

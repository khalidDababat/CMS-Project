import React, { Fragment, useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import logo_image from "../../Assets/Logo_image.jpg";
import { FaImage } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/PrivateRoutes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { useLocation } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin.jsx";
import StatsSection from "../StatsSection/StatsSection .jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const [assignments, setAssignments] = useState([]);

  const handelLogout = () => {
    logOut();
    navigate("/loginAdmin");
  };

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [massege, setmassege] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/viewComplaintInfo"
        );
        if (!res.ok) {
          console.error("HTTP error", res.status);
          return;
        }
        const data = await res.json();

        const setOFComplaints = data.complaints || data.data;
        if (Array.isArray(setOFComplaints) && setOFComplaints.length > 0) {
          setComplaints(setOFComplaints);
        } else {
          setComplaints([]);
          toast.warning("لا يوجد شكاوي متقدمة");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComplaint();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch("http://localhost:5000/api/admin/dropdown-data");
      const data = await res.json();
      // console.log("Thedepartment data ",data.departments);
      setDepartments(data.departments);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Fetch employees
    fetch("http://localhost:5000/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Employees fetched:", data);
        setEmployees(data);
      });
  }, []);

  const getAssignedEmployeeName = (complaintId) => {
    const complaintTransfers = assignments
      .filter((t) => t.complaint_id === complaintId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // ترتيب حسب التاريخ

    const lastTransfer = complaintTransfers[complaintTransfers.length - 1];

    if (!lastTransfer) return "لم يتم الإسناد";

    if (lastTransfer.transfer_type === "returned") {
      return "لم يتم الإسناد";
    }

    if (lastTransfer.transfer_type === "assigned") {
      const emp = employees.find((e) => e.id === lastTransfer.to_user_id);
      return emp ? emp.FullName : "لم يتم الإسناد";
    }

    return "لم يتم الإسناد";
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/outgoingComplaints?type=admin&user_id=1"
        );
        const data = await res.json();
        setAssignments(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchAssignments();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    if (c.is_deleted_by_admin === 1) return false;

    const localDate = new Date(c.created_at).toLocaleDateString("en-GB", {
      timeZone: "Asia/Hebron",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (!startDate || !endDate) return true;

    const complaintDate = new Date(
      new Date(c.created_at).toLocaleString("en-US", {
        timeZone: "Asia/Hebron",
      })
    );
    const start = new Date(
      new Date(startDate).toLocaleString("en-US", { timeZone: "Asia/Hebron" })
    );
    const end = new Date(
      new Date(endDate).toLocaleString("en-US", { timeZone: "Asia/Hebron" })
    );

    return complaintDate >= start && complaintDate <= end;
  });

  const openComplaintDetails = (id) => {
    navigate(`/EditComplaint/${id}`);
  };

  return (
    <Fragment>
      <ToastContainer position="bottom-right" autoClose={7000} />

      <div>
        <HeaderAdmin />
      </div>

      <div className={styles.conteant_page}>
        {/* Sidebar */}
        <div className={styles.side_lists}>
          <ul>
            <li>
              <Link to="/AdminDashboard">قائمة الشكاوي</Link>
            </li>
            <li>
              <Link to="/EmployeeMangment">إدارة الموظفين</Link>
            </li>
            <li>
              <Link to="/ComplaintsIssuedAdmin">
                الشكاوي الصادرة{" "}
                {/* <span className={styles.notify_complaint}>0</span> */}
              </Link>
            </li>
            <li>
              <Link to="/ComplaintsReceivedAdmin">
                الشكاوي الواردة{" "}
                {/* <span className={styles.notify_complaint}>0</span> */}
              </Link>
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="bg-light ">
          <div>
            <StatsSection />
          </div>

          {/* Date filter */}

          <div className={`d-flex gap-3 align-items-center m-4`}>
            <label htmlFor="startDate">من:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate">إلى:</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <p className="text-muted small ms-4">
              يتم تطبيق الفلترة تلقائيًا بمجرد اختيار التاريخين.
            </p>
          </div>



          
          <div className="row m-4">
            {filteredComplaints.length === 0 && (
              <p className="text-center mt-5">
                لا توجد شكاوى في هذا النطاق الزمني
              </p>
            )}
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => openComplaintDetails(complaint.id)}
                >
                  <div className="card-body">
                    <h5 className="card-title">{complaint.title}</h5>
                    <p className="card-text text-muted">
                      {complaint.description.slice(0, 100)}...
                    </p>

                    <p>
                      <strong>الموظف المسند اليه:</strong>
                      {getAssignedEmployeeName(complaint.id)}
                    </p>
                    <p>
                      <strong>الدائرة:</strong>
                      {departments.find((d) => d.id === complaint.department_id)
                        ?.name || "غير معروف"}
                    </p>

                    <p>
                      <strong>تاريخ الإنشاء:</strong>{" "}
                      {new Date(complaint.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          timeZone: "Asia/Hebron",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p>
                      <strong>الحالة:</strong>{" "}
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
                            : complaint.status === "تم الحل"
                            ? "bg-dark"
                            : "bg-danger"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </p>
                    {/* {complaint.image_path && (
                      <button className="btn btn-sm btn-outline-secondary mt-2">
                        <FaImage /> عرض الصورة
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default AdminDashboard;

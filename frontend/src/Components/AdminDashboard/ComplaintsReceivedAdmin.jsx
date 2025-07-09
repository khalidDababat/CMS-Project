import React, { Fragment, useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import logo_image from "../../Assets/Logo_image.jpg";
import { FaBars, FaUser, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/PrivateRoutes";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import { Button, Table } from "react-bootstrap";

const ComplaintsReceivedAdmin = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch employees
    fetch("http://localhost:5000/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Employees fetched:", data);
        setEmployees(data);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/incomingComplaints?type=admin&user_id=1"
        );
        const data = await res.json();

        setAssignments(data);
      } catch (error) {
        console.log("error ", error);
      }
    };
    fetchData();
  }, []); 


  const getEmployeeName = (id, employees) => {
    const employee = employees.find((emp) => emp.id === id);
    
    return employee ? employee.FullName : "—";
  };

 

  const handleEdit = (complaintId) => {
    navigate(`/EditComplaint/${complaintId}`);
  };

 

  return (
    <Fragment>
      <div>
        <HeaderAdmin />
      </div>

      <div className={styles.conteant_page}>
        <div>
          <div className={styles.side_lists}>
            <ul>
              <li>
                <Link to="/AdminDashboard">قائمة الشكاوي </Link>
              </li>
              <li>
                <Link to="/EmployeeMangment">إدارة الموظفين</Link>
              </li>
              <li>
                <Link to="/ComplaintsIssuedAdmin">الشكاوي الصادرة</Link>
              </li>
              <li>
                <Link to="/ComplaintsReceivedAdmin">الشكاوي الواردة </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ......... */}

        <div className="bg-light">
          <h3 className="text-center mt-5">الشكاوي الواردة </h3>

          <div className="table-responsive m-2">
            <Table striped bordered hover>
              <thead className="text-center align-middle">
                <tr>
                  <th>رقم الشكوى</th>
                  <th>عنوان الشكوى</th>
                  <th>تاريخ الشكوى</th>
                  <th>اسم الموظف</th>
                  <th>تاريخ الإسناد</th>
                  <th>حالة الشكوى</th>
                  <th>ملاحظات</th>
                  <th>تعديل الشكوى</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {console.log("Assignments:", assignments)}
                {assignments
                 .filter((comp) => comp.status === "return")
                 .map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.complaint_id}</td>
                    <td>{item.title}</td>
                    <td>
                      {new Date(
                        item.complaint_created_at || item.created_at
                      ).toLocaleDateString()}
                    </td>
                   
                    <td>{getEmployeeName(item.from_user_id, employees)}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>

                    <td>
                    <span
                        className={`badge ${
                          item.status === "assign"
                            ? "bg-warning"
                            : item.status === "قيد المعالجة"
                            ? "bg-info"
                            : item.status === "return"
                            ? "bg-success"
                            : item.status === "مغلقة"
                            ? "bg-secondary"
                            : item.status ==="تم الحل"
                            ? "bg-dark"
                            : "bg-danger"
                        }`}
                      >
                        {item.status}
                      </span>


                    </td>
                    <td>{item.note || "—"}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEdit(item.complaint_id)}
                      >
                        تفاصيل الشكوى
                      </Button>
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr>
                    <td colSpan={8}> لا يوجد شكاوي واردة </td>
                  </tr>
                )} 
              
              </tbody>
            </Table>
          </div>
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

export default ComplaintsReceivedAdmin;

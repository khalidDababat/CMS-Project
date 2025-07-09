import React, { Fragment, useEffect, useState } from "react";
import logo_image from "../../Assets/Logo_image.jpg";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import { useAuth } from "../../utils/PrivateRoutes";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";

import DeleteEmployeeModal from "../Model/DeleteEmployeeModal"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
   
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);


  const [employees, setEmployees] = useState([]);
  // const [messageSuccess, setMessageSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    idNumber: "",
    phone: "",
    email:""
  });

 

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    idNumber: "",
    password: "",
    email: "",
    department_id: "",
  });
  const [editIndex, setEditIndex] = useState(null);


 


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees/");
      if (!res.ok) throw new Error("Error fetching employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
 

  console.log("Department before sending:", form.department_id);


  async function addOrUpdateEmployee() {
    try {
      if (editIndex !== null) {
        const employeeId = employees[editIndex].id;

        const res = await fetch(
          `http://localhost:5000/api/employees/${employeeId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              admin_ID: 1,
              department_id: Number(form.department_id),
            }),
          }
        );
         

        if (!res.ok) {
           
         throw new Error("Failed to update employee");
          // const errorData = await res.json();
          // console.log("the error ", errorData); 
          
          // let errors  ={}; 
         
          // if(errorData.message){
          
          //   if (
          //     errorData.message.includes("ID Number") ||
          //     errorData.message.includes("رقم الهوية")
          //   ){
          //       errors.idNumber = errorData.message;
          //     }else if (
          //       errorData.message.includes("Phone") ||
          //       errorData.message.includes("الهاتف")
          //     ){
          //       errors.phone = errorData.message;
          //     } else if (
          //       errorData.message.includes("Email") ||
          //       errorData.message.includes("البريد")
          //     ) {
          //       errors.email = errorData.message;
          //     }else if (
          //       errorData.message.includes("password") ||
          //       errorData.message.includes("كلمة المرور")
          //     ){
          //       errors.password = errorData.message;
          //     }else {
          //       toast.error(errorData.message);
          //     }
            


          // } 
          // if (Object.keys(errors).length > 0) {
          //   setFieldErrors(errors);
          // }
          // return; 

        }

        toast.success("تم تحديث بيانات الموظف ");
        await fetchEmployees();
            
        setForm({
          fullName: "",
          phone: "",
          idNumber: "",
          password: "",
          email: "",
          department_id: "",
        });
        setEditIndex(null);
      } else {
        const res = await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            admin_ID: 1,
            department_id: Number(form.department_id),
          }),
        }); 
      

        if (!res.ok){


      
          const errorData = await res.json();
          console.log("the error ", errorData); 
          
          let errors  ={}; 
         
          if(errorData.message){
          
            if (
              errorData.message.includes("ID Number") ||
              errorData.message.includes("رقم الهوية")
            ){
                errors.idNumber = errorData.message;
              }else if (
                errorData.message.includes("Phone") ||
                errorData.message.includes("الهاتف")
              ){
                errors.phone = errorData.message;
              } else if (
                errorData.message.includes("Email") ||
                errorData.message.includes("البريد")
              ) {
                errors.email = errorData.message;
              }else if (
                errorData.message.includes("password") ||
                errorData.message.includes("كلمة المرور")
              ){
                errors.password = errorData.message;
              }else {
                toast.error(errorData.message);
              }
            


          } 
          if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
          }
            
          
          return; 


        } 

        toast.success("تم إضافة الموظف بنجاح ");
      }

      fetchEmployees();
    } catch (err) {
      console.error("Operation Error:", err);
      
      toast.error("حدث خطأ أثناء تحديث بياتات الموظف .يرجى المحاولة لاحقا ");
    }
  } 

 

  const handleConfirm =async () => {
    
    if (selectedEmployeeIndex === null) return;
    

    const employee = employees[selectedEmployeeIndex];

   // console.log("Deleting employee:", employee);


    try {
      const res = await fetch(
        `http://localhost:5000/api/employees/${employee.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete employee");
      toast.warning(`تم حذف الموظف ${employee.FullName}`);
      fetchEmployees();
    } catch (error) {
      console.error("Delete Error:", error);

      toast.info("فشل حذف الموظف ");
    }
   setShowModal(false)
  };

  const handleCancel = () => {
    setShowModal(false);
    toast.info("لم يتم حذف الموظف ");
    return;
  };






  const handleSubmit = (e) => {
    e.preventDefault();
    addOrUpdateEmployee();

    setForm({
      fullName: "",
      phone: "",
      idNumber: "",
      password: "",
      email: "",
      department_id: "",
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const emp = employees[index];
    //console.log("the employee Edited ", emp);
    setForm({
      fullName: emp.FullName,
      phone: emp.phone,
      idNumber: emp.ID_Number,
      // password: "",
      email: emp.email,
      department_id: emp.department_id.toString(),
    });
    console.log("emp.department_id ", form);
    setEditIndex(index);
  };

  const handleDelete = async (index) => { 

    setSelectedEmployeeIndex(index);
    setShowModal(true); 


  
  };

  const departments = [
    { id: 1, name: "الدائرة الهندسية" },
    { id: 2, name: "دائرة الشؤون الإدارية" },
    { id: 3, name: "دائرة الصحة والبيئة" },
  ];

  return (
    <Fragment>
      <ToastContainer position="bottom-right" />

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

        <div className="p-4 w-100 bg-light">
          <h5 className="mb-3">إضافة / تعديل موظف</h5>

          <form onSubmit={handleSubmit} className="mb-4">
            <label htmlFor="fullName">اسم الموظف</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />

            <label htmlFor="phone">رقم الهاتف</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="form-control mb-2"
            /> 
            {fieldErrors.phone && (
              <div className="text-danger">{fieldErrors.phone}</div>
           )}

            <label htmlFor="idNumber">رقم الهوية</label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />
            {fieldErrors.idNumber && (
             <div className="text-danger">{fieldErrors.idNumber}</div>
           )}

            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-control mb-2"
            /> 
             {fieldErrors.email && (
             <div className="text-danger">{fieldErrors.email}</div>
           )}

            <label htmlFor="department_id">اختر الدائرة</label>
            <select
              id="department_id"
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              required
              className="form-control mb-2"
            >
              <option value="">-- اختر الدائرة --</option>
              {departments.map((dept) => (
                <option value={dept.id}>{dept.name}</option>
              ))}
            </select>

            <label htmlFor="password">كلمة المرور
              <span className={styles.requred_star}>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control mb-2"
            />

            <div className="d-flex gap-2">
              {editIndex === null ? (
                <button type="submit" className="btn btn-success">
                  إضافة الموظف
                </button>
           

              ) : (
                <>
                  <button type="submit" className="btn btn-primary">
                    تحديث الموظف
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditIndex(null);
                      setForm({
                        fullName: "",
                        phone: "",
                        idNumber: "",
                        password: "",
                        email: "",
                        department_id: "",
                      });
                    }}
                  >
                    إلغاء التعديل
                  </button>
                </>
              )}
            </div>
          </form>


          <h5>قائمة الموظفين</h5>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>الرقم</th>
                <th>الإسم</th>
                <th>رقم الهوية</th>
                <th>رقم الهاتف</th>
                <th>البريد الإلكتروني</th>
                <th>القسم</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>
                  <td>{emp.FullName}</td>
                  <td>{emp.ID_Number}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.email}</td>
                  {/* <td>{emp.department_Name}</td> */}
                  <td>{departments.find((d) => d.id === emp.department_id)?.name || "غير معروف"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm ms-2"
                      onClick={() => handleEdit(index)}
                    >
                      تعديل
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(index)}
                    >
                      حذف
                    </button> 
                   
                  </td>
                </tr>
              ))} 

                    <DeleteEmployeeModal
                       show={showModal}
                        onConfirm={handleConfirm}
                       onCancel={handleCancel}
                      />
             
              {employees.length === 0 && (
                <tr>
                  <td colSpan="7">لا يوجد موظفين حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
         
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

export default EmployeeManagement;

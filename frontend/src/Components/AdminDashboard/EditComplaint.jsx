import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import { useAuth } from "../../utils/PrivateRoutes";
import styles from "./AdminDashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState();
  const [complaintInfo, setComplaintInfo] = useState({ complaints: [] });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [newStatus, setNewStatus] = useState("");
  
  const [flagDelete, setFlagDelete] = useState(false);
  const [ComplaintEmployee, setComplaintEmployee] = useState();

  const [adminNote, setAdminNote] = useState("");
  const [currentNote , setCurrentNote] = useState("");

  const [userNote, setUserNote] = useState("");


  const { user, logOut } = useAuth();

 
  



  useEffect(() => {
    // Fetch complaint details
    fetch(`http://localhost:5000/api/admin/complaint/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaint(data[0]);
       // console.log("rrrrrrrrr",data[0]);

        setSelectedDept(data[0].department_name);
        setSelectedEmployee("");
        setNewStatus(data[0].status);
      }); 
        

     



    // Fetch departments
    fetch("http://localhost:5000/api/admin/dropdown-data")
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments));
    // console.log("ddddd",departments);

    // Fetch employees
    fetch("http://localhost:5000/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Employees fetched:", data);
        setEmployees(data);
      });
  }, [id]); 

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/viewComplaintInfo")
    .then((res) => res.json())
    .then((data) => {
        setComplaintInfo(data);  
     
    })
    .catch((error) => {
      console.error("Error fetching complaint info:", error);
    });
  }, []);
     

   useEffect(() => {
    if (complaintInfo.complaints && complaintInfo.complaints.length > 0) {
      console.log("Complaint Info:", complaintInfo.complaints);
     
      const fetchedComplaint = complaintInfo.complaints.find(
        (complaint) => complaint.id === Number(id)  
        
      );

      if (fetchedComplaint) {
        //console.log("Fetched Complaint:", fetchedComplaint); 
        setFlagDelete(fetchedComplaint.is_deleted_by_admin);
        setCurrentNote(fetchedComplaint.Note);
      } else {
        console.log("Complaint with id 28 not found");
      }
    }
   },[complaintInfo]);
  

   
 




  const addNoteToUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/updateStatusWithNote",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintId: complaint.complaint_id,
            status: newStatus,
            note: userNote,
          }),
        }
      );

      //console.log("hhhhhhhhhhhhhhhhhh ", userNote);
      if (response.ok) {
        toast("تم إضافة ملاحظات للمواطن ");
      } else {
        toast.error("فشل في إرسال الملاحظة");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  if (!complaint ) {
    return <div className="container mt-4">جارٍ تحميل البيانات...</div>;
  }

  const handleDeleteComplaint = async () => {
    const confermDelete = window.confirm(
      "هل أنت متأكد من أنك تريد حذف هذه الشكوى؟ لا يمكن التراجع عن هذا الإجراء"
    );

    if (!confermDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/deleteComplaint/${complaint.complaint_id}`,
        {
          method: "DELETE",
        }
      );
        
  
      if (res.ok) { 
       
        toast("تم حذف الشكوى بنجاح ");
        setFlagDelete(true); 
  
        setTimeout(() => {
          navigate("/AdminDashboard");
        }, 5000);
      } else {
        toast.error("فشل في حذف الشكوى");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("حدث خطأ أثناء الحذف، يرجى المحاولة لاحقًا");
    }
  }; 



  const handleAssignComplaint = async () => {


    if(complaint.status === "مغلقة"){
      toast.error("لا يمكن إسناد الشكوى المغلقة");
      return;

    }


    if (!selectedEmployee) {
      toast.error("يرجى إختيار الموظف");
      return;
    }

    const body = {
      complaint_id: complaint.complaint_id,
      employee_id: Number(selectedEmployee),
      admin_id: 1,
      note: adminNote,
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/assignComplaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
           // Authorization: `Bearer ${user.token}`, // Assuming you have a token for authentication
          },
          body: JSON.stringify(body),
        }
      );
      // const data = res.json();

      if (res.ok) {
        const assignedEmployee = employees.find(
          (emp) => emp.id === Number(selectedEmployee)
        );

        toast.success(
          `تم إسناد الشكوى إلى الموظف ${
            assignedEmployee?.FullName || "غير مسند"
          } بنجاح`
        );

        // setTimeout(() => {
        //   navigate("/AdminDashboard");
        // }, 9000);
      } else {
        toast.error("فشل في الإسناد.لا يمكن إسناد الشكوى لنفس الموظف");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التنفيذ.يرجى المحاولة لاحقا");
    }
  };
 
  console.log("complaint", id);
  const handelChangeDepartment = async (e) => {
       const selectedDepartment = e.target.value;
       setSelectedDept(selectedDepartment);

       try{
  
        const res = await fetch(`http://localhost:5000/api/admin/${id}/change-department`,
          {
            method:"PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
            newDepartmentId:Number(selectedDepartment),
             adminId:1
           
          }),
        });

         
        if(res.ok){
      
        toast.success("تم تغيير القسم بنجاح");
        }else{
          toast.error("فشل في تغيير القسم");
        }



       } catch (error) {
          console.error("Error changing department:", error);
          toast.error("حدث خطأ أثناء تغيير الدائرة");
       }
  }



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
          complaintId: complaint.complaint_id,
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

  return (
    <Fragment>
      <ToastContainer position="bottom-right" />
      <div>
        <HeaderAdmin />
      </div>

      <div className={`containe ${styles.main_conteaner}`}>
        <div className={styles.side_lists}>
          <ul>
            <li>
              <Link to="/AdminDashboard">قائمة الشكاوي</Link>
            </li>
            <li>
              <Link to="/EmployeeMangment">إدارة الموظفين</Link>
            </li>
            <li>
              <Link to="/ComplaintsIssuedAdmin">الشكاوي الصادرة </Link>
            </li>
            <li>
              <Link to="/ComplaintsReceivedAdmin">الشكاوي الواردة </Link>
            </li>
           
          </ul>
        </div>

        <div className="content m-4 ">
          <h2>تفاصيل الشكوى</h2>

          <div className="mb-3">
            <label>موضوع الشكوى: </label>
            <input className="form-control" value={complaint.title} disabled />
          </div>

          <div className="mb-3">
            <label>نص الشكوى:</label>
            <textarea
              className="form-control"
              value={complaint.description}
              disabled
            />
          </div>

          <div className="mb-3">
            <label>اسم المواطن:</label>
            <input
              className="form-control"
              value={complaint.full_name || "غير مدخل"}
              name="name"
              disabled
            />
          </div>

          <div className="mb-3">
            <label>رقم جوال المواطن:</label>
            <input
              className="form-control"
              value={complaint.phone}
              name="phone"
              disabled
            />
          </div>

          <div className="mb-3">
            <label>البريد الإلكتروني:</label>
            <input className="form-control" value="غير مدخل " disabled />
          </div>

          <div className="mb-3">
            <label>الدائرة المعنية</label>
            <input
              className="form-control"
              value={complaint.department_name}
              disabled
            />
          </div>

          {/* <div className="mb-3">
            <label>رقم الهوية:</label>
            <input
              className="form-control"
              value={complaint.ID_number}
              disabled
            />
          </div> */}

          <div className="mb-3">
            <label>الدائرة:</label>
            <select
              className="form-control"
              value={selectedDept}
              onChange={handelChangeDepartment}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>الموظف :</label>
            <select
              className="form-control"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">إسناد الى موظف</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {`${e.FullName}  -${e.department_Name}-`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>حالة الشكوى</label>
            <select
              className="form-control"
              value={newStatus}
              onChange={(e) => handleStatusChange(e)}
            >
              <option  disabled >
                -تغيير الحالة-
              </option>
              <option value="New">New</option>              
              <option value="قيد المعالجة">قيد المعالجة</option>
              <option value="مغلقة">مغلقة</option>
            </select>
          </div>
          
          
          {complaint.image_path && (
            <div className="mb-3">
              <a
               
                href={`http://localhost:5000/api/admin/download-images/${id}`}
                rel="noopener noreferrer"
                className="btn btn-outline-secondary"
              >
                تنزيل ملفات الشكوى
              </a>
            </div>
          )}

          <div className="mb-3">
            <label>ملاحظات الموظف</label>
            <textarea
              className="form-control"
              placeholder="إضافة ملاحظات للموظف "
              rows="4"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>ملاحظات المواطن</label>
            <textarea
              className="form-control"
              placeholder="إضافة ملاحظات للمواطن المشتكي"
              rows="4"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value || "لم يتم معالجتها من قبل البلدية")}
            />
          </div>
          {console.log("currentNote", currentNote)}

          {/* //d-flex gap-3 mt-4 */}
          <div className={styles.conteaner_btn}>
            <div className="">
              <button
                type="button"
                className="ms-3 btn btn-success"
                onClick={() => handleAssignComplaint()}
              >
                إسناد الشكوى
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => addNoteToUser()}
              >
                إضافة ملاحظات للمواطن
              </button>
            </div>

            <button id="deleted" 
                    className="btn btn-danger" 
                    onClick={handleDeleteComplaint}
                    disabled={ flagDelete}>
              حذف الشكوى
            </button>
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

export default EditComplaint;

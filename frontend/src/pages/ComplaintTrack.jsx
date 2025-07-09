import React, { Fragment } from "react";
import styles from "./ChangePassword.module.css";
import FooterPart from "../Components/FooterPart/FooterPart.jsx";
import HeaderPart from "../Components/HeaderPart/Header.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";

import { FaSearch } from "react-icons/fa";

const ComplaintTrack = () => {
  const [idNumber, setIdNumber] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const [IDError, setIDError] = useState("");

  const handleIdNumberChange = (e) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      return;
    }

    setIdNumber(value);

    if (value.length === 9) {
      setIDError(""); 
    } else if (value.length > 9) {
      setIDError("رقم الهوية يجب أن يحتوي على 9 أرقام فقط.");
    } else {
      setIDError("رقم الهوية يجب أن يحتوي على 9 أرقام فقط.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotFound(false);

    try {
      const res = await fetch(
        `http://localhost:5000/api/complaints/by-id-number/${idNumber}`
      );
      const data = await res.json();

      //console.log("ssssssss",data.complaints);

      if (
        res.ok &&
        Array.isArray(data.complaints) &&
        data.complaints.length > 0
      ) {
        setComplaints(data.complaints);
        setNotFound(false);
      } else {
        setComplaints([]);
        setNotFound(true);
      }
    } catch (error) {
      console.log("error", error);
      setComplaints([]);
      setNotFound(true);
    }
  };

  return (
    <Fragment>
      <div className="mb-4">
        <HeaderPart />
      </div>

      <div className={styles.complaint_track}>
        <h2>
          متابعة شكوى <FaSearch />
        </h2>
        <p>تتبع حالة الشكوى الخاصة بك</p>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="">إدخل رقم الهوية</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => handleIdNumberChange(e)}
            required
          />
          {IDError && <div className="text-danger mt-1">{IDError}</div>}
          <button type="submit">
            متابعة شكوى <FaSearch />
          </button>
        </form>

        {notFound && (
          <div className="alert alert-danger mt-4 fw-bold" role="alert">
            لم يتم العثور على شكوى بهذا الرقم، يرجى التأكد من الرقم والمحاولة مرة أخرى
          </div>
        )}

        {complaints.length > 0 && (
          <div className="mt-4">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>رقم الشكوى</th>
                  <th>عنوان الشكوى</th>
                  <th>حالة الشكوى</th>
                  <th>تاريخ الإرسال</th>
                  <th>رقم الهاتف</th>
                  <th>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {console.log("complaints", complaints)}
                {complaints.map((compalint) => (
                  <tr key={compalint.complaint_id}>
                    <td>{compalint.complaint_id}</td>
                    <td>{compalint.title}</td>
                   

                    <td>

                    <span
                        className={`${styles.badge}  ${
                          compalint.status === "assign"
                            ? "bg-warning"
                            : compalint.status === "قيد المعالجة"
                            ? "bg-info"
                            : compalint.status === "return"
                            ? "bg-success"
                            : compalint.status === "مغلقة"
                            ? "bg-secondary"
                            : "bg-light"
                        }`}
                      >
                        {compalint.status === "return" ? "تم إرجاع الشكوى الى مسؤول النظام" 
                          : compalint.status === "assign" ? "تم إرسال الشكوى إلى الموظف  للعمل عليها" :
                          compalint.status}
                      </span>


                    </td>
                    <td>
                      {new Date(compalint.created_at).toLocaleDateString("EG")}
                    </td>
                    <td>{compalint.phone}</td>
                    <td>{compalint.Note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <FooterPart />
      </div>
    </Fragment>
  );
};

export default ComplaintTrack;

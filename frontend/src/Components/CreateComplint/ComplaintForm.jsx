import React, { Fragment, useState, useRef, useEffect } from "react";
import styles from "./ComplaintForm.module.css";
import FooterPart from "../FooterPart/FooterPart.jsx";
import HeaderPart from "../HeaderPart/Header.jsx";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuFileText } from "react-icons/lu";

import SuccessModal from "../Model/SuccessModal.jsx";

import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";

// import { Link } from "react-router-dom";

const ComplaintForm = () => {
  const [messageSuccess, setmessageSuccess] = useState("");

  const [PhoneError, setPhoneError] = useState("");
  const [messageError, setmessageError] = useState("");
  
  const [IDError, setIDError] = useState("");
  const [imageError , setimageError] = useState("");


  const [isLoading, setIsLoading] = useState(false);
   

  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    ID_number: "",
    department_id: "",
    title: "",
    description: "",
    files: [],
  });

  const handleConfirm = () => {
    setShowModal(false);
    if (pendingData) {
      submitComplaint(pendingData);
      setPendingData(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setIsLoading(false);
    toast.info("تم إلغاء إرسال الشكوى.");
    return;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "description") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
      console.log("Word count:", wordCount);
      if (wordCount > 100) {
        setmessageError("لا يمكن إرسال الشكوى لأن وصفها يتجاوز 100 كلمة.");
      } else if (wordCount < 5) {
        setmessageError(
          "لا يمكن إرسال الشكوى لأن وصفها يجب أن يكون أكثر من 5 كلمات."
        );
      } else {
        setmessageError("");
      }
    }

    if (name === "ID_number") {
      const idRegex = /^\d{9}$/;
      if (!idRegex.test(value)) {
        setIDError("رقم الهوية يجب أن يتكون من 9 أرقام فقط.");
      } else {
        setIDError("");
      }
    }

   
    if (files) {
      // console.log("Uploaded files:", files);
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submitComplaint = async (dataToSend) => {
    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("ID_number", formData.ID_number);
    data.append("department_id", formData.department_id);
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((fileItem) => {
        data.append("attachments", fileItem);
      });
    }

    try {
      const res = await fetch("http://localhost:5000/api/complaints/submit", {
        method: "POST",
        body: data,
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await res.json();

        toast.success("تم إرسال الشكوى ،سيتم معالجة الشكوى من قبل البلدية .");
      }
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        ID_number: "",
        department_id: "",
        title: "",
        description: "",
        files: [],
      });
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ اثناء إرسال الشكوى ");
    }finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      toast.error("رقم الهاتف مطلوب.");
      return;
    }

    


    setIsLoading(true);

    setPendingData(formData);
    setShowModal(true);
  };

  return (
    <Fragment>
      <ToastContainer position="bottom-right" autoClose={7000} />

      <div className="mb-4">
        <HeaderPart />
      </div>

      <div className={`container ${styles.containerWrapper}`}>
        <div className={styles.complaint_Content}>
          <div className={styles.title_page}>
            <h2>
              <LuFileText /> إنشاء شكوى
            </h2>
            <p className="text-muted">
              يرجى تعبئة جميع الحقول المطلوبة لضمان سرعة معالجة الشكوى
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">الإسم الكريم</label>
              <input
                type="text"
                className="form-control"
                placeholder="الإسم الكامل"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className={`mb-3 ${styles.phoneInputWrapper}`}>
              <label className="form-label">
                رقم الهاتف المحمول{" "}
                <span className={styles.requiredStar}>*</span>
              </label>
              <PhoneInput
                country="ps"
                onlyCountries={["ps", "il"]}
                preferredCountries={["ps", "il"]}
                enableAreaCodes
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                }}
                containerStyle={{ direction: "ltr" }}
                inputStyle={{ fontSize: "16px", height: "45px", width: "100%" }}
              />
              {PhoneError && (
                <div className="text-danger mt-1">{PhoneError}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">الإيميل</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email إختياري"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                رقم الهوية <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="رقم الهوية"
                name="ID_number"
                value={formData.ID_number}
                onChange={handleChange}
                required
              />
              {IDError && <div className="text-danger mt-1">{IDError}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                الجهة المعنية <span className={styles.requiredStar}>*</span>
              </label>
              <select
                name="department_id"
                className="form-select"
                value={formData.department_id}
                onChange={handleChange}
                required
              >
                <option value="">-- اختر الجهة --</option>
                <option value="1">دائرة الهندسية</option>
                <option value="2">دائرة الشؤون الإدارية</option>
                <option value="3">دائرة الصحة والبيئة</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                موضوع الشكوى <span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="موضوع الشكوى"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                وصف الشكوى <span className={styles.requiredStar}>*</span>
              </label>
              <textarea
                name="description"
                rows={5}
                className={`form-control ${styles.resizeBoth}`}
                placeholder="وصف الشكوى"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
              {messageError && (
                <div className="text-danger mt-1">{messageError}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">إدراج صورة او فيديو (إختياري)</label>
              <input
                type="file"
                accept="image/* ,video/*"
                className="form-control"
                name="files"
                multiple
                onChange={handleChange}
              />
              {/* {imageError && <div className="text-danger mt-1">{imageError}</div>} */}
              <small className="text-muted">يمكنك رفع الصور والفيديوهات</small>
            </div>

            <div className="text-center">
           

              {isLoading ? (
                <button className={`px-5${styles.submitButton}`} disabled>
                  جاري الإرسال...
                </button>
              ) : (
                <button type="submit" className={`px-5  ${styles.submitButton}`}>
                  إرسال
                </button>
              )}
            </div>

            <SuccessModal
              show={showModal}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </form>
        </div>
      </div>

      <div className="mt-4">
        <FooterPart />
      </div>
    </Fragment>
  );
};

export default ComplaintForm;

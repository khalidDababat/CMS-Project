import React from "react";
import styles from "./SuccessModal.module.css";
import { IoIosWarning } from "react-icons/io";

const SuccessModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div className="bg-white p-4 rounded shadow w-50 text-center">
        <div className="fs-1 text-warning mb-3">
          <IoIosWarning />
        </div>
        <h4 className="mb-4">هل تريد متابعة إرسال الشكوى الى البلدية؟</h4>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-danger" onClick={onConfirm}>
            موافق
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

export default SuccessModal;

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
const ComplaintsIssuedEmployee = () => {
  const { user, logOut } = useAuth();
  const { employee } = useEmployee();
  const navigate = useNavigate();

  return (
    <Fragment>
       <div>
          <HeaderEmployee employee={employee} />
        </div>
      <div className={styles.Home_conteaner}>
       

        <div className={styles.side_lists}>
          <ul>
            <li>
              <Link to="/EmployeePage">الصفحة الرئيسية</Link>
            </li>
            <li>
              <Link to="/ComplaintsIssuedEmployee">الشكاوي الصادرة </Link>
            </li>
            <li>
              <Link to="/ComplaintsReceiveEmployee">الشكاوي الواردة </Link>
            </li>
          </ul>
        </div>

        <div className={`m-4 ${styles.content}`}>
           
           
        </div>




      </div>
    </Fragment>
  );
};

export default ComplaintsIssuedEmployee;

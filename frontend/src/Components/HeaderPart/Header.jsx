import React ,{useState} from "react";
import styles from "./Header.module.css";
import { Link ,useLocation} from "react-router-dom";

import {
  FaHome,
  FaPenSquare,
  FaSearch,
  FaUser,
} from "react-icons/fa"; 
 





const Header = () => { 

  


  

  return (
    <div className={styles.home_header}> 
    <div className={styles.header_logo}>
           <Link to="/">
            <h1>بلدية عنبتا</h1>
            <span>نظام إدارة الشكاوي</span>
          </Link>
    </div>
     

  
      <div className={styles.action}>
        <Link to="/"  > 
            <FaHome className={styles.icon} />
            <span>الصفحة الرئيسية</span>
        </Link>       
        <Link to="/create-complaint" 
               >   
              <FaPenSquare className={styles.icon} /> 
              <span>تقديم شكوى </span>      
        </Link>

        <Link to="/Complaint_Track">
          <FaSearch className={styles.icon} />
          <span>متابعة شكوى</span>        
        
        </Link>
      </div>
    </div>
  );
};

export default Header;

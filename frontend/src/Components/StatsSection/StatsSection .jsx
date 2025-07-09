import React, { useEffect, useState } from 'react';
import styles from  './StatsSection.module.css'; // Link to custom styles
import { FaRegFileAlt, FaChartLine, FaClock, FaUser } from 'react-icons/fa';
import { MdNotificationsActive } from "react-icons/md";


const StatsSection = () => {

  const [countComplaint , setCountComplaint] =useState(""); 
  const [countComplaintClose ,setcountComplaintClose]= useState(""); 
  const [countInProgress ,setcountInProgress]= useState(""); 
  const [countNew ,setcountNew]= useState("");
  const [countEmployee ,setCountEmployee]= useState(""); 

   useEffect(() =>{
        
    fetch("http://localhost:5000/api/admin/getCountComplaints")
     .then(res => res.json())
     .then(data =>{ 
      //console.log("sss",data[0]["COUNT(*)"])
      setCountComplaint( data[0]["COUNT(*)"]); 

    })
     .catch( error => {
      console.log(error);
     })


     fetch("http://localhost:5000/api/admin/getCountstatus?status=مغلقة")
     .then(res => res.json())
     .then(data =>{ 
      //console.log("sss",data[0]["COUNT(*)"])
      setcountComplaintClose( data[0]["COUNT(*)"]); 

    })
     .catch( error => {
      console.log(error);
     }) 

        
     fetch("http://localhost:5000/api/admin/getCountstatus?status=New")
     .then(res => res.json())
     .then(data =>{ 
      console.log("sss",data[0]["COUNT(*)"])
      setcountNew(data[0]["COUNT(*)"]);
      

    })
     .catch( error => {
      console.log(error);
     }) 


       

     fetch("http://localhost:5000/api/admin/getCountstatus?status=قيد المعالجة")
     .then(res => res.json())
     .then(data =>{ 
      //console.log("sss",data[0]["COUNT(*)"])
      setcountInProgress( data[0]["COUNT(*)"]); 

    })
     .catch( error => {
      console.log(error);
     })


     fetch("http://localhost:5000/api/employees/")
     .then(res => res.json())
     .then(data =>{ 
      //console.log("sss",data[0]["COUNT(*)"])
      setCountEmployee( data.length); 

    })
     .catch( error => {
      console.log(error);
     })

   },[]);



  const stats = [ 

    { icon: <MdNotificationsActive />, number: countNew, label: 'الشكاوي الجديدة', color: 'red' },

    { icon: <FaRegFileAlt />, number: countComplaint, label: 'إجمالي الشكاوى', color: '#3B82F6' }, // blue
    { icon: <FaChartLine />, number: countComplaintClose, label: 'مغلقة', color: '#10B981' }, // green
    { icon: <FaClock />, number: countInProgress, label: 'قيد المعالجة', color: '#F59E0B' }, // amber
    { icon: <FaUser />, number: countEmployee, label: 'الموظفين', color: '#8B5CF6' }, // violet
  ];


  return (
    <section className={styles.stats_section}>
      {/* <h2 className={styles.section_title}>إحصائيات النظام</h2> */}
      <div className={styles.stats_grid}>
        {stats.map((item, idx) => (
          <div className={styles.stat_card} key={idx}>
            <div className={styles.icon_wrapper} style={{ color: item.color }}>
              {item.icon}
            </div>
            <h3 className={styles.stat_number}>{item.number}</h3>
            <p className={styles.stat_label}>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;

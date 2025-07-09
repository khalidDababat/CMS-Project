import React, { Fragment, useState } from "react";
import styles from "./Home.module.css";
// import FooterPart from "../FooterPart/FooterPart.jsx"
import { Link } from "react-router-dom";
import ComplaintForm from "../../Components/CreateComplint/ComplaintForm.jsx";
import FooterPart from "../FooterPart/FooterPart.jsx";
import HeaderPart from "../HeaderPart/Header.jsx";
import StatsSection from "../StatsSection/StatsSection .jsx";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLock } from "react-icons/fa";

const Home = () => {







  
  return (
    <Fragment>
      <div className={styles.home_container} id="home-container">
        <div>
          <HeaderPart />
        </div>
        <div className={styles.home_content}>
          <div className={styles.title}>
            <h1>بلدية تستمع، تستجيب، وتطوّر</h1> <br />
            <p className="">
              نحن هنا لخدمتكم! قدموا شكاواكم واقتراحاتكم بسهولة وتابعوا حالة
              طلباتكم
            </p>
          </div>
        </div>

        {/* <div>
          <StatsSection />
        </div> */}
      </div>

      {/* <div id="create-complaint">
        <ComplaintForm/>
        </div> */}
      <div>
        <div></div>
        <FooterPart />
      </div>
    </Fragment>
  );
};

export default Home;

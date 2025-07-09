import React from 'react';
import styles from './FooterPart.module.css';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.contactSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>للتواصل معنا</h2>
          <Link to="/loginAdmin" className={styles.loginButton}>
            <FaLock className={styles.loginIcon} />
            دخول الإدارة
          </Link>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <div className={styles.icon}><FaPhoneAlt /></div>
            <h3>الهاتف</h3>
            <p>09-2574785</p>
          </div>
          <div className={styles.contactItem}>
            <div className={styles.icon}><FaEnvelope /></div>
            <h3>البريد الإلكتروني</h3>
            <p>anabta.gov@gmail.com</p>
          </div>
          <div className={styles.contactItem}>
            <div className={styles.icon}><FaMapMarkerAlt /></div>
            <h3>العنوان</h3>
            <p>عنبتا - محافظة طولكرم</p>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© 2025 بلدية عنبتا. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;

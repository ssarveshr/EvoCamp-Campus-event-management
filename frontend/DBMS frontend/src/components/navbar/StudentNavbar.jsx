import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./StudentNavbar.module.css";

const StudentNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <h1>Student Portal</h1>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/event" 
            className={({ isActive }) => isActive ? styles.active : ""}
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/registered" 
            className={({ isActive }) => isActive ? styles.active : ""}
          >
            Registered
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => isActive ? styles.active : ""}
          >
            Calendar
          </NavLink>
        </li>
      </ul>

      <div className={styles.profileSection}>
        <span>Welcome, Student</span>
        <button className={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

export default StudentNavbar;
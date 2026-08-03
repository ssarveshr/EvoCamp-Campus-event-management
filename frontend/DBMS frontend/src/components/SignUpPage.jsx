import React, { useState } from "react";
import styles from "./SignupPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner.jsx";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const HandlerFunction = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    const Data = {
      email: email,
      password: password,
      role: userType,
      RoleData: {
        name: name,
      },
    };
    console.log(Data);
    setLoading(true);
    axios
      .post("http://localhost:5000/api/signup", Data)
      .then((res) => {
        console.log(res);
        setLoading(false);
        toast.success("Login successful");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.warning(err.response?.data?.message || "Registration failed");
      });
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.black}>
        <div className={styles.loginPageChild}>
          <div className={styles.welcomeToStudentContainer}>
            <p className={styles.login1}>
              <b className={styles.welcomeTo1}>Create your</b>
            </p>
            <p className={styles.studentPortal}>student account</p>
          </div>
        </div>
        <div>
          <img
            className={styles.unionIcon}
            alt="Union Icon"
            src="/union-1.svg"
          />
          <img
            className={styles.unionIcon1}
            alt="Union Icon 1"
            src="/union-2.svg"
          />
          <img
            className={styles.unionIcon2}
            alt="Union Icon 2"
            src="/union-3.svg"
          />
          <img className={styles.student} src="/cuate.svg" alt="Student" />
        </div>
        {Loading && <Spinner />}
        <div className={styles.loginBox}>
          <div className={styles.loginEnterYourContainer}>
            <p className={styles.login}>
              <b>
                <i>Sign Up</i>
              </b>
            </p>
            <b></b>
            <div className={styles.loginLink}>
              Already have an account?
              <span onClick={() => navigate("/login")} className="spanlogin">
                {" "}
                Login here
              </span>
            </div>
            <select
              className={styles.inputField1}
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="" disabled>
                Role
              </option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="organizer">Organiser</option>
            </select>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.inputField}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className={styles.loginButton} onClick={HandlerFunction}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

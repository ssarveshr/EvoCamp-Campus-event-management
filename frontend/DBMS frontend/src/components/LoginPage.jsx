import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner.jsx";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [UserType, setUserType] = useState("");
  const navigate = useNavigate();

  const HandlerFunction = () => {
    const Data = {
      email,
      password,
    };

    if (Data.email === "" && Data.password === "") {
      toast.warning("Credentials are empty");
    }

    console.log(Data);
    setLoading(true);
    axios
      .post("http://localhost:5000/api/login", Data)
      .then((res) => {
        const token = res.data.Token;
        const payload = jwtDecode(token);
        // console.log(payload);
        if (payload.User_Email === email) {
          sessionStorage.setItem("userAuth", token);
          setLoading(false);
          // const role = payload.Role;
          // console.log(role);
          toast.success("login successfull");
          navigate("/");
        } else {
          toast.warning("Invalid credentials");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("login failed due incorrect credentials" || err);
        setLoading(false);
      });
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.black}>
        <div className={styles.loginPageChild}>
          <div className={styles.welcomeToStudentContainer}>
            <p className={styles.login}>
              <b className={styles.welcomeTo1}>Welcome</b>
            </p>
            {/* <p className={styles.studentPortal}>student portal</p> */}
          </div>
        </div>
        <div>
          <p>
            <img
              className={styles.unionIcon}
              alt="Union Icon"
              src="/union-1.svg"
            />
          </p>
          <p>
            <img
              className={styles.unionIcon1}
              alt="Union Icon 1"
              src="/union-2.svg"
            />
          </p>
          <p>
            <img
              className={styles.unionIcon2}
              alt="Union Icon 2"
              src="/union-3.svg"
            />
          </p>
          <img
            className={styles.student}
            src="../studentplug.svg"
            alt="Student "
          />
        </div>
        {Loading ? <Spinner /> : ""}
        <div className={styles.loginBox}>
          {/* <div className={styles.password}>Password</div>
				<label className={styles.label}>Password</label>
				<input
  					type="password"
  					className={styles.inputField}
  					placeholder="Enter your password"
				/> */}

          {/* <img className={styles.loginPageItem} alt="" src="Group 3.svg" /> */}
          <div className={styles.loginEnterYourContainer}>
            <p className={styles.login}>
              <b>Login</b>
              <b></b>
            </p>
            <p className={styles.enterYourAccount}>
              Don't have an account?
              <span onClick={() => navigate("/signup")} className="spanlogin">
                {" "}
                Signup
              </span>
            </p>
            {/* <img className={styles.loginPageInner} alt="" src="Line 1.svg" />
        				<img className={styles.lineIcon} alt="" src="Line 2.svg" /> */}
            {/* <div className={styles.username}>Username</div> */}

            {/* Dropdown for Role Selection */}
            {/* <select
              className={styles.inputfield}
              value={UserType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="organiser">Organiser</option>
            </select> */}
            <label className={styles.label}>Email</label>
            <input
              type="Email"
              className={styles.inputField}
              placeholder="Enter your Email"
              onChange={(information) => {
                setEmail(information.target.value);
              }}
            />
            {/* <div className={styles.password}>Password</div> */}
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.inputField}
              placeholder="Enter your password"
              onChange={(information) => {
                setPassword(information.target.value);
              }}
            />

            <div className={styles.forgotPassword}>
              <br></br>Forgot Password?
            </div>
            <button className={styles.loginButton} onClick={HandlerFunction}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

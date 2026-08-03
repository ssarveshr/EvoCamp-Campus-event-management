import React, { useState } from "react";
import styles from "./LoginOrganiser.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner.jsx";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [Loading, setLoading] = useState(false)
    const [UserType, setUserType] = useState("");
	const navigate = useNavigate()

	const HandlerFunction = () => {
         if (!UserType) {
      toast.warning("Please select a role before proceeding.");
      return;
    }
		const Data = {
			email,
			password,
      UserType
		}
		console.log(Data)
		setLoading(true)
		axios
      .post(`http://localhost:5000/api/auth/login` , Data)
		  .then(res => {
        const token = res.data.token;
        const payload= jwtDecode(token);
        if(payload.User_email == email){
          sessionStorage.setItem('userAuth' , token)
          setLoading(false)
          Nav('/dashboard')
           // Role-based navigation logic
          if (UserType === "Student") {
            // Stay on the same page for Student
            console.log("Logged in as Student");
          } else if (UserType === "Faculty") {
            Nav("/loginfaculty"); // Redirect to Faculty Login
          } else if (UserType === "Organiser") {
            Nav("/signupfaculty"); // Redirect to Admin Login
          }
        }
        else{
          toast.error("Invalid Credentials")
          setLoading(false)
        }
		  })
		  .catch(err => {
			console.log(err)
			setLoading(false) 
		}
	);
	}
  return (
    <div className={styles.loginPage}>
      <div className={styles.black}>
        <div className={styles.loginPageChild}>
          <div className={styles.welcomeToStudentContainer}>
            <p className={styles.login}>
              <b className={styles.welcomeTo1}>Welcome to</b>
            </p>
            <p className={styles.studentPortal}>organiser portal</p>
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
            src="../faculty2.svg"
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
            {/* <p className={styles.enterYourAccount}>
              Don't have an account?
              <span onClick={() => navigate('/signupfaculty')} className="spanlogin">  Signup</span>
            </p> */}
            {/* <img className={styles.loginPageInner} alt="" src="Line 1.svg" />
        				<img className={styles.lineIcon} alt="" src="Line 2.svg" /> */}
            {/* <div className={styles.username}>Username</div> */}
            
            {/* Dropdown for Role Selection */}
            <select
             className={styles.inputfield}
             value={UserType}
             onChange={(e) => setUserType(e.target.value)}
            >
               <option value="" disabled>Select Role</option>
               <option value="Student">Student</option>
               <option value="Faculty">Faculty</option>
               <option value="Admin">Organiser</option>
            </select>
            <label className={styles.label}>Email</label>
            <input
              type="Email"
              className={styles.inputField}
              placeholder="Enter your Email"
              onChange={(information) => {
                setEmail(information.target.value);
              }}
            />
             {/* unique id to recognise teachers */}
             <label className={styles.label}>UID</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Enter your unique ID"
              onChange={(information) => {
                setUID(information.target.value);
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
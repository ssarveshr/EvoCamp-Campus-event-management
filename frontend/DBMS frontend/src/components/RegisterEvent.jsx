import React, { useEffect, useState } from "react";
import styles from "./RegisterEvent.module.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const RegisterEvent = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [email, setemail] = useState("");
  const [branch, setBranch] = useState("");
  // const [semester, setSemester] = useState("");
  const [eventName, setEventName] = useState(location.state?.eventName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventSuggestions, setEventSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [token, setToken] = useState("");
  const nav = useNavigate();
  // console.log('This is the value of : ',location.state?.eventName)

  // Branch options
  const branchOptions = [
    "Computer Science and Engineering",
    "Information Science and Engineering",
    "Electronics and Communication",
    "Electrical and Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
    "Aerospace Engineering",
    "Biotechnology",
  ];

  useEffect(() => {
    const TOKEN = sessionStorage.getItem("userAuth");
    // console.log(TOKEN)

    if (TOKEN === null || TOKEN === undefined) {
      nav("/login");
      toast.error("You must me Loged in as student to register to an event");
      return;
    }
    const payload = jwtDecode(TOKEN);
    console.log(payload);

    setemail(payload.User_Email);
    setToken(TOKEN);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: name,
      email: email,
      eventname: eventName,
      branchname: branch,
      // semester,
    };

    console.log("Form Data:", formData);

    // Simulate API call

    axios
      .post("http://localhost:5000/api/auth/Student/register-event", formData, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        console.log(result.data);
        toast.success("Registration successful!");
        setName("");
        setBranch("");
        setEventName("");
        nav("/event");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        toast.error("Registration failed!!! May be you are not the student");
        setIsSubmitting(false);
      });
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Register for Event</h1>
        <p>Fill in your details to participate in the event</p>
      </header>

      <section className={styles.registrationSection}>
        <div className={styles.formCard}>
          <h2>Event Registration Form for {eventName}</h2>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Student Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="usn">Student USN</label>
              <input
                type="text"
                id="usn"
                name="usn"
                placeholder="Enter your USN (e.g., 1XX21XXYYY)"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="branch">Branch</label>
                <select
                  id="branch"
                  name="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Select your branch</option>
                  {branchOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div className={styles.formGroup}>
              <label htmlFor="eventName">Event Name</label>
              <div className={styles.suggestionContainer}>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  placeholder="Search for events"
                  value={eventName}
                  onChange={handleEventSearch}
                  onFocus={() => eventName.trim() !== "" && setShowSuggestions(true)}
                  required
                  className={styles.formInput}
                />
                {showSuggestions && eventSuggestions.length > 0 && (
                  <ul className={styles.suggestionsList}>
                    {eventSuggestions.map((event, index) => (
                      <li 
                        key={index} 
                        onClick={() => selectEvent(event)}
                        className={styles.suggestionItem}
                      >
                        {event}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div> */}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Now"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterEvent;

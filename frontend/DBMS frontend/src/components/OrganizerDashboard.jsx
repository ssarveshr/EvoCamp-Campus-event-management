// import React, { useEffect, useState } from "react";
// import styles from "./OrganizerDashboard.module.css";

// import { Navigate, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// const OrganizerDashboard = () => {
//   const navigate = useNavigate();
//   const [organizationInfo, setorganizationInfo] = useState({});
//   const [registeredStudentInfo, setregisteredStudentInfo] = useState([]);
//   const [registeredStudentNumber, setregisteredStudentNumber] = useState(0);
//   const [facultyMembers, setfacultyMembers] = useState([]);
//   const handleAddEvent = () => {
//     navigate("/createevent");
//   };
//   // Sample data - replace with your actual data or state management
//   useEffect(() => {
//     const token = sessionStorage.getItem("userAuth");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log(decoded);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//     axios
//       .get("http://localhost:5000/api/auth/Organiser/current", {
//         headers: {
//           Authorization: token,
//         },
//       })
//       .then((res) => {
//         console.log('This is the first axios : ',res.data);
//         setorganizationInfo(res.data);
//       })
//       .catch((err) => console.error(err));

//     axios
//       .get("http://localhost:5000/api/auth/Organiser/registerstudents", {
//         headers: {
//           Authorization: token,
//         },
//       })
//       .then((res) => {
//         console.log(res.data);
//         setregisteredStudentInfo(res.data.RegisteredStudents);
//         setregisteredStudentNumber(res.data.TotalRegisteration);
//       })
//       .catch((err) => console.error(err));
//   }, []);
//   // console.log('This is the organizationInfo : ',organizationInfo?.organizerInfo?.orgname)

//   return (
//     <div className={styles.dashboardContainer}>
//       {/* Header Section */}
//       <header className={styles.header}>
//         <h1>Event Organizer Dashboard</h1>
//         <div className={styles.orgInfo}>
//           <h2>{organizationInfo?.organizerInfo?.orgname}</h2>
//           <p>
//             Contact: {organizationInfo.contact} | {organizationInfo?.email} |{" "}
//             {organizationInfo.phone}
//           </p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className={styles.mainContent}>
//         {/* Event Details Section */}
//         <section className={styles.eventSection}>
//           <h2>Current Event</h2>
//           <h2>Total Number of Registration : {registeredStudentNumber}</h2>
//           {registeredStudentInfo.map((item) => (
//             <div className={styles.eventCard}>
//               <h3>{item.studentInfo.name}</h3>
//               <p>
//                 <strong>Email: </strong> {item.email}
//               </p>
//             </div>
//           ))}
//         </section>

//         {/* Faculty Section */}
//         <section className={styles.facultySection}>
//           <div className={styles.sectionHeader}>
//             <h2>Faculty Assigned</h2>
//             <button className={styles.addButton} onClick={handleAddEvent}>
//               + Add Event
//             </button>
//           </div>
//           <div className={styles.facultyGrid}>
//             {facultyMembers.map((faculty) => (
//               <div key={faculty.id} className={styles.facultyCard}>
//                 <div className={styles.facultyAvatar}>
//                   {faculty.name.charAt(0)}
//                 </div>
//                 <h3>{faculty.name}</h3>
//                 <p>
//                   <strong>Role:</strong> {faculty.role}
//                 </p>
//                 <p>
//                   <strong>Contact:</strong> {faculty.contact}
//                 </p>
//                 <p>
//                   <strong>Sessions:</strong> {faculty.sessions}
//                 </p>
//                 <div className={styles.facultyActions}>
//                   <button className={styles.actionButton}>Edit</button>
//                   <button className={styles.actionButton}>Message</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default OrganizerDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./OrganizerDashboard.module.css";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  // Fetch logged-in organizer info
  const fetchOrganizer = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/Organiser/current",
        { headers: { Authorization: token } }
      );
      setOrganizer(res.data);
    } catch (err) {
      console.error("Error fetching organizer info:", err);
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("userAuth");
    if (token) {
      fetchOrganizer(token);
      fetchEvents();
    }
  }, []);

  // Filter events for logged-in organizer
  useEffect(() => {
    if (organizer && events.length > 0) {
      const filtered = events.filter(
        (event) => event.organiserName === organizer.organizerInfo?.orgname
      );
      setMyEvents(filtered);
    }
  }, [organizer, events]);

  const handleAddEvent = () => {
    navigate("/createevent");
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>My Events</h1>
        <div className={styles.orgInfo}>
          <h2>{organizer?.organizerInfo?.orgname || "Organizer Name"}</h2>
          <p>{organizer?.email || "N/A"}</p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.eventSection}>
          <div className={styles.sectionHeader}>
            <h2>Your Events</h2>
            <button className={styles.addButton} onClick={handleAddEvent}>
              + Add Event
            </button>
          </div>

          <div className={styles.eventsGrid}>
            {myEvents.length > 0 ? (
              myEvents.map((event) => (
                <div
                  key={event._id}
                  className={styles.eventCard}
                  onClick={() => handleEventClick(event._id)}
                >
                  <div className={styles.eventImage}>
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className={styles.eventContent}>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Registrations:</strong>{" "}
                      {event.registeredStudents?.length || 0}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No events created yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrganizerDashboard;









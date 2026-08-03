import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EventDetails.module.css";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);

  // Fetch event details including registered students
  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
      setRegisteredStudents(res.data.registeredStudents || []);
    } catch (err) {
      console.error("Error fetching event details:", err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  return (
    <div className={styles.detailsContainer}>
      {event ? (
        <>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.date).toLocaleDateString()}
          </p>

          <h2>Registered Students</h2>
          {registeredStudents.length > 0 ? (
            <ul className={styles.studentList}>
              {registeredStudents.map((student, index) => (
                <li key={index}>
                  {student.studentInfo?.name || "Unknown"} - {student.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No students registered for this event.</p>
          )}
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
};

export default EventDetails;

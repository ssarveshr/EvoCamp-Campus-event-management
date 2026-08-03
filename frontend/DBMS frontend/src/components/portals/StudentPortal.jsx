import React, { useState, useEffect } from "react";
import styles from "./StudentPortal.module.css";
import styles1 from "../CreateEvent.module.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const StudentDashboard = () => {
  const [student, setStudent] = useState({
    name: "",
    usn: "",
    email: "",
    image: "",
  });

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    usn: "",
    email: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get user info from token
    const token = sessionStorage.getItem("userAuth");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.Role.toLowerCase() === "student") {
          // In a real app, you would fetch student details from an API
          // For now we're using placeholder data with the email from token
          axios
            .get("http://localhost:5000/api/auth/Student/current", {
              headers: {
                Authorization: token,
              },
            })
            .then((res) => {
              if (!res) {
                console.error("Error fetching student details:", res);
                return;
              }
              // console.log('This is the value of result from the axios request : ',res)
              const Info = res.data;
              setStudent({
                name: Info.studentInfo.name || "",
                email: Info.email || "",
                usn: Info.studentInfo.usn || "",
                image: Info.image || "",
              });
            })
            .catch((err) => {
              console.log("Api failed to fetch data : ", err);
            });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("userAuth");
    if (!token) {
      console.log("Counldn't get token");
    }
    try {
      axios
        .get("http://localhost:5000/api/auth/Student/my-events", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log("This is the value of result : ", res.data);
          setTimeout(() => {
            setRegisteredEvents(res.data);
            setLoading(false);
          }, 500);
        })
        .catch((err) => {
          console.log("This is the error from the get request : ", err);
        });

      // Simulate API delay
    } catch (error) {
      console.error("Error fetching registered events:", error);
      setLoading(false);
    }
  };

  const handleViewDetails = (eventId) => {
    window.location.href = `/event/${eventId}`;
  };

  const handleCancelRegistration = async (eventId) => {
  const token = sessionStorage.getItem("userAuth");
  if (!token) {
    console.error("User is not authenticated.");
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/auth/Student/cancel-registration/${eventId}`, {
      headers: {
        Authorization: token,
      },
    });

    // Remove event from UI
    setRegisteredEvents(
      registeredEvents.filter((event) => event.event.id !== eventId)
    );
  } catch (error) {
    console.error("Error cancelling registration:", error);
  }
};


  // --- Unified Edit Profile Logic ---
  const handleEditProfileClick = () => {
    setEditData({ ...student });
    setSelectedFile(null);
    setIsEditing(true);
    setError("");
    setSuccess(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
    setSuccess(false);
    // Optionally show preview
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditData((prev) => ({
          ...prev,
          image: ev.target.result,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setError("");
    setSuccess(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess(false);

    const token = sessionStorage.getItem("userAuth");
    if (!token) {
      setError("You are not logged in!");
      setUploading(false);
      return;
    }

    let imageUrl = editData.image;

    try {
      // If a new file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadRes.data.url;
      }

      // Update profile with all fields
      await axios.put(
        "http://localhost:5000/api/auth/Student/update-profile",
        {
          name: editData.name,
          usn: editData.usn,
          email: editData.email,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      setStudent({
        name: editData.name,
        usn: editData.usn,
        email: editData.email,
        image: imageUrl,
      });
      setSuccess(true);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  // --- End Unified Edit Profile Logic ---

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.dashboardContent}>
        <section className={styles.profileSection}>
          <h2>My Profile</h2>

          <div className={styles.profileCard}>
            <div className={styles.profilePhoto}>
              <img
                src={isEditing ? editData.image : student.image}
                alt="Student"
              />
            </div>

            <div className={styles.profileDetails}>
              {isEditing ? (
                <form
                  className={styles.formGroup}
                  onSubmit={handleSaveProfile}
                  style={{ marginTop: "1rem" }}
                >
                  <div className={styles.formRow}>
                    <label className={styles.detailLabel}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label className={styles.detailLabel}>USN</label>
                    <input
                      type="text"
                      name="usn"
                      value={editData.usn}
                      onChange={handleEditChange}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label className={styles.detailLabel}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <label className={styles.detailLabel}>Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.saveProfileBtn}
                      disabled={uploading}
                    >
                      {uploading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className={styles.cancelProfileBtn}
                      onClick={handleCancelEdit}
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                  </div>
                  {error && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div style={{ color: "green", marginTop: "0.5rem" }}>
                      Profile updated successfully!
                    </div>
                  )}
                </form>
              ) : (
                <>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Name</span>
                    <span className={styles.detailValue}>{student.name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>USN</span>
                    <span className={styles.detailValue}>{student.usn}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>{student.email}</span>
                  </div>
                  <button
                    className={styles.editProfileBtn}
                    onClick={handleEditProfileClick}
                  >
                    Edit Profile
                  </button>
                  {success && (
                    <div style={{ color: "green", marginTop: "0.5rem" }}>
                      Profile updated successfully!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <section className={styles.eventsSection}>
          <h2>My Registered Events</h2>

          {loading ? (
            <div className={styles.loadingMessage}>Loading your events...</div>
          ) : registeredEvents.length === 0 ? (
            <div className={styles.noEventsMessage}>
              <p>You haven't registered for any events yet.</p>
              <a href="/event" className={styles.browseEventsBtn}>
                Browse Events
              </a>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {registeredEvents.map((event) => (
                <div key={event.event.id} className={styles.eventCard}>
                  <div className={styles.cardImage}>
                    <img src={event.event.image} alt={event.event.title} />
                  </div>

                  <div className={styles.cardContent}>
                    <h3>{event.event.eventName}</h3>
                    <p className={styles.eventDate}>{event.event.date}</p>
                    {/* <p className={styles.eventTime}>{event.event.time}</p> */}
                    <p className={styles.eventLocation}>{event.event.loca}</p>
                    <p className={styles.description}>{event.event.desc}</p>

                    <div className={styles.cardActions}>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => handleViewDetails(event.event.id)}
                      >
                        View Details
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancelRegistration(event.event.id)}
                      >
                        Cancel Registration
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;

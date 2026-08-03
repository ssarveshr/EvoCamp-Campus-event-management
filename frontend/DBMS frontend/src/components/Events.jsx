import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Events.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const Events = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loadingRegistration, setLoadingRegistration] = useState(false);

  const GetToken = () => {
    const token = sessionStorage.getItem("userAuth");
    if (token) {
      setToken(token);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.error(err));
    GetToken();
  }, []);

  // Fetch current student info when token is available
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/Student/current", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setCurrentStudent(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          setCurrentStudent(null);
          console.log("Error fetching student data:", err);
        });
    }
  }, [token]);

  // Get selected event if eventId is provided
  const selectedEvent = eventId
    ? events.find((event) => String(event._id) === String(eventId))
    : null;

  // Check if the current student is registered for the selected event
  // useEffect(() => {
  //   if (selectedEvent && currentStudent) {
  //     setLoadingRegistration(true);
  //     // registeredStudents is an array of student objects, not IDs
  //     const registered =
  //       Array.isArray(selectedEvent.registeredStudents) &&
  //       selectedEvent.registeredStudents.some((student) =>
  //         // student &&
  //         // student._id &&
  //         String(student._id) === String(currentStudent._id)
  //         // console.log(
  //         //     String(student._id) === String(currentStudent._id)
  //         // )
  //       );
  //     setIsRegistered(registered);
  //     setLoadingRegistration(false);
  //   } else {
  //     setIsRegistered(false);
  //   }
  // }, [selectedEvent, currentStudent]);

  const footerRef = useRef(null);

  const handleContactScroll = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEventDetails = (id) => {
    console.log("This is the events : ", id);
    navigate(`/event/${id}`);
  };

  const handleReturnToAllEvents = () => {
    navigate("/event");
  };

  // Redirect functions for navigation
  const handleHomeRedirect = () => {
    navigate("/");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleAboutRedirect = () => {
    navigate("/about");
  };

  const searchchange = (search) => {
    // console.log('This is the value of search box : ',search)
    setsearch(search);
  };

  const searchHandle = () => {
    // Implement search functionality here
    if (!search) {
      toast.warning("Please enter a search term!");
      return false;
    }
    const searchedEvents = [];

    events.map((event) => {
      if (event.title.toLowerCase().includes(search.toLowerCase())) {
        // console.log("This is the value of event title : ", event.title);
        searchedEvents.push(event);
      }
    });

    setEvents(searchedEvents);
    console.log("Search handle called");
  };

  const handleRegisterRedirect = () => {
    console.log("this is the value selected : ", selectedEvent?.title);
    // If you want to carry the chosen event along, pass it in state
    navigate("/registerevent", {
      state: { eventName: selectedEvent?.title || "" },
    });
  };
  // Format ISO Date to readable format
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format ISO Date to readable Time
  const formatTime = (isoDate) => {
    if (!isoDate) return "N/A";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}

      {/* Main Content */}
      <main className={styles.mainContent}>
        {selectedEvent ? (
          /* Single Event Detail View */
          <section className={styles.eventDetailSection}>
            <div className={styles.eventDetailHeader}>
              <button
                className={styles.backButton}
                onClick={handleReturnToAllEvents}
              >
                &larr; Back to All Events
              </button>
              <h1>{selectedEvent.title}</h1>
            </div>

            <div className={styles.eventDetailContent}>
              <div className={styles.eventDetailImage}>
                <img src={selectedEvent.image} alt={selectedEvent.title} />
                {selectedEvent.is_ongoing && (
                  <div className={styles.liveTag}>LIVE</div>
                )}
              </div>

              <div className={styles.eventDetailInfo}>
                <div className={styles.detailCard}>
                  <h3>Event Details</h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Time:</span>
                    <span>{formatTime(selectedEvent.date)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Location:</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Organizer:</span>
                    <span>{selectedEvent.organiserName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Contact:</span>
                    <span>{selectedEvent.email}</span>
                  </div>
                </div>

                <div className={styles.registerCard}>
                  <button
                    className={styles.registerBtn}
                    onClick={handleRegisterRedirect}
                    disabled={isRegistered || loadingRegistration}
                  >
                    {loadingRegistration
                      ? "Checking..."
                      : isRegistered
                      ? "Already Registered"
                      : "Register Now"}
                  </button>
                  <button className={styles.saveBtn}>Save to Calendar</button>
                  <div className={styles.shareOptions}>
                    <span>Share: </span>
                    <div className={styles.socialIcons}>
                      <a href="#" aria-label="Share on Facebook">
                        FB
                      </a>
                      <a href="#" aria-label="Share on Twitter">
                        TW
                      </a>
                      <a href="#" aria-label="Share on LinkedIn">
                        LI
                      </a>
                      <a href="#" aria-label="Share via Email">
                        @
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.eventDescription}>
                <h3>About This Event</h3>
                <p>{selectedEvent.description}</p>
              </div>
            </div>
          </section>
        ) : (
          /* All Events View */
          <section className={styles.allEventsSection}>
            <div className={styles.sectionHeader}>
              <h1>All Campus Events</h1>
              <div className={styles.eventFilters}>
                {/* <select className={styles.filterDropdown} defaultValue="">
                  <option value="" disabled>
                    Filter by Category
                  </option>
                  <option value="all">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="cultural">Cultural</option>
                  <option value="career">Career</option>
                  <option value="sports">Sports</option>
                </select>
                <select className={styles.filterDropdown} defaultValue="">
                  <option value="" disabled>
                    Sort by Date
                  </option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select> */}
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search events..."
                    onChange={(e) => searchchange(e.target.value)}
                  />
                  <button className={styles.searchBtn} onClick={searchHandle}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.eventsGrid}>
              {events.map((event) => (
                <div key={event._id} className={styles.eventCard}>
                  <div className={styles.cardImage}>
                    {/* {console.log(event.image)} */}
                    <img src={event.image} alt={event.title} />
                    {event.is_ongoing && (
                      <div className={styles.liveTag}>LIVE</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventDate}>{formatDate(event.date)}</p>
                    <p className={styles.eventTime}>{formatTime(event.date)}</p>
                    <p className={styles.eventLocation}>{event.location}</p>
                    <p className={styles.eventBrief}>
                      {event.description.length > 120
                        ? `${event.description.substring(0, 120)}...`
                        : event.description}
                    </p>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => handleEventDetails(event._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>
                1
              </button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>3</button>
              <button className={styles.pageBtn}>Next &rarr;</button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
    </div>
  );
};

export default Events;

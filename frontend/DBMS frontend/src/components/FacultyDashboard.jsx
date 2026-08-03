import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FacultyDashboard.module.css";

const FacultyDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processedEvents, setProcessedEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem("userAuth");
    
    axios
      .get("http://localhost:5000/api/auth/Faculty/", {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.data.length) {
          setEvents(res.data);
        } else {
          setEvents([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      });
  };

  const handleApprove = (event) => {
    setLoading(true);
    const token = sessionStorage.getItem("userAuth");
    
    axios
      .put(
        "http://localhost:5000/api/auth/Faculty/approve-event",
        {
          organiserName: event.organiserName,
          title: event.title,
          facultyName: event.facultyName,
        },
        { headers: { Authorization: token } }
      )
      .then(() => {
        // Instead of removing the event, mark it as approved
        setEvents((prev) => 
          prev.map((e) => 
            e._id === event._id ? { ...e, status: "approved" } : e
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to approve event. Please try again.");
        setLoading(false);
      });
  };

  const handleDeny = (event) => {
    setLoading(true);
    const token = sessionStorage.getItem("userAuth");
    
    axios
      .delete("http://localhost:5000/api/auth/Faculty/deny-event", {
        headers: { Authorization: token },
        data: {
          organiserName: event.organiserName,
          title: event.title,
          facultyName: event.facultyName,
        },
      })
      .then(() => {
        // Instead of removing the event, mark it as denied
        setEvents((prev) => 
          prev.map((e) => 
            e._id === event._id ? { ...e, status: "denied" } : e
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to deny event. Please try again.");
        setLoading(false);
      });
  };

  // Process events based on filters
  useEffect(() => {
    const filtered = events.filter(event => {
      // Filter by search query
      const matchesSearch = 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.organiserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.facultyName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter if needed
      if (filterStatus === "all") {
        return matchesSearch;
      } else if (filterStatus === "pending") {
        return matchesSearch && (!event.status || event.status === "pending");
      } else if (filterStatus === "approved") {
        return matchesSearch && event.status === "approved";
      } else if (filterStatus === "denied") {
        return matchesSearch && event.status === "denied";
      }
      
      return matchesSearch;
    });

    // Sort events: pending first, then approved, then denied
    const sorted = [...filtered].sort((a, b) => {
      const statusOrder = { pending: 0, undefined: 0, approved: 1, denied: 2 };
      const statusA = a.status || "pending";
      const statusB = b.status || "pending";
      
      return statusOrder[statusA] - statusOrder[statusB];
    });

    setProcessedEvents(sorted);
  }, [events, searchQuery, filterStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Faculty Dashboard</h1>
        <p className={styles.dashboardSubtitle}>Manage and approve event requests</p>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search events..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.filterContainer}>
          <select 
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
          
          <button className={styles.refreshButton} onClick={fetchEvents}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
              <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div className={styles.eventsContainer}>
          {processedEvents.length === 0 ? (
            <div className={styles.noEvents}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
              <p>No events found</p>
              <button className={styles.refreshButton} onClick={fetchEvents}>
                Refresh
              </button>
            </div>
          ) : (
            processedEvents.map((event) => {
              const isPending = !event.status || event.status === "pending";
              const isApproved = event.status === "approved";
              const isDenied = event.status === "denied";
              
              return (
                <div 
                  key={event._id} 
                  className={`${styles.card} ${isApproved ? styles.approvedEvent : ''} ${isDenied ? styles.deniedEvent : ''}`}
                >
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{event.title}</h2>
                    <span className={`${styles.cardBadge} ${
                      isPending ? styles.pendingBadge : 
                      isApproved ? styles.approvedBadge : 
                      styles.deniedBadge
                    }`}>
                      {isPending ? "Pending" : isApproved ? "Approved" : "Denied"}
                    </span>
                  </div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.cardInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Organizer:</span>
                        <span className={styles.infoValue}>{event.organiserName}</span>
                      </div>
                      
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Faculty:</span>
                        <span className={styles.infoValue}>{event.facultyName}</span>
                      </div>
                      
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Date:</span>
                        <span className={styles.infoValue}>
                          {formatDate(event.date)}
                        </span>
                      </div>
                      
                      {event.location && (
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>Location:</span>
                          <span className={styles.infoValue}>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {isPending && (
                      <div className={styles.buttonGroup}>
                        <button 
                          className={styles.approveButton}
                          onClick={() => handleApprove(event)}
                        >
                          Approve
                        </button>
                        <button 
                          className={styles.denyButton}
                          onClick={() => handleDeny(event)}
                        >
                          Deny
                        </button>
                      </div>
                    )}
                    
                    {!isPending && (
                      <div className={styles.statusInfo}>
                        <div className={styles.statusIcon}>
                          {isApproved ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                          )}
                        </div>
                        <span className={styles.statusText}>
                          {isApproved ? "This event has been approved" : "This event has been denied"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
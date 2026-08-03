import { useState, useEffect, useRef } from "react";
import styles from "./HomePage.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const footerRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleContactScroll = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();

  // Navigation functions
  const handleLoginRedirect = () => navigate("/login");
  const handleSignupRedirect = () => navigate("/signup");
  const handleCalenderRedirect = () => navigate("/calendar");
  const handleAboutRedirect = () => navigate("/about");
  const handleEventRedirect = () => navigate("/event");

  // Get ongoing event and upcoming events
  const ongoingEvent = events.find((event) => event.isOngoing);
  const upcomingEvents = events.filter((event) => !event.isOngoing);

  // Format date and time function
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return "";

    try {
      // Create date object from date string
      const date = new Date(dateStr);

      // Format date
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Format time if available
      const formattedTime = timeStr
        ? new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "";

      return formattedTime
        ? `${formattedDate} • ${formattedTime}`
        : formattedDate;
    } catch (error) {
      console.error("Error formatting date/time:", error);
      return `${dateStr} ${timeStr ? `• ${timeStr}` : ""}`;
    }
  };

  // Carousel functionality
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const autoScrollTimerRef = useRef(null);

  // Function to handle manual scroll with buttons
  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;

    // Stop auto-scrolling when manual control is used
    pauseAutoScroll();

    const container = scrollContainerRef.current;
    const scrollAmount = 320; // Approximate card width + margin

    // Calculate new scroll position
    const newPosition =
      direction === "left"
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            container.scrollLeft + scrollAmount
          );

    // Apply smooth scroll
    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    // Update current position for tracking
    setCurrentScrollPosition(newPosition);

    // Restart auto-scroll after a delay
    setTimeout(() => {
      if (!isUserInteracting) {
        resumeAutoScroll();
      }
    }, 5000);
  };

  // Auto-scroll control
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const pauseAutoScroll = () => {
    setIsAutoScrolling(false);
    clearInterval(autoScrollTimerRef.current);
  };

  const resumeAutoScroll = () => {
    if (!isUserInteracting) {
      setIsAutoScrolling(true);
    }
  };

  // Initialize auto-scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Clear any existing interval
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    // Only set up auto-scroll if enabled
    if (isAutoScrolling) {
      autoScrollTimerRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) return;

        let newPosition = container.scrollLeft + 1;

        // Reset when reaching the end
        if (newPosition >= maxScroll) {
          newPosition = 0;
        }

        container.scrollLeft = newPosition;
        setCurrentScrollPosition(newPosition);
      }, 30);
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling]);

  // Handle user interaction with carousel
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleMouseEnter = () => {
      setIsUserInteracting(true);
      pauseAutoScroll();
    };

    const handleMouseLeave = () => {
      setIsUserInteracting(false);
      resumeAutoScroll();
    };

    const handleTouchStart = () => {
      setIsUserInteracting(true);
      pauseAutoScroll();
    };

    const handleTouchEnd = () => {
      setIsUserInteracting(false);
      // Delay resuming to prevent immediate scrolling after touch
      setTimeout(resumeAutoScroll, 3000);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("touchstart", handleTouchStart);
    scrollContainer.addEventListener("touchend", handleTouchEnd);

    // Clean up event listeners
    return () => {
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("touchstart", handleTouchStart);
      scrollContainer.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Calculate active dot index
  const calculateActiveDotIndex = () => {
    if (!scrollContainerRef.current) return 0;

    const container = scrollContainerRef.current;
    const cardWidth = 320; // Approximate width of cards including margins
    const visibleCards = Math.floor(container.clientWidth / cardWidth);
    const totalGroups = Math.ceil(upcomingEvents.length / visibleCards);

    if (totalGroups <= 1) return 0;

    const scrollPercentage =
      container.scrollLeft / (container.scrollWidth - container.clientWidth);
    return Math.min(
      Math.floor(scrollPercentage * totalGroups),
      totalGroups - 1
    );
  };

  const activeDotIndex = calculateActiveDotIndex();

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Featured Ongoing Event */}
        {ongoingEvent && (
          <section className={styles.ongoingEventSection}>
            <h2 className={styles.sectionTitle}>Happening Now</h2>
            <div className={styles.ongoingEvent}>
              <div className={styles.eventImage}>
                <img src={ongoingEvent.image} alt={ongoingEvent.title} />
                <div className={styles.liveTag}>LIVE</div>
              </div>
              <div className={styles.eventInfo}>
                <h3>{ongoingEvent.title}</h3>
                <p className={styles.eventDescription}>
                  {ongoingEvent.description}
                </p>
                <div className={styles.eventDetails}>
                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDateTime(ongoingEvent.date, null)}
                  </p>
                  <p>
                    <strong>Time:</strong> {ongoingEvent.time || "All day"}
                  </p>
                  <p>
                    <strong>Location:</strong> {ongoingEvent.location}
                  </p>
                </div>
                <button className={styles.joinBtn}>Join Now</button>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Events Section with Carousel */}
        <section className={styles.upcomingEventsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <div className={styles.viewAllLink}>
              <Link to="/event">View All</Link>
            </div>
          </div>

          <div className={styles.carouselContainer}>
            <div
              ref={scrollContainerRef}
              className={styles.upcomingEventsContainer}
            >
              {upcomingEvents.map((event) => (
                <div key={event._id || event.id} className={styles.eventCard}>
                  <div className={styles.cardImage}>
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventDate}>
                      {formatDateTime(event.date, event.time)}
                    </p>
                    <p className={styles.eventLocation}>{event.location}</p>
                    <Link
                      to={`/event/${event._id || event.id}`}
                      className={styles.detailsBtn}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className={styles.carouselControls}>
              <button
                className={styles.carouselButton}
                onClick={() => handleScroll("left")}
                aria-label="Previous events"
              >
                &lt;
              </button>
              <button
                className={styles.carouselButton}
                onClick={() => handleScroll("right")}
                aria-label="Next events"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Carousel dots indicator */}
          {upcomingEvents.length > 0 && (
            <div className={styles.carouselDots}>
              {[
                ...Array(
                  Math.max(
                    1,
                    Math.ceil(
                      upcomingEvents.length /
                        (scrollContainerRef.current
                          ? Math.floor(
                              scrollContainerRef.current.clientWidth / 320
                            )
                          : 3)
                    )
                  )
                ),
              ].map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${
                    index === activeDotIndex ? styles.activeDot : ""
                  }`}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      // Calculate how many cards are visible
                      const container = scrollContainerRef.current;
                      const cardWidth = 320;
                      const visibleCards = Math.floor(
                        container.clientWidth / cardWidth
                      );

                      // Calculate new position
                      const newPosition = index * cardWidth * visibleCards;

                      // Scroll to position
                      container.scrollTo({
                        left: Math.min(
                          newPosition,
                          container.scrollWidth - container.clientWidth
                        ),
                        behavior: "smooth",
                      });

                      // Pause auto-scroll
                      pauseAutoScroll();

                      // Restart auto-scroll after delay
                      setTimeout(resumeAutoScroll, 5000);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;

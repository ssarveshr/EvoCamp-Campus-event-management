import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Calendar.module.css';
import axios from 'axios';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Plus } from 'lucide-react';

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => {
        setEvents(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load events");
        setIsLoading(false);
      });
      
    // Auto-select today when component mounts
    const today = new Date();
    setSelectedDate(today);
    // We'll set selected events after events are loaded
  }, []);

  // Update selected events when events are loaded or selected date changes
  useEffect(() => {
    if (selectedDate && events.length > 0) {
      setSelectedEvents(getEventsForDate(selectedDate.getDate()));
    }
  }, [selectedDate, events]);

  // Helper functions for date operations
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add cells for days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    return days;
  };

  // Check if a date has any events scheduled
  const hasEvents = (day) => {
    if (!day) return false;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateToCheck = new Date(year, month, day);
    
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === dateToCheck.getDate() &&
        eventDate.getMonth() === dateToCheck.getMonth() &&
        eventDate.getFullYear() === dateToCheck.getFullYear()
      );
    });
  };

  // Get events for a specific date
  const getEventsForDate = (day) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateToCheck = new Date(year, month, day);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === dateToCheck.getDate() &&
        eventDate.getMonth() === dateToCheck.getMonth() &&
        eventDate.getFullYear() === dateToCheck.getFullYear()
      );
    });
  };

  // Check if a day is today
  const isToday = (day) => {
    if (!day) return false;
    
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Handle day selection
  const handleDayClick = (day) => {
    if (!day) return;
    
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedEvents(getEventsForDate(day));
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
    setSelectedEvents(getEventsForDate(today.getDate()));
  };

  // Format date to readable string
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Navigate to event details
  const handleViewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  // Navigate to create event page
  const handleCreateEvent = () => {
    navigate('/create-event', { state: { date: selectedDate }});
  };

  // Get month and year for display
  const monthYear = currentDate.toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
  });

  // Calendar days array
  const calendarDays = generateCalendarDays();

  // Format time from ISO date
  const formatTime = (isoDate) => {
    if (!isoDate) return "N/A";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get category color class
  const getCategoryColorClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'meeting':
        return styles.categoryMeeting;
      case 'appointment':
        return styles.categoryAppointment;
      case 'holiday':
        return styles.categoryHoliday;
      case 'personal':
        return styles.categoryPersonal;
      case 'work':
        return styles.categoryWork;
      default:
        return styles.categoryDefault;
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.headerTitle}>
          <CalendarIcon className={styles.calendarIcon} />
          <h1>Event Calendar</h1>
        </div>
        <div className={styles.calendarControls}>
          <button className={styles.todayButton} onClick={goToToday}>Today</button>
          <div className={styles.monthNavigation}>
            <button className={styles.navButton} onClick={goToPreviousMonth}>
              <ChevronLeft size={20} />
            </button>
            <h2 className={styles.currentMonth}>{monthYear}</h2>
            <button className={styles.navButton} onClick={goToNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.calendarLayout}>
        <div className={styles.calendarGrid}>
          <div className={styles.weekdays}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <div className={styles.days}>
            {calendarDays.map((dayObj, index) => (
              <div 
                key={index} 
                className={`${styles.day} 
                  ${!dayObj.isCurrentMonth ? styles.emptyDay : ''} 
                  ${hasEvents(dayObj.day) ? styles.hasEvents : ''} 
                  ${selectedDate && selectedDate.getDate() === dayObj.day && selectedDate.getMonth() === currentDate.getMonth() ? styles.selectedDay : ''}
                  ${isToday(dayObj.day) ? styles.today : ''}`
                }
                onClick={() => handleDayClick(dayObj.day)}
              >
                {dayObj.day && (
                  <>
                    <span className={styles.dayNumber}>{dayObj.day}</span>
                    {hasEvents(dayObj.day) && <div className={styles.eventIndicator}></div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.eventsPanel}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : selectedDate ? (
            <>
              <div className={styles.eventsPanelHeader}>
                <h3 className={styles.selectedDateHeading}>{formatDate(selectedDate)}</h3>
              </div>
              
              {selectedEvents.length > 0 ? (
                <div className={styles.eventsList}>
                  {selectedEvents.map(event => (
                    <div 
                      key={event._id} 
                      className={`${styles.eventCard} ${getCategoryColorClass(event.category)}`}
                      onClick={() => handleViewEventDetails(event._id)}
                    >
                      <div className={styles.eventTime}>
                        <Clock size={16} />
                        {formatTime(event.date)}
                      </div>
                      <div className={styles.eventInfo}>
                        <h4 className={styles.eventTitle}>{event.title}</h4>
                        {event.location && (
                          <p className={styles.eventLocation}>
                            <MapPin size={14} />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>📅</div>
                  <p className={styles.noEventsMessage}>No events scheduled for this day.</p>
                  <button className={styles.createEventButton} onClick={handleCreateEvent}>
                    Create Event
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noDateSelected}>
              <div className={styles.emptyStateIcon}>📆</div>
              <p>Select a date to view events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
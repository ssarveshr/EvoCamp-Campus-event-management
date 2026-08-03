import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';
import Footer from './footer/Footer.jsx';
import Navbar from './navbar/NavBar.jsx';

const About = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const footerRef = useRef(null);


  // Team members data - preloaded to avoid fetch delays
  const teamMembers = [
    {
      id: 1,
      name: "Sai Sarvesh R",
      role: "Backend Developer",
      photo: "/members/sai.png",
      contributions: "Developed the Backend API's and other connections.",
      academic: "B.E. Computer Science, 2nd Year",
      college: "RNS Institute of Technology",
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
      contact: {
        github: "https://github.com/ssarveshr",
        linkedin: "https://www.linkedin.com/in/sai-sarvesh-r-b203b8219/"
      }
    },
    {
      id: 2,
      name: "Samudra S Hosmata",
      role: "FullStack Developer",
      photo: "/members/samu_1.png",
      contributions: "Designed and implemented the event management API. Created authentication system and database schema.",
      academic: "B.E. Computer Science, 2nd Year",
      college: "RNS Institute of Technology",
      skills: ["Node.js", "Express", "MongoDB", "JWT Authentication" , "React" , "Authentication" , "RestApi"],
      contact: {
        github: "https://github.com/samudra1024",
        linkedin: "https://www.linkedin.com/in/samudra-s-hosmata-2581032a7/"
      }
    },
    {
      id: 3,
      name: "Ranjitha Sridhar",
      role: "UI/UX Designer & Frontend Developer",
      photo: "/members/ranjitha.png",
      contributions: "Created wireframes and mockups for all pages. Designed the color scheme and visual identity of the platform.",
      academic: "B.E. Computer Science, 2nd Year",
      college: "RNS Institute of Technology",
      skills: ["Figma","Prototyping", "React", "CSS", "JavaScript", "HTML", "Documentation"],
      contact: {
        github: "https://github.com/ranjitha-sridhar",
        linkedin: "https://www.linkedin.com/in/ranjitha-sridhar-a5b711311/"
      }
    },
    {
      id: 4,
      name: "Praveen Kumar M",
      role: "Frontend Developer",
      photo: "/members/praveen.png",
      contributions: "Implemented the frontend using React. Integrated the frontend with backend APIs.",
      academic: "B.E. Computer Science, 2nd Year",
      college: "RNS Institute of Technology",
      skills: ["React", "Node.js","javascript", "HTML", "CSS", "GitHub"],
      contact: {
        github: "https://github.com/PraveenKumarM17",
        linkedin: "https://www.linkedin.com/in/praveen-kumar-m-880952246/"
      }
    }
  ];

  // Project info
  const projectInfo = {
    description: "Campus Events is a modern, intuitive platform designed to streamline event discovery and participation across university campuses. Our mission is to enhance student engagement by connecting the campus community with activities, workshops, conferences, and social gatherings taking place around them.",
    features: [
      "Real-time event tracking and notifications",
      "Interactive campus map with event locations",
      "User-friendly event submission for student organizations",
      "Personalized event recommendations based on interests",
      "Attendance tracking and digital check-ins",
      "Integration with campus calendar systems"
    ],
    techStack: [
      "React.js frontend with modern hooks and context API",
      "Node.js and Express backend",
      "MongoDB for flexible data storage",
      "JWT authentication for secure access",
      "Responsive design for all devices",
      "Real-time updates with Socket.io"
    ]
  };

  // Performance optimization - only run animation after component is mounted
  useEffect(() => {
    // Set loaded state immediately to start animations
    setIsLoaded(true);
    
    // Use intersection observer for scroll animations instead of scroll event
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          // Once the animation is triggered, we don't need to observe this element anymore
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe all team cards
    document.querySelectorAll(`.${styles.teamCard}`).forEach((card, i) => {
    card.style.transitionDelay = `${i * 100}ms`; // Stagger delay
    observer.observe(card); // Observe for animation
  });
    
    // Observe project sections
    document.querySelectorAll(`.${styles.animatedSection}`).forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  const handleContactScroll = (path) => {
    if (path === '/contact') {
      footerRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };
  

  return (
    <div className={`${styles.container} ${isLoaded ? styles.loaded : ''}`}>
      {/* Navigation Bar */}

      {/* Hero section */}
      <section className={`${styles.heroSection} ${isLoaded ? styles.visible : ''}`}>
        <div className={styles.heroContent}>
          <h1>About Campus Events</h1>
          <p>Connecting students with campus life through seamless event discovery</p>
        </div>
      </section>

      {/* Project Overview section - Moved up for better flow */}
      <section className={`${styles.projectSection} ${styles.animatedSection}`}>
        <div className={styles.sectionHeader}>
          <h2>Our Mission</h2>
          <div className={styles.underline}></div>
        </div>
        
        <div className={styles.projectContent}>
          <p className={styles.projectDescription}>{projectInfo.description}</p>
          
          <div className={styles.projectFeatures}>
            <div className={styles.featureColumn}>
              <h3>Key Features</h3>
              <ul className={styles.featureList}>
                {projectInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.featureColumn}>
              <h3>Technology Stack</h3>
              <ul className={styles.featureList}>
                {projectInfo.techStack.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className={styles.projectStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Events Listed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Organizations</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members section */}
      <section className={styles.teamSection}>
        <div className={styles.sectionHeader}>
          <h2>Meet Our Team</h2>
          <div className={styles.underline}></div>
          <p>The talented individuals behind EvoCamp</p>
        </div>
        
        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.id} className={styles.teamCard}>
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <div className={styles.photoContainer}>
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className={styles.memberPhoto}
                      loading="lazy" // Lazy load images for better performance
                    />
                  </div>
                  <div className={styles.frontInfo}>
                    <h2>{member.name}</h2>
                    <h3>{member.role}</h3>
                  </div>
                </div>
                
                <div className={styles.cardBack}>
                  <h2>{member.name}</h2>
                  <h3 className={styles.role}>{member.role}</h3>
                  
                  <div className={styles.memberDetail}>
                    <h4>Contributions</h4>
                    <p>{member.contributions}</p>
                  </div>
                  
                  <div className={styles.memberDetail}>
                    <h4>Academic</h4>
                    <p>{member.academic}</p>
                    <p>{member.college}</p>
                  </div>
                  
                  <div className={styles.memberDetail}>
                    <h4>Skills</h4>
                    <div className={styles.skillsContainer}>
                      {member.skills.map((skill, index) => (
                        <span key={index} className={styles.skillBadge}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.contactLinks}>
                    <a href={member.contact.github} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                    <a href={member.contact.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Development Timeline Section */}
      <section className={`${styles.timelineSection} ${styles.animatedSection}`}>
        <div className={styles.sectionHeader}>
          <h2>Development Journey</h2>
          <div className={styles.underline}></div>
        </div>
        
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Project Kickoff</h3>
              <span className={styles.date}>End of March 2025</span>
              <p>Initiated the project with team discussions and goal setting</p>
            </div>
          </div>
          
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Design Phase</h3>
              <span className={styles.date}>Late March – Early April 2025</span>
              <p>Created wireframes and mockups, finalized visual design elements</p>
            </div>
          </div>
          
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Planning & Setup</h3>
              <span className={styles.date}>Mid April 2025</span>
              <p>Planned features, set up project structure, and tested with mock data</p>
            </div>
          </div>
          
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Ongoing Development</h3>
              <span className={styles.date}>April – Present</span>
              <p>Integrating front-end with back-end and testing core functionalities (40–45% complete)</p>
            </div>
          </div>
          
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Beta Launch</h3>
              <span className={styles.date}>July – August 2025</span>
              <p>Planned release to selected users for feedback and improvement</p>
            </div>
          </div>
          
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Public Release</h3>
              <span className={styles.date}>December 2025 – January 2026</span>
              <p>Campus-wide launch with complete features and optimizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default About;
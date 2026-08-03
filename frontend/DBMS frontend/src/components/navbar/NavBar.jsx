import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import { jwtDecode } from "jwt-decode";

const NavBar = ({ onContactScroll }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [payload, setPayload] = useState(null);

  // Helper to update userRole and payload from sessionStorage
  const updateAuthState = () => {
    const token = sessionStorage.getItem("userAuth");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPayload(decoded);
        setUserRole(decoded.Role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
        setPayload(null);
      }
    } else {
      setUserRole(null);
      setPayload(null);
    }
  };

  // Run on mount and whenever userAuth changes (via storage event)
  useEffect(() => {
    updateAuthState();

    // Listen for storage changes (cross-tab)
    const handleStorage = (event) => {
      if (event.key === "userAuth") {
        updateAuthState();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Also, listen for login/signup in the same tab by polling (optional, for instant update)
  useEffect(() => {
    let prevToken = sessionStorage.getItem("userAuth");
    const interval = setInterval(() => {
      const currentToken = sessionStorage.getItem("userAuth");
      if (currentToken !== prevToken) {
        prevToken = currentToken;
        updateAuthState();
      }
    }, 500); // Poll every 500ms

    return () => clearInterval(interval);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    if (path === "/contact") {
      onContactScroll();
    } else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  // Check if current page is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Render role-specific tab
  const renderRoleTab = () => {
    if (!userRole) return null; // Don't render if no role

    let rolePath, roleName;

    switch (userRole.toLowerCase()) {
      case "student":
        rolePath = "/studentdashboard";
        roleName = "Student Portal";
        break;
      case "faculty":
        rolePath = "/facultydashboard";
        roleName = "Faculty Portal";
        break;
      case "organizer":
        rolePath = "/organizerdashboard";
        roleName = "Organizer Portal";
        break;
      default:
        return null;
    }

    return (
      <li>
        <button
          onClick={() => handleNavigation(rolePath)}
          className={isActive(rolePath) ? styles.active : ""}
        >
          {roleName}
        </button>
      </li>
    );
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo} onClick={() => handleNavigation("/")}>
        <h1>EvoCamp</h1>
      </div>

      {/* Mobile menu button */}
      <div className={styles.mobileMenuBtn} onClick={toggleMenu}>
        <div
          className={`${styles.menuBar} ${menuOpen ? styles.open : ""}`}
        ></div>
        <div
          className={`${styles.menuBar} ${menuOpen ? styles.open : ""}`}
        ></div>
        <div
          className={`${styles.menuBar} ${menuOpen ? styles.open : ""}`}
        ></div>
      </div>

      {/* Navigation Links */}
      <ul
        className={`${styles.navLinks} ${
          menuOpen ? styles.showMobileMenu : ""
        }`}
      >
        <li>
          <button
            onClick={() => handleNavigation("/")}
            className={isActive("/") ? styles.active : ""}
          >
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("/event")}
            className={isActive("/event") ? styles.active : ""}
          >
            Events
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("/calendar")}
            className={isActive("/calendar") ? styles.active : ""}
          >
            Calendar
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("/about")}
            className={isActive("/about") ? styles.active : ""}
          >
            About
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation("/contact")}>Contact</button>
        </li>

        {/* Dynamically rendered role tab */}
        {renderRoleTab()}
      </ul>

      {/* Auth Buttons - Conditionally render based on login status */}
      <div
        className={`${styles.authButtons} ${
          menuOpen ? styles.showMobileMenu : ""
        }`}
      >
        {userRole ? (
          <button
            className={styles.signupBtn}
            onClick={() => {
              sessionStorage.removeItem("userAuth");
              setUserRole(null);
              setPayload(null);
              navigate("/login");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className={styles.loginBtn}
              onClick={() => handleNavigation("/login")}
            >
              Login
            </button>
            <button
              className={styles.signupBtn}
              onClick={() => handleNavigation("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

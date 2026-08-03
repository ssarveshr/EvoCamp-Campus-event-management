import React, { useRef } from "react";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignUpPage.jsx";
import DashBoard from "./components/DashBoard.jsx";
import LoginFaculty from "./components/LoginFaculty.jsx";
import LoginOrganiser from "./components/LoginOrganiser.jsx";
import SignUpFaculty from "./components/SignUpFaculty.jsx";
import About from "./components/About.jsx";
import Event from "./components/Events.jsx";
import Student from "./components/navbar/StudentNavbar.jsx";
import Calendar from "./components/navbar/Calendar.jsx";
import CreateEvent from "./components/CreateEvent.jsx";
import OrganizerDashboard from "./components/OrganizerDashboard.jsx";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage.jsx";
import NavBar from "./components/navbar/NavBar.jsx";
import Footer from "./components/footer/Footer.jsx";
import RegisterEvent from "./components/RegisterEvent.jsx";
import FacultyDashboard from "./components/FacultyDashboard.jsx";
import StudentDashboard from "./components/portals/StudentPortal.jsx";
import EventDetails from "./components/EventDetails.jsx";

function App() {
  const footerRef = useRef(null);

  const handleContactScroll = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <NavBar onContactScroll={handleContactScroll} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/loginfaculty" element={<LoginFaculty />} />
        <Route path="/signupfaculty" element={<SignUpFaculty />} />
        <Route path="/loginorganiser" element={<LoginOrganiser />} />
        <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/about" element={<About />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/organizerdashboard" element={<OrganizerDashboard />} />
        <Route path="/facultydashboard" element={<FacultyDashboard />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/registerevent" element={<RegisterEvent />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/registerevent" element={<RegisterEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
      <Footer ref={footerRef} />
    </>
  );
}
export default App;

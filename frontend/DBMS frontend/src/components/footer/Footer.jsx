import React from 'react';
import styles from './Footer.module.css';

const Footer = React.forwardRef((props, ref) => {
  return (
    <footer className={styles.footer} ref={ref}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>EvoCamp</h3>
          <p>Your one-stop platform for all campus activities and events.</p>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/profile.php?id=61576092494024" aria-label="Facebook" target='_blank'><img src="/facebook.svg" alt=""/></a>
            <a href="#" aria-label="Twitter"><img src="/twitter2.svg" alt="" /></a>
            <a href="https://www.instagram.com/_evo_camp_/" aria-label="Instagram" target='_blank'><img src="/insta.svg" alt="" /></a>
            <a href="#" aria-label="LinkedIn"><img src="/linkedin.svg" alt="" /></a>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Events Calendar</a></li>
            <li><a href="#">Student Organizations</a></li>
            <li><a href="#">Submit an Event</a></li>
            <li>
              <a href="https://www.google.com/maps/place/RNS+INSTITUTE+OF+TECHNOLOGY/@12.9021197,77.5183721,19.86z/data=!4m14!1m7!3m6!1s0x3bae3fa7243af9c3:0x9bed6669a38d1c3!2sRNS+INSTITUTE+OF+TECHNOLOGY!8m2!3d12.9021902!4d77.518582!16s%2Fm%2F07kddf8!3m5!1s0x3bae3fa7243af9c3:0x9bed6669a38d1c3!8m2!3d12.9021902!4d77.518582!16s%2Fm%2F07kddf8?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                Campus Map
              </a>
            </li>
          </ul>
        </div>
       <div className={styles.footerSection}>
          <h3>Contact Us</h3>
          <p>RNS Institute Of Technology</p>
          <p>Channasandra, Banglore-98</p>
          <p><a href="mailto:forprojectdbonly@gmail.com">forprojectdbonly@gmail.com</a></p>
          <p><a href="tel:(+91) 8394-3480-38"></a>(+91) 8394-3480-38</p>
        </div>
        <div className={styles.footerSection}>
          <h3>Newsletter</h3>
          <p>Subscribe to get updates on upcoming events</p>
          <div className={styles.newsletterForm}>
            <input type="email" placeholder="Your email" aria-label="Email for newsletter" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; 2025 Campus Events. All rights reserved.</p>
      </div>
    </footer>
  );
});

export default Footer;
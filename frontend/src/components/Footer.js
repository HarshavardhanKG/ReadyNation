import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ReadyNation</h3>
          <p>Disaster Preparedness Platform</p>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@readynation.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 ReadyNation. All rights reserved.</p>
      </div>
    </footer>
  );
}

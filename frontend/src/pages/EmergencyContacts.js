import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import "./EmergencyContacts.css";

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState({});

  const emergencyServices = [
    { id: 'ambulance', name: 'Ambulance', phone: '108', icon: '🚑', description: 'Medical emergencies, accidents, and health crises' },
    { id: 'fire', name: 'Fire Service', phone: '101', icon: '🚒', description: 'Fire emergencies, building fires, and rescue operations' },
    { id: 'police', name: 'Police', phone: '100', icon: '🚓', description: 'Crime reporting, law enforcement, and security emergencies' },
    { id: 'disaster', name: 'Disaster Management', phone: '108', icon: '🆘', description: 'Natural disasters, floods, earthquakes, and cyclones' },
    { id: 'women', name: 'Women Helpline', phone: '1091', icon: '👩', description: 'Women safety, harassment, and domestic violence' },
    { id: 'child', name: 'Child Helpline', phone: '1098', icon: '👶', description: 'Child abuse, missing children, and child protection' }
  ];

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
    const saved = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
    setContacts(saved);
  }, []);

  const saveContacts = (updated) => {
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
    setContacts(updated);
  };

  const deleteContact = (id) => {
    saveContacts(contacts.filter(c => c.id !== id));
  };

  const sendMassAlert = () => {
    const message = `🚨 EMERGENCY ALERT from ${user.name || "User"}\nLocation: ${user.location || "Unknown"}\nI need immediate assistance!`;
    contacts.forEach(c => {
      console.log(`Sending SMS to ${c.phone}: ${message}`);
    });
    alert(`Mass alert sent to ${contacts.length} contacts!`);
  };

  const callContact = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const sendSMS = (phone) => {
    window.location.href = `sms:${phone}?body=Emergency! I need help at ${user.location}`;
  };

  const shareLocation = (phone) => {
    alert(`Location shared with ${phone}`);
  };

  return (
    <>
      <Navbar />
      <div className="emergency-contacts-page">
        <BackButton />
        <header className="page-header">
          <h1>🚨 Emergency Contacts</h1>
        </header>

      <div className="emergency-services-section">
        <h2>🆘 Emergency Services</h2>
        <div className="services-grid">
          {emergencyServices.map((service) => (
            <motion.div
              key={service.id}
              className="service-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="service-icon">{service.icon}</div>
              <div className="service-info">
                <h3>{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-phone">{service.phone}</div>
              </div>
              <button className="btn-call-service" onClick={() => callContact(service.phone)}>
                📞 Call Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="personal-contacts-header">
        <h2>👥 Personal Emergency Contacts</h2>
        <button className="btn-mass-alert" onClick={sendMassAlert}>
          📢 ALERT ALL
        </button>
      </div>

      <div className="contacts-grid personal-contacts-grid">
        {contacts.sort((a, b) => a.priority - b.priority).map((contact, i) => (
          <motion.div
            key={contact.id}
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="contact-header">
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p className="relationship">{contact.relationship}</p>
                <p className="phone">{contact.phone}</p>
              </div>
              <span className="priority-badge">Priority {contact.priority}</span>
            </div>
            <div className="contact-actions">
              <button className="btn-action call" onClick={() => callContact(contact.phone)}>📞 Call</button>
              <button className="btn-action sms" onClick={() => sendSMS(contact.phone)}>💬 SMS</button>
              <button className="btn-action location" onClick={() => shareLocation(contact.phone)}>📍 Share Location</button>
              <button className="btn-action delete" onClick={() => deleteContact(contact.id)}>🗑️</button>
            </div>
          </motion.div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="empty-state">
          <p>No personal emergency contacts saved</p>
        </div>
      )}
      </div>
    </>
  );
}

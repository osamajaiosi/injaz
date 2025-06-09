import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>تواصل معنا</h1>
        <p className="contact-text">
          نحن هنا من أجلكم دائمًا. لمساعدتكم والإجابة على استفساراتكم واقتراحاتكم، يُسعدنا التواصل معكم عبر المنصات الآتية:
        </p>
        <div className="contact-social-links">
        
          <a
            href="https://wa.me/962799561057"
            className="social-link whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-whatsapp" aria-hidden="true" />
          </a>
          <a
            href="https://www.facebook.com/osama.aljaiosi/"
            className="social-link facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f" aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/osamaljaiosi/"
            className="social-link instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram" aria-hidden="true" />
          </a>
        </div>
        <p className="contact-email">
          أو تواصل معنا عبر البريد الإلكتروني:&nbsp;
          <a href="mailto:support@yallaenjaz.com">support@yallaenjaz.com</a>
        </p>
      </div>
    </div>
  );
}

export default Contact;
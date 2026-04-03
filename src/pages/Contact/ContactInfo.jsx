import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactInfo = () => {
  return (
    <section className="py-16 w-11/12 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="text-orange-500">Contact</span> Us
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Info + Map */}
        <div className="flex flex-col gap-8">
          {/* Contact details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Address</p>
                <p className="text-gray-500 text-sm">Tongi, Gazipur, Dhaka, Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <FaPhone />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-gray-500 text-sm">+880 1712-345678</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <FaEnvelope />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-500 text-sm">support@matchnest.com</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <p className="font-semibold text-gray-800 mb-3">Follow Us</p>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition"><FaYoutube /></a>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-64">
            <iframe
              title="Tongi Gazipur Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.4!2d90.3981!3d23.8903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5b0b0b0b0b0%3A0x0!2sTongi%2C+Gazipur!5e0!3m2!1sen!2sbd!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: Form */}
        <div id="contact-form" />
      </div>
    </section>
  );
};

export default ContactInfo;

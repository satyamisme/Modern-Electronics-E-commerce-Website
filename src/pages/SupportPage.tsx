import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, CheckCircle } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team for any questions or assistance.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Speak directly with our support team</p>
            <div className="space-y-2">
              <p className="font-medium text-primary">50430606 / 55463597</p>
              <p className="text-xs text-gray-500">محل تلفون لكي,خيطان مجمع فهد الدبوس علي كل التلفونات والاكسسوارت عرض</p>
              {/* Assuming general hours, replace if specific hours for these numbers are different */}
              <p className="text-sm text-gray-500">Sunday - Thursday: 9 AM - 10 PM</p>
              <p className="text-sm text-gray-500">Friday: 2 PM - 10 PM</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us an email anytime</p>
            <div className="space-y-2">
              <p className="font-medium text-primary">support@lakkiphones.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with us in real-time</p>
            <div className="space-y-2">
              <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors">
                Start Chat
              </button>
              <p className="text-sm text-gray-500">Average response: 2 minutes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700">Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+965 XXXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="technical">Technical Support</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="return">Return/Exchange</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* FAQ and Additional Info */}
          <div className="space-y-8">
            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "What are your delivery times?",
                    answer: "We deliver within 2-7 hours depending on your location in Kuwait. Same-day delivery is available for orders placed before 6 PM."
                  },
                  {
                    question: "Do you offer warranty on products?",
                    answer: "Yes, all our products come with manufacturer warranty. Extended warranty options are also available."
                  },
                  {
                    question: "Can I return a product?",
                    answer: "Yes, we offer 30-day returns for unopened products in original packaging. Some restrictions apply."
                  },
                  {
                    question: "Do you accept KNET payments?",
                    answer: "Yes, we accept KNET, Visa, and Mastercard payments through our secure payment gateway."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Store Location */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Store</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">LAKKI PHONES</p>
                    <p className="text-gray-600">Muscat street, opp gulf bank, Khaitan</p>
                    <p className="text-gray-600">Al 'Āşimah, Kuwait 83000</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Store Hours</p>
                    {/* Assuming general hours, replace if specific hours are different */}
                    <p className="text-gray-600">Sunday - Thursday: 9 AM - 10 PM</p>
                    <p className="text-gray-600">Friday: 2 PM - 10 PM</p>
                    <p className="text-gray-600">Saturday: 9 AM - 10 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
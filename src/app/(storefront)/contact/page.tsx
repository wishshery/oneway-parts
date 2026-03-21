'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Message sent! We will get back to you soon.');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '17135551234';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-500 max-w-lg mx-auto">
          Have a question about a part? Need help with fitment? Our automotive specialists are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2"><MapPin className="h-5 w-5 text-brand-500" /></div>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-500">16319 West Bellfort St Unit 12<br />Sugar Land, TX 77498</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2"><Phone className="h-5 w-5 text-brand-500" /></div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:+17135551234" className="text-sm text-brand-500 hover:text-brand-600">(713) 555-1234</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2"><Mail className="h-5 w-5 text-brand-500" /></div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:info@onewayparts.com" className="text-sm text-brand-500 hover:text-brand-600">info@onewayparts.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2"><Clock className="h-5 w-5 text-brand-500" /></div>
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-sm text-gray-500">Mon - Sat: 9:00 AM - 6:00 PM<br />Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>

          <a
            href={`https://wa.me/${whatsapp}?text=Hi%20ONEWAY%20Parts%2C%20I%20have%20a%20question`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 p-4 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="input-field" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} required className="input-field">
                  <option value="">Select a topic</option>
                  <option value="part-inquiry">Part Inquiry</option>
                  <option value="fitment">Fitment Question</option>
                  <option value="order-status">Order Status</option>
                  <option value="return">Return / Exchange</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="input-field" placeholder="How can we help you?" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-6">
              <Send className="h-4 w-4" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to your backend
        console.log("Form submitted:", formData);
        alert("Thank you for contacting us! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="w-full min-h-screen bg-primary pb-20">
            <Helmet>
                <title>Contact Us - Cosmetic Shop</title>
                <meta name="description" content="Get in touch with us for any questions or support. We're here to help." />
            </Helmet>
            {/* Hero Section */}
            <section className="bg-secondary text-white py-20 px-6 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h1>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">
                    Have questions about our products or need assistance? We're here to help.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">
                    {/* Contact Info (Left) */}
                    <div className="bg-accent text-white p-10 lg:p-16 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                            <p className="opacity-90 mb-12">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-3 rounded-full text-xl mt-1">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Phone</h3>
                                        <p className="opacity-80">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-3 rounded-full text-xl mt-1">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email</h3>
                                        <p className="opacity-80">hello@cosmeticshop.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-3 rounded-full text-xl mt-1">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Location</h3>
                                        <p className="opacity-80">123 Beauty Lane, Innovation City, CA 90210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer transition">📘</div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer transition">📷</div>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer transition">🐦</div>
                        </div>
                    </div>

                    {/* Contact Form (Right) */}
                    <div className="p-10 lg:p-16 bg-white">
                        <h2 className="text-2xl font-bold text-secondary mb-8">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-secondary/70 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary/70 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary/70 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary/70 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                Send Message <FaPaperPlane className="text-sm" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

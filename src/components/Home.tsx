import Nav from "./Nav";
import { Link } from "react-router-dom";
import { useUserAuthContext } from "../config/UserAuthContext";
import FeatureCard from "../ui/FeatureCard";
import {
  BookCheck,
  BookMarked,
  Download,
  Heart,
  MessageSquare,
} from "lucide-react";
import ReviewCard from "../ui/ReviewCard";
import { useState } from "react";
import Footer from "./Footer";

export default function Home() {
  const { user } = useUserAuthContext();

  const features = [
    {
      title: "Reading Lists",
      description:
        "Create and organize multiple reading lists based on genres, themes, or your own custom categories.",
      icon: BookMarked,
    },
    {
      title: "Favorites Collection",
      description:
        "Keep track of your all-time favorite books and easily share recommendations with friends.",
      icon: Heart,
    },
    {
      title: "Reading Progress",
      description:
        "Mark books as read, in-progress, or on-hold and track your reading statistics over time.",
      icon: BookCheck,
    },
    {
      title: "Book Downloads",
      description:
        "Download free e-books or purchase new releases directly through our integrated marketplace.",
      icon: Download,
    },
    {
      title: "Book Reviews",
      description:
        "Write and share your thoughts on the books you've read with our vibrant community.",
      icon: MessageSquare,
    },
  ];

  const reviews = [
    {
      name: "Emma Wilson",
      role: "Avid Reader",
      review:
        "BookVerse has completely transformed how I organize my reading. I love being able to track my progress and discover new books based on my preferences.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Michael Chen",
      role: "Book Club Organizer",
      review:
        "Our book club uses BookVerse to coordinate our reading selections. The interface is intuitive and the recommendations are spot on!",
      rating: 5,
      image:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Sarah Johnson",
      role: "English Teacher",
      review:
        "I recommend BookVerse to all my students. It makes reading tracking simple, and the review feature helps them articulate their thoughts about each book.",
      rating: 4,
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className='bg-[url("/homebg.jpg")] bg-center bg-cover bg-fixed'>
      <Nav />
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[rgb(0,0,0,0.6)]"></div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10 mb-28">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeIn">
                Your Digital Library, <br />
                <span className="text-amber-500">Personalized</span> & Organized
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl animate-fadeInDelay">
                Track your reading journey, discover new books, and connect with
                fellow readers — all in one beautifully designed website.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="animate-fadeInDelayLong bg-light-accent p-4 rounded-md flex items-center">
                  <Link to={user ? "/explore" : "/login"}>Get Started</Link>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffc107"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="ml-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
                {/* <button className="text-white border-white border-2 p-2 rounded-md hover:bg-white/10 animate-fadeInDelayLonger flex items-center">
                  <span>Learn More</span>
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#F9F6F0"
              fillOpacity="1"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,170.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>
      <section
        id="features"
        className="py-20 bg-light-background dark:bg-dark-background"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 dark:text-gray-100">
              Features Designed for Book Lovers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              BookVerse offers a complete suite of tools to enhance your reading
              experience and connect with a community that shares your passion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
      <section
        id="reviews"
        className="py-20 bg-light-background dark:bg-dark-background"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 dark:text-gray-100">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-200">
              Join thousands of readers who have transformed their reading
              experience with BookVerse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                role={review.role}
                review={review.review}
                rating={review.rating}
                image={review.image}
              />
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="py-20 bg-light-background dark:bg-dark-background"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-navy-800 text-white p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Get in Touch
                </h2>
                <p className="mb-6 text-gray-300">
                  Have questions about BookVerse? We're here to help you get
                  started on your reading journey.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-amber-400">Email</h3>
                    <p className="text-gray-300">support@bookverse.app</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-400">Address</h3>
                    <p className="text-gray-300">
                      123 Reading Lane
                      <br />
                      Book City, BC 12345
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-400">Follow Us</h3>
                    <div className="flex space-x-4 mt-2">
                      <a
                        href="#"
                        className="text-white hover:text-amber-400 transition-colors"
                      >
                        Twitter
                      </a>
                      <a
                        href="#"
                        className="text-white hover:text-amber-400 transition-colors"
                      >
                        Instagram
                      </a>
                      <a
                        href="#"
                        className="text-white hover:text-amber-400 transition-colors"
                      >
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-xl font-semibold text-navy-900 mb-4">
                  Send us a message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

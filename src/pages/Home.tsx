import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import { useUserAuthContext } from "../config/UserAuthContext";
import FeatureCard from "../components/ui/FeatureCard";
import { BookMarked, Download, Heart, Layers, Search, Bot } from "lucide-react";
import ReviewCard from "../components/ui/ReviewCard";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { addUser } from "../services/requests";
import { auth } from "../config/firebase-config";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useUserAuthContext();

  useEffect(() => {
    const addUserToDb = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await addUser({ userId: user.uid, email: user.email });
        }
      });
    };
    addUserToDb();
  }, []);

  const features = [
    {
      title: "Smart Reading Lists",
      description:
        "Create personalized reading lists to organize your 'to-read', 'currently reading', and 'finished' books with ease.",
      icon: BookMarked,
      image: "smart.png",
    },
    {
      title: "Favorites at Your Fingertips",
      description:
        "Instantly access your favorite books and build a collection that reflects your literary taste.",
      icon: Heart,
      image: "fav.png",
    },
    {
      title: "Genre-Based Discovery",
      description:
        "Browse books by genre and uncover new reads tailored to your mood or interests.",
      icon: Layers,
      image: "genre.png",
    },
    {
      title: "Powerful Book Search",
      description:
        "Search by title, author, or keywords and get quick, accurate results from a rich dataset.",
      icon: Search,
      image: "find.png",
    },
    {
      title: "Download & Access Easily",
      description:
        "Get free download links for books—no more hunting across sketchy sites.",
      icon: Download,
      image: "download.png",
    },
    {
      title: "Built-in Book Assistant",
      description:
        "Each book page features an AI chatbot that offers summaries, insights, and recommendations tailored to that title.",
      icon: Bot,
      image: "bot.png",
    },
  ];

  const reviews = [
    {
      name: "Lena Wendy",
      role: "University Student",
      review:
        "I used to jot down my reading lists in random notes, but BookVerse changed everything. I can now track what I'm reading, mark books as finished, and even get recommendations through the chatbot. It’s my new digital bookshelf!",
      rating: 5,
      image:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "James Steinbeck",
      role: "Freelance Writer",
      review:
        "BookVerse's download feature is a game-changer. I no longer waste time searching the web—one click and I have what I need. Plus, exploring by genre helps me break out of my usual reading rut.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "Claire",
      role: "Literature Blogger",
      review:
        "What I love most is the chatbot on each book page. It feels like having a mini book club ready to chat about the book. The insights help me create richer content for my blog.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800",
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
      <section>
        <section className="flex items-stretch flex-col">
          <section className="sticky top-0 h-screen flex items-center pt-16 overflow-hidden lg:px-[8%]">
            <div className="absolute inset-0 max-h-screen bg-[rgb(0,0,0,0.6)]"></div>
            <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10 mb-28">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 mb-12 lg:mb-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeIn">
                    Your Digital Library, <br />
                    <span className="text-amber-500">Personalized</span> &
                    Organized
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl animate-fadeInDelay">
                    Track your reading journey, discover new books, and connect
                    with fellow readers — all in one beautifully designed
                    website.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="animate-fadeInDelayLong bg-light-accent p-4 rounded-md flex items-center w-40">
                      <Link to={user ? "/explore" : "/login"}>Get Started</Link>
                      <div>
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
                      </div>
                    </button>
                    {/* <button className="text-white border-white border-2 p-2 rounded-md hover:bg-white/10 animate-fadeInDelayLonger flex items-center">
                      <span>Learn More</span>
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Wave Separator */}
            <div className="absolute bottom-0 left-0 right-0 max-h-screen">
              <div className="wave-container">
                <svg
                  viewBox="0 0 1000 200"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <path
                    className="dark:fill-dark-background"
                    d="M0,200 L0.0,100.0 C 6.3,102.8 18.8,108.3 25.0,111.0 C 31.3,113.3 43.8,118.1 50.0,120.4 C 56.3,122.1 68.8,125.4 75.0,127.1 C 81.3,127.8 93.8,129.2 100.0,129.9 C 106.3,129.6 118.8,128.9 125.0,128.6 C 131.3,127.3 143.8,124.6 150.0,123.3 C 156.3,121.2 168.8,116.9 175.0,114.8 C 181.3,112.2 193.8,106.8 200.0,104.2 C 206.3,101.4 218.8,95.9 225.0,93.1 C 231.3,90.5 243.8,85.5 250.0,82.9 C 256.3,80.9 268.8,77.0 275.0,75.0 C 281.3,73.9 293.8,71.8 300.0,70.7 C 306.3,70.6 318.8,70.5 325.0,70.4 C 331.3,71.4 343.8,73.3 350.0,74.2 C 356.3,76.0 368.8,79.8 375.0,81.6 C 381.3,84.1 393.8,89.1 400.0,91.6 C 406.3,94.4 418.8,100.0 425.0,102.8 C 431.3,105.5 443.8,110.8 450.0,113.5 C 456.3,115.7 468.8,120.2 475.0,122.4 C 481.3,123.8 493.8,126.7 500.0,128.1 C 506.3,128.6 518.8,129.5 525.0,130.0 C 531.3,129.4 543.8,128.3 550.0,127.7 C 556.3,126.2 568.8,123.0 575.0,121.5 C 581.3,119.2 593.8,114.7 600.0,112.4 C 606.3,109.7 618.8,104.2 625.0,101.5 C 631.3,98.7 643.8,93.2 650.0,90.4 C 656.3,88.0 668.8,83.1 675.0,80.7 C 681.3,78.9 693.8,75.4 700.0,73.6 C 706.3,72.8 718.8,71.0 725.0,70.2 C 731.3,70.4 743.8,70.8 750.0,71.0 C 756.3,72.2 768.8,74.5 775.0,75.7 C 781.3,77.8 793.8,81.9 800.0,83.9 C 806.3,86.5 818.8,91.7 825.0,94.3 C 831.3,97.1 843.8,102.7 850.0,105.5 C 856.3,108.1 868.8,113.3 875.0,115.9 C 881.3,118.0 893.8,122.0 900.0,124.1 C 906.3,125.3 918.8,127.8 925.0,129.0 C 931.3,129.2 943.8,129.6 950.0,129.8 C 956.3,129.0 968.8,127.3 975.0,126.5 C 981.3,124.8 993.8,121.3 1000.0,119.5 C 1006.3,117.1 1018.8,112.2 1025.0,109.8 L1000.0,200.0 L0,200.0Z"
                    fill="#F9F6F0"
                  >
                    <animate
                      attributeName="d"
                      dur="7.0s"
                      repeatCount="indefinite"
                      values="M0,200 L0.0,100.0 C 6.3,102.8 18.8,108.3 25.0,111.0 C 31.3,113.3 43.8,118.1 50.0,120.4 C 56.3,122.1 68.8,125.4 75.0,127.1 C 81.3,127.8 93.8,129.2 100.0,129.9 C 106.3,129.6 118.8,128.9 125.0,128.6 C 131.3,127.3 143.8,124.6 150.0,123.3 C 156.3,121.2 168.8,116.9 175.0,114.8 C 181.3,112.2 193.8,106.8 200.0,104.2 C 206.3,101.4 218.8,95.9 225.0,93.1 C 231.3,90.5 243.8,85.5 250.0,82.9 C 256.3,80.9 268.8,77.0 275.0,75.0 C 281.3,73.9 293.8,71.8 300.0,70.7 C 306.3,70.6 318.8,70.5 325.0,70.4 C 331.3,71.4 343.8,73.3 350.0,74.2 C 356.3,76.0 368.8,79.8 375.0,81.6 C 381.3,84.1 393.8,89.1 400.0,91.6 C 406.3,94.4 418.8,100.0 425.0,102.8 C 431.3,105.5 443.8,110.8 450.0,113.5 C 456.3,115.7 468.8,120.2 475.0,122.4 C 481.3,123.8 493.8,126.7 500.0,128.1 C 506.3,128.6 518.8,129.5 525.0,130.0 C 531.3,129.4 543.8,128.3 550.0,127.7 C 556.3,126.2 568.8,123.0 575.0,121.5 C 581.3,119.2 593.8,114.7 600.0,112.4 C 606.3,109.7 618.8,104.2 625.0,101.5 C 631.3,98.7 643.8,93.2 650.0,90.4 C 656.3,88.0 668.8,83.1 675.0,80.7 C 681.3,78.9 693.8,75.4 700.0,73.6 C 706.3,72.8 718.8,71.0 725.0,70.2 C 731.3,70.4 743.8,70.8 750.0,71.0 C 756.3,72.2 768.8,74.5 775.0,75.7 C 781.3,77.8 793.8,81.9 800.0,83.9 C 806.3,86.5 818.8,91.7 825.0,94.3 C 831.3,97.1 843.8,102.7 850.0,105.5 C 856.3,108.1 868.8,113.3 875.0,115.9 C 881.3,118.0 893.8,122.0 900.0,124.1 C 906.3,125.3 918.8,127.8 925.0,129.0 C 931.3,129.2 943.8,129.6 950.0,129.8 C 956.3,129.0 968.8,127.3 975.0,126.5 C 981.3,124.8 993.8,121.3 1000.0,119.5 C 1006.3,117.1 1018.8,112.2 1025.0,109.8 L1000.0,200.0 L0,200.0Z;
          M0,200 L0.0,100.0 C 6.3,97.3 18.8,91.8 25.0,89.0 C 31.3,86.7 43.8,81.9 50.0,79.6 C 56.3,77.9 68.8,74.6 75.0,72.9 C 81.3,72.2 93.8,70.8 100.0,70.1 C 106.3,70.4 118.8,71.1 125.0,71.4 C 131.3,72.7 143.8,75.4 150.0,76.7 C 156.3,78.8 168.8,83.1 175.0,85.2 C 181.3,87.8 193.8,93.2 200.0,95.8 C 206.3,98.6 218.8,104.1 225.0,106.9 C 231.3,109.5 243.8,114.5 250.0,117.1 C 256.3,119.1 268.8,123.0 275.0,125.0 C 281.3,126.1 293.8,128.2 300.0,129.3 C 306.3,129.4 318.8,129.5 325.0,129.6 C 331.3,128.7 343.8,126.8 350.0,125.8 C 356.3,124.0 368.8,120.3 375.0,118.4 C 381.3,115.9 393.8,110.9 400.0,108.4 C 406.3,105.6 418.8,100.0 425.0,97.2 C 431.3,94.5 443.8,89.2 450.0,86.5 C 456.3,84.3 468.8,79.8 475.0,77.6 C 481.3,76.2 493.8,73.3 500.0,71.9 C 506.3,71.4 518.8,70.5 525.0,70.0 C 531.3,70.6 543.8,71.7 550.0,72.3 C 556.3,73.8 568.8,77.0 575.0,78.5 C 581.3,80.8 593.8,85.3 600.0,87.6 C 606.3,90.3 618.8,95.8 625.0,98.5 C 631.3,101.3 643.8,106.8 650.0,109.6 C 656.3,112.0 668.8,116.9 675.0,119.3 C 681.3,121.1 693.8,124.6 700.0,126.4 C 706.3,127.3 718.8,129.0 725.0,129.8 C 731.3,129.6 743.8,129.2 750.0,129.0 C 756.3,127.8 768.8,125.5 775.0,124.3 C 781.3,122.3 793.8,118.1 800.0,116.1 C 806.3,113.5 818.8,108.3 825.0,105.7 C 831.3,102.9 843.8,97.3 850.0,94.5 C 856.3,91.9 868.8,86.7 875.0,84.1 C 881.3,82.0 893.8,78.0 900.0,75.9 C 906.3,74.7 918.8,72.2 925.0,71.0 C 931.3,70.8 943.8,70.4 950.0,70.2 C 956.3,71.0 968.8,72.7 975.0,73.5 C 981.3,75.3 993.8,78.8 1000.0,80.5 C 1006.3,82.9 1018.8,87.8 1025.0,90.2 L1000.0,200.0 L0,200.0Z;
          M0,200 L0.0,100.0 C 6.3,102.8 18.8,108.3 25.0,111.0 C 31.3,113.3 43.8,118.1 50.0,120.4 C 56.3,122.1 68.8,125.4 75.0,127.1 C 81.3,127.8 93.8,129.2 100.0,129.9 C 106.3,129.6 118.8,128.9 125.0,128.6 C 131.3,127.3 143.8,124.6 150.0,123.3 C 156.3,121.2 168.8,116.9 175.0,114.8 C 181.3,112.2 193.8,106.8 200.0,104.2 C 206.3,101.4 218.8,95.9 225.0,93.1 C 231.3,90.5 243.8,85.5 250.0,82.9 C 256.3,80.9 268.8,77.0 275.0,75.0 C 281.3,73.9 293.8,71.8 300.0,70.7 C 306.3,70.6 318.8,70.5 325.0,70.4 C 331.3,71.4 343.8,73.3 350.0,74.2 C 356.3,76.0 368.8,79.8 375.0,81.6 C 381.3,84.1 393.8,89.1 400.0,91.6 C 406.3,94.4 418.8,100.0 425.0,102.8 C 431.3,105.5 443.8,110.8 450.0,113.5 C 456.3,115.7 468.8,120.2 475.0,122.4 C 481.3,123.8 493.8,126.7 500.0,128.1 C 506.3,128.6 518.8,129.5 525.0,130.0 C 531.3,129.4 543.8,128.3 550.0,127.7 C 556.3,126.2 568.8,123.0 575.0,121.5 C 581.3,119.2 593.8,114.7 600.0,112.4 C 606.3,109.7 618.8,104.2 625.0,101.5 C 631.3,98.7 643.8,93.2 650.0,90.4 C 656.3,88.0 668.8,83.1 675.0,80.7 C 681.3,78.9 693.8,75.4 700.0,73.6 C 706.3,72.8 718.8,71.0 725.0,70.2 C 731.3,70.4 743.8,70.8 750.0,71.0 C 756.3,72.2 768.8,74.5 775.0,75.7 C 781.3,77.8 793.8,81.9 800.0,83.9 C 806.3,86.5 818.8,91.7 825.0,94.3 C 831.3,97.1 843.8,102.7 850.0,105.5 C 856.3,108.1 868.8,113.3 875.0,115.9 C 881.3,118.0 893.8,122.0 900.0,124.1 C 906.3,125.3 918.8,127.8 925.0,129.0 C 931.3,129.2 943.8,129.6 950.0,129.8 C 956.3,129.0 968.8,127.3 975.0,126.5 C 981.3,124.8 993.8,121.3 1000.0,119.5 C 1006.3,117.1 1018.8,112.2 1025.0,109.8 L1000.0,200.0 L0,200.0Z"
                    />
                  </path>
                </svg>
              </div>
            </div>
          </section>
          <section
            className="relative z-20 py-20 bg-light-background dark:bg-dark-background"
          >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 dark:text-gray-100">
                  Features Designed for Book Lovers
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                  BookVerse offers a complete suite of tools to enhance your
                  reading experience and connect with a community that shares
                  your passion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:px-[8%]">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    image={feature.image}
                  />
                ))}
              </div>
            </div>
          </section>
        </section>
        <section className="relative top-[-100vh]">
          <section
            className="sticky top-0 z-10 py-20 min-h-screen bg-light-background dark:bg-dark-background"
          >
            <div className="container mx-auto px-4 md:px-6 lg:px-[10%]">
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
            className="relative top-[100vh] min-h-screen py-10 bg-light-background dark:bg-dark-background"
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
                        <h3 className="font-semibold text-amber-400">
                          Address
                        </h3>
                        <p className="text-gray-300">
                          123 Reading Lane
                          <br />
                          Book City, BC 12345
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-400">
                          Follow Us
                        </h3>
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
        </section>
      </section>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}

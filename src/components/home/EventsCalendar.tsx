import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: 'competition' | 'workshop' | 'exhibition' | 'training';
}

const events: Event[] = [
  {
    id: 1,
    title: "National Air Rifle Championship 2025",
    date: "2025-06-15",
    time: "09:00 AM - 05:00 PM",
    location: "Delhi Shooting Range, New Delhi",
    description: "Join us for the most prestigious air rifle shooting competition in the country with participants from all over India.",
    image: "/lovable-uploads/event-1.jpg",
    category: 'competition'
  },
  {
    id: 2,
    title: "Beginner's Pistol Shooting Workshop",
    date: "2025-06-22",
    time: "10:00 AM - 04:00 PM",
    location: "Mangla Sports Academy, Mumbai",
    description: "Learn the basics of pistol shooting from our certified instructors. All equipment will be provided.",
    image: "/lovable-uploads/event-2.jpg",
    category: 'workshop'
  },
  {
    id: 3,
    title: "Advanced Marksmanship Training Camp",
    date: "2025-07-05",
    time: "08:00 AM - 06:00 PM",
    location: "Pune Shooting Club, Pune",
    description: "Three-day intensive training camp for competitive shooters looking to improve their skills.",
    image: "/lovable-uploads/event-3.jpg",
    category: 'training'
  }
];

const EventsCalendar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categoryStyles = {
    competition: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800'
    },
    workshop: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800'
    },
    training: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800'
    },
    exhibition: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800'
    }
  };

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section id="events" className={`py-16 ${isDark ? 'bg-mangla-dark-gray' : 'bg-white'}`}>
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`section-title ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming Events</h2>
          <motion.div 
            className="w-20 h-1 bg-mangla-gold mx-auto mt-2 mb-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className={`max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            Join us for exciting competitions, workshops, and training sessions across the country.
          </p>
        </motion.div>

        {/* Event Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {['all', 'competition', 'workshop', 'training', 'exhibition'].map((filter) => {
            const label = filter.charAt(0).toUpperCase() + filter.slice(1);
            const isActive = activeFilter === filter;
            
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-mangla-gold text-mangla-dark-gray' 
                    : `${isDark ? 'bg-mangla text-gray-300 hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {label}
              </button>
            );
          })}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredEvents.map((event) => {
            const categoryStyle = categoryStyles[event.category];
            
            return (
              <motion.article 
                key={event.id}
                variants={item}
                className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'} hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-48">
                    <img 
                      className="h-full w-full object-cover md:w-48" 
                      src={event.image} 
                      alt={event.title} 
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center mb-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 group-hover:text-mangla-gold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {event.title}
                    </h3>
                    <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      {event.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            to="/events"
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${isDark ? 'bg-mangla-gold text-mangla-dark-gray hover:bg-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
          >
            View All Events <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default EventsCalendar;

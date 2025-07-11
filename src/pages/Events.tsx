import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar as CalendarIcon, Clock, Filter, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image: string;
  isFeatured?: boolean;
};

const Events = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const events: Event[] = [
    {
      id: 1,
      title: 'National Shooting Championship 2025',
      date: 'June 15-20, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'Karni Singh Shooting Range, New Delhi',
      description: 'The most prestigious national shooting competition featuring top shooters from across the country. Categories include Air Rifle, Air Pistol, and more.',
      category: 'competition',
      image: '/images/events/national-championship.jpg',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Beginner\'s Guide to Air Rifle Shooting',
      date: 'May 28, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Mangla Sports Academy, Mumbai',
      description: 'A comprehensive workshop for beginners covering safety, stance, breathing techniques, and basic marksmanship.',
      category: 'workshop',
      image: '/images/events/beginner-workshop.jpg'
    },
    {
      id: 3,
      title: 'Advanced Precision Shooting Masterclass',
      date: 'June 5, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Pune Marksmanship Club, Pune',
      description: 'Learn advanced techniques from Olympic medalists. Topics include wind reading, mental preparation, and competition strategies.',
      category: 'masterclass',
      image: '/images/events/masterclass.jpg'
    },
    {
      id: 4,
      title: 'State Level Air Pistol Competition',
      date: 'June 12, 2025',
      time: '8:00 AM - 7:00 PM',
      location: 'Karnataka State Shooting Association, Bengaluru',
      description: 'Open competition for all age groups. Categories include Men, Women, and Junior divisions.',
      category: 'competition',
      image: '/images/events/state-competition.jpg'
    },
    {
      id: 5,
      title: 'Firearm Maintenance Workshop',
      date: 'June 8, 2025',
      time: '11:00 AM - 2:00 PM',
      location: 'Mangla Sports Store, Delhi',
      description: 'Hands-on workshop covering cleaning, maintenance, and storage of firearms. All necessary equipment will be provided.',
      category: 'workshop',
      image: '/images/events/maintenance-workshop.jpg'
    },
    {
      id: 6,
      title: 'Youth Shooting Camp',
      date: 'June 25-30, 2025',
      time: '8:00 AM - 5:00 PM',
      location: 'National Rifle Association Complex, Bhopal',
      description: 'A 5-day intensive camp for young shooters aged 12-18. Focus on fundamentals, discipline, and sportsmanship.',
      category: 'camp',
      image: '/images/events/youth-camp.jpg'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'competition', name: 'Competitions' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'masterclass', name: 'Masterclasses' },
    { id: 'camp', name: 'Training Camps' }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'competition':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'workshop':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'masterclass':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'camp':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    const found = categories.find(cat => cat.id === category);
    return found ? found.name : category;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <nav className="flex mb-6">
              <Link 
                to="/" 
                className="inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Home
              </Link>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover and participate in upcoming shooting sports events, workshops, and competitions.
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter Events
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filter by Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        activeFilter === category.id
                          ? 'bg-mangla-gold text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {isFilterOpen && (
              <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute inset-y-0 right-0 w-3/4 max-w-sm bg-white dark:bg-slate-800 shadow-xl p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filter Events</h3>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveFilter(category.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeFilter === category.id
                            ? 'bg-mangla-gold text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="flex-1">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
                  <p className="text-gray-500 dark:text-gray-400">There are no events in this category at the moment.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event) => (
                    <motion.div 
                      key={event.id}
                      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden ${
                        event.isFeatured ? 'ring-2 ring-mangla-gold' : ''
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="md:flex">
                        <div className="md:flex-shrink-0 md:w-1/3">
                          <div className="relative h-48 md:h-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder-event.jpg';
                              }}
                              onLoad={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.opacity = '1';
                              }}
                              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                            />
                            <div className="absolute top-3 left-3 z-10">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                                {getCategoryName(event.category)}
                              </span>
                              {event.isFeatured && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mangla-gold/90 text-white">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="h-6">
                            {/* This is a placeholder to maintain consistent spacing */}
                          </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-3 mb-2">
                              {event.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {event.description}
                            </p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {event.date}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {event.time}
                                </div>
                                <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <Link 
                                to={`/events/${event.id}`}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-mangla-gold hover:bg-mangla-gold-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mangla-gold transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { buildApiUrl, API_CONFIG } from '@/config/api';

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: { url: string; publicId: string } | string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(buildApiUrl(API_CONFIG.EVENTS.BY_SLUG(slug)));
        if (!response.ok) {
          if (response.status === 404) {
            setError('Event not found');
          } else {
            throw new Error('Failed to fetch event');
          }
          return;
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
    const categoryMap: { [key: string]: string } = {
      'competition': 'Competition',
      'workshop': 'Workshop',
      'masterclass': 'Masterclass',
      'camp': 'Training Camp'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {error || 'Event not found'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <nav className="flex mb-6">
            <Link 
              to="/events" 
              className="inline-flex items-center text-mangla-gold hover:text-mangla-gold-dark transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Events
            </Link>
          </nav>

          {/* Event Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className={`px-3 py-1 rounded-full ${getCategoryColor(event.category)}`}>
                  {getCategoryName(event.category)}
                </span>
                {event.isFeatured && (
                  <span className="px-3 py-1 bg-mangla-gold/10 text-mangla-gold rounded-full">
                    Featured Event
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {event.title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {event.description}
              </p>
            </header>

            {/* Featured Image */}
            {event.image && (
              <div className="mb-8">
                <img
                  src={typeof event.image === 'string' ? event.image : event.image.url}
                  alt={event.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Event Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Date</p>
                    <p className="text-slate-600 dark:text-slate-400">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Time</p>
                    <p className="text-slate-600 dark:text-slate-400">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Location</p>
                    <p className="text-slate-600 dark:text-slate-400">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            
          </motion.article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail; 
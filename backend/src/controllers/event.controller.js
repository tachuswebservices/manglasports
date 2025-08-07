import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvltehb8j',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Get all events (public)
export async function getEvents(req, res) {
  try {
    const { category, limit } = req.query;
    
    let where = {
      isPublished: true
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'asc'
      },
      take: limit ? parseInt(limit) : undefined
    });

    // Process events to ensure image field is properly formatted
    const processedEvents = events.map(event => {
      let processedImage = null;
      
      if (event.image) {
        // If image is already an object (parsed by Prisma), use it as is
        if (typeof event.image === 'object' && event.image !== null) {
          processedImage = event.image;
        }
        // If image is a string, try to parse it as JSON
        else if (typeof event.image === 'string') {
          try {
            processedImage = JSON.parse(event.image);
          } catch (e) {
            // If parsing fails, treat it as a direct URL string
            processedImage = event.image;
          }
        }
      }

      return {
        ...event,
        image: processedImage
      };
    });

    res.json({ events: processedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// Get all events (admin)
export async function getAllEvents(req, res) {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process events to ensure image field is properly formatted
    const processedEvents = events.map(event => {
      let processedImage = null;
      
      if (event.image) {
        // If image is already an object (parsed by Prisma), use it as is
        if (typeof event.image === 'object' && event.image !== null) {
          processedImage = event.image;
        }
        // If image is a string, try to parse it as JSON
        else if (typeof event.image === 'string') {
          try {
            processedImage = JSON.parse(event.image);
          } catch (e) {
            // If parsing fails, treat it as a direct URL string
            processedImage = event.image;
          }
        }
      }

      return {
        ...event,
        image: processedImage
      };
    });

    console.log('Processed events for admin:', processedEvents); // Debug log
    res.json({ events: processedEvents });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// Get single event by slug
export async function getEvent(req, res) {
  try {
    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Process event to ensure image field is properly formatted
    let processedImage = null;
    
    if (event.image) {
      // If image is already an object (parsed by Prisma), use it as is
      if (typeof event.image === 'object' && event.image !== null) {
        processedImage = event.image;
      }
      // If image is a string, try to parse it as JSON
      else if (typeof event.image === 'string') {
        try {
          processedImage = JSON.parse(event.image);
        } catch (e) {
          // If parsing fails, treat it as a direct URL string
          processedImage = event.image;
        }
      }
    }

    const processedEvent = {
      ...event,
      image: processedImage
    };

    res.json(processedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
}

// Create new event
export async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image, // { url, publicId }
      isFeatured,
      isPublished
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date),
        time,
        location,
        category,
        image: image ? JSON.stringify(image) : null,
        isFeatured: isFeatured || false,
        isPublished: isPublished || false
      }
    });

    // Process event to ensure image field is properly formatted
    let processedImage = null;
    
    if (event.image) {
      // If image is already an object (parsed by Prisma), use it as is
      if (typeof event.image === 'object' && event.image !== null) {
        processedImage = event.image;
      }
      // If image is a string, try to parse it as JSON
      else if (typeof event.image === 'string') {
        try {
          processedImage = JSON.parse(event.image);
        } catch (e) {
          // If parsing fails, treat it as a direct URL string
          processedImage = event.image;
        }
      }
    }

    const processedEvent = {
      ...event,
      image: processedImage
    };

    res.status(201).json(processedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Event with this title already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create event' });
    }
  }
}

// Update event
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image, // { url, publicId }
      isFeatured,
      isPublished
    } = req.body;

    // Generate slug from title if title is being updated
    let slug;
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(location && { location }),
        ...(category && { category }),
        ...(image !== undefined && { image: image ? JSON.stringify(image) : null }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isPublished !== undefined && { isPublished })
      }
    });

    // Process event to ensure image field is properly formatted
    let processedImage = null;
    
    if (event.image) {
      // If image is already an object (parsed by Prisma), use it as is
      if (typeof event.image === 'object' && event.image !== null) {
        processedImage = event.image;
      }
      // If image is a string, try to parse it as JSON
      else if (typeof event.image === 'string') {
        try {
          processedImage = JSON.parse(event.image);
        } catch (e) {
          // If parsing fails, treat it as a direct URL string
          processedImage = event.image;
        }
      }
    }

    const processedEvent = {
      ...event,
      image: processedImage
    };

    res.json(processedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Event with this title already exists' });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.status(500).json({ error: 'Failed to update event' });
    }
  }
}

// Delete event
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    // Find event to get image publicId
    const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    // Delete image from Cloudinary if exists
    if (event.image) {
      try {
        const imgObj = JSON.parse(event.image);
        if (imgObj && imgObj.publicId) {
          await cloudinary.v2.uploader.destroy(imgObj.publicId);
        }
      } catch (e) {
        console.error('Failed to delete event image from Cloudinary:', e);
      }
    }
    await prisma.event.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  }
}

// Get event categories
export async function getEventCategories(req, res) {
  try {
    const categories = await prisma.event.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories.map(cat => cat.category);
    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Error fetching event categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
} 
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      readTime,
      isFeatured,
      seoTitle,
      seoDescription,
      status,
      author
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags: tags || [],
        readTime: readTime || 5,
        isFeatured: isFeatured || false,
        seoTitle,
        seoDescription,
        status: status || 'draft',
        authorName: author || null,
        publishedAt: status === 'published' ? new Date() : null
      }
    });

    res.status(201).json(blogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

// Get all blog posts with pagination and filters
const getBlogPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'published',
      search,
      featured
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          category: true,
          tags: true,
          status: true,
          readTime: true,
          views: true,
          isFeatured: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          authorName: true,
          _count: {
            select: {
              comments: true
            }
          }
        }
      }),
      prisma.blogPost.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
};

// Get a single blog post by slug
const getBlogPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        category: true,
        tags: true,
        status: true,
        readTime: true,
        views: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        authorName: true,
        comments: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            },
            replies: {
              where: { isApproved: true },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};

// Update a blog post
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      readTime,
      isFeatured,
      seoTitle,
      seoDescription,
      status,
      author
    } = req.body;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags: tags || [],
        readTime: readTime || 5,
        isFeatured: isFeatured || false,
        seoTitle,
        seoDescription,
        status: status || 'draft',
        authorName: author || null,
        publishedAt: status === 'published' && existingPost.status !== 'published' ? new Date() : existingPost.publishedAt
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};

// Create a comment
const createComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Auto-approve comments for admin users
    const isApproved = req.user.role === 'admin';

    const comment = await prisma.blogComment.create({
      data: {
        postId: parseInt(postId),
        userId: req.user.id,
        content,
        parentId: parentId ? parseInt(parentId) : null,
        isApproved
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [comments, total] = await Promise.all([
      prisma.blogComment.findMany({
        where: {
          postId: parseInt(postId),
          isApproved: true,
          parentId: null // Only top-level comments
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          replies: {
            where: { isApproved: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.blogComment.count({
        where: {
          postId: parseInt(postId),
          isApproved: true,
          parentId: null
        }
      })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalComments: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Approve/Reject comment (admin only)
const moderateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to moderate comments' });
    }

    const comment = await prisma.blogComment.update({
      where: { id: parseInt(id) },
      data: { isApproved }
    });

    res.json(comment);
  } catch (error) {
    console.error('Error moderating comment:', error);
    res.status(500).json({ error: 'Failed to moderate comment' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.blogComment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.blogComment.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// Get blog categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.blogPost.groupBy({
      by: ['category'],
      where: { status: 'published' },
      _count: {
        category: true
      }
    });

    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat._count.category
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get featured posts
const getFeaturedPosts = async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
        isFeatured: true
      },
      take: parseInt(limit),
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        category: true,
        tags: true,
        status: true,
        readTime: true,
        views: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        authorName: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ error: 'Failed to fetch featured posts' });
  }
};

export {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createComment,
  getComments,
  moderateComment,
  deleteComment,
  getCategories,
  getFeaturedPosts
}; 
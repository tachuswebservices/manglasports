import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllOrders(req, res) {
  try {
    const { page = 1, limit = 10, search = '', status = '', dateFilter = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    let whereClause = {};
    
    // Search by order ID or user name
    if (search) {
      whereClause.OR = [
        { id: { equals: parseInt(search) || 0 } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Date filtering
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          break;
        case 'yesterday':
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
          break;
        case 'lastWeek':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'lastMonth':
          startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (startDate) {
        whereClause.createdAt = { gte: startDate };
      }
    }

    // Get orders with pagination and include all necessary relations
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        address: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true
              }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNum,
    });

    // Filter by status if specified
    let filteredOrders = orders;
    if (status && status !== 'all') {
      filteredOrders = orders.filter(order => 
        order.orderItems.some(item => item.status === status)
      );
    }

    // Get total count for pagination (considering status filter)
    let totalOrders;
    if (status && status !== 'all') {
      // If status filter is applied, we need to count filtered results
      const allOrders = await prisma.order.findMany({
        where: whereClause,
        include: {
          orderItems: true
        }
      });
      totalOrders = allOrders.filter(order => 
        order.orderItems.some(item => item.status === status)
      ).length;
    } else {
      // No status filter, use regular count
      totalOrders = await prisma.order.count({ where: whereClause });
    }

    // Ensure orderItems have proper structure
    const processedOrders = filteredOrders.map(order => ({
      ...order,
      orderItems: order.orderItems.map(item => ({
        ...item,
        name: item.name || item.product?.name || 'Unknown Product',
        price: item.price || item.product?.price || 0,
        images: item.product?.images || []
      }))
    }));

    res.json({
      orders: processedOrders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        totalOrders,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalOrders / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, product: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function createOrder(req, res) {
  try {
    const { userId, addressId, totalAmount, paymentId, products } = req.body;
    if (!userId || !addressId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
        paymentId,
        orderItems: {
          create: products.map(prod => ({
            productId: prod.productId,
            quantity: prod.quantity,
            price: prod.price,
            name: prod.name,
            status: prod.status || 'pending',
            expectedDate: prod.expectedDate ? new Date(prod.expectedDate) : undefined,
            courierPartner: prod.courierPartner,
            trackingId: prod.trackingId,
          })),
        },
      },
      include: {
        orderItems: true,
        address: true,
        user: true,
      },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create order' });
  }
}

export async function updateOrder(req, res) {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order' });
  }
}

export async function deleteOrder(req, res) {
  try {
    await prisma.order.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete order' });
  }
}

// Count all orders
export async function countOrders() {
  return prisma.order.count();
}

// Update order item
export async function updateOrderItem(req, res) {
  try {
    const { id } = req.params;
    const { status, expectedDate, courierPartner, trackingId } = req.body;
    
    const orderItem = await prisma.orderItem.update({
      where: { id: Number(id) },
      data: {
        status,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        courierPartner,
        trackingId,
      },
      include: {
        order: {
          include: {
            user: true,
            address: true,
            orderItems: true,
          }
        }
      }
    });
    
    res.json(orderItem);
  } catch (err) {
    console.error('Error updating order item:', err);
    res.status(400).json({ error: 'Failed to update order item' });
  }
} 

// Get dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z')
        }
      };
    }

    // Get basic counts
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count(dateFilter);
    
    // Get order statistics
    const orders = await prisma.order.findMany({
      where: dateFilter,
      include: {
        orderItems: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Count order statuses
    const pendingOrders = orders.filter(order => 
      order.orderItems.some(item => item.status === 'pending')
    ).length;
    
    const completedOrders = orders.filter(order => 
      order.orderItems.every(item => item.status === 'completed')
    ).length;

    // Get monthly comparisons
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: thisMonthStart
        }
      }
    });

    const lastMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    });

    const thisMonthRevenueData = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: thisMonthStart
        }
      },
      select: {
        totalAmount: true
      }
    });

    const lastMonthRevenueData = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      },
      select: {
        totalAmount: true
      }
    });

    const thisMonthRevenue = thisMonthRevenueData.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastMonthRevenue = lastMonthRevenueData.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get recent orders for dashboard
    const recentOrders = await prisma.order.findMany({
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            images: true,
            price: true
          }
        });
        return {
          ...product,
          totalSold: item._sum.quantity
        };
      })
    );

    // Get user growth (new users this month vs last month)
    const thisMonthUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thisMonthStart
        }
      }
    });

    const lastMonthUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    });

    // Calculate average order value
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Get order status breakdown
    const orderStatusBreakdown = {
      pending: orders.filter(order => 
        order.orderItems.some(item => item.status === 'pending')
      ).length,
      shipped: orders.filter(order => 
        order.orderItems.some(item => item.status === 'shipped')
      ).length,
      delivered: orders.filter(order => 
        order.orderItems.some(item => item.status === 'delivered')
      ).length,
      completed: completedOrders,
      cancelled: orders.filter(order => 
        order.orderItems.some(item => item.status === 'cancelled')
      ).length
    };

    res.json({
      products: totalProducts,
      orders: totalOrders,
      users: totalUsers,
      totalRevenue,
      pendingOrders,
      completedOrders,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthRevenue,
      lastMonthRevenue,
      thisMonthUsers,
      lastMonthUsers,
      averageOrderValue,
      orderStatusBreakdown,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        status: order.orderItems.every(item => item.status === 'completed') ? 'completed' : 'in_progress',
        customerName: order.user.name,
        itemsCount: order.orderItems.length
      })),
      topProducts: topProductDetails
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
} 

// Get orders for a specific user
export async function getUserOrders(req, res) {
  try {
    const { userId } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where: { userId: parseInt(userId) }
    });

    // Get orders with pagination
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNum,
    });

    res.json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalOrders / limitNum),
        totalOrders,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalOrders / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
} 
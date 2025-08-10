# Controllers & Routes

## Structure
- All controllers are in `backend/src/controllers/`
- All routes are in `backend/src/routes/`

## Mapping
- **Products**: `product.controller.js` / `product.routes.js`
- **Categories**: `category.controller.js` / `category.routes.js`
- **Brands**: `brand.controller.js` / `brand.routes.js`
- **Cart**: `cart.controller.js` / `cart.routes.js`
- **Wishlist**: `wishlist.controller.js` / `wishlist.routes.js`
- **Orders**: `order.controller.js` / `order.routes.js`
  - `updateOrderItem` - Basic order item status update
  - `updateOrderItemWithEmail` - Order item status update with email confirmation for shipped/delivered/rejected statuses
- **Users**: `user.controller.js` / `user.routes.js`

Each route file defines the RESTful endpoints and connects them to the appropriate controller functions. 
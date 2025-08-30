# SupplySight - Inventory Management Dashboard

A modern inventory management system built with React and GraphQL that helps you track stock levels, manage demand, and transfer inventory between warehouses.

## What This App Does

SupplySight gives you a clear view of your inventory across multiple warehouses. You can:
- **View stock levels** and demand for all products
- **Track trends** with interactive charts showing stock vs demand over time
- **Update demand forecasts** for individual products
- **Transfer stock** between warehouses
- **Filter and search** products by warehouse, status, or name
- **Monitor critical stock levels** with color-coded status indicators

## Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **Docker** (for the database)
- **Git**

### 1. Get the Code
```bash
git clone <your-repo-url>
cd SupplySight
```

### 2. Start the Database
```bash
cd server-graphql
docker-compose up -d
```
This starts a MongoDB database in a Docker container.

### 3. Start the Backend Server
```bash
# In the server-graphql folder
npm install
npm run dev
```
The GraphQL server will start at `http://localhost:4000/graphql`

### 4. Start the Frontend
```bash
# In a new terminal, go to the inventory-dashboard folder
cd "inventory-dashboard "
npm install
npm run dev
```
The dashboard will open at `http://localhost:5173`

## How to Use

1. **Dashboard Overview**: See total stock, demand, and fill rate at the top
2. **Trend Chart**: View how stock and demand change over 7, 14, or 30 days
3. **Product Table**: Browse all products with search and filtering
4. **Product Actions**: Click any product row to update demand or transfer stock
5. **Status Colors**: 
   - 🟢 Green = Healthy (stock > demand)
   - 🟡 Yellow = Low (stock = demand)  
   - 🔴 Red = Critical (stock < demand)

## Project Structure

```
SupplySight/
├── server-graphql/          # Backend GraphQL API
│   ├── models/             # Database schemas
│   ├── resolvers.ts        # GraphQL resolvers
│   ├── typeDef.ts         # GraphQL schema
│   ├── server.ts          # Express + Apollo server
│   └── docker-compose.yml # MongoDB setup
└── inventory-dashboard/     # Frontend React app
    ├── src/
    │   ├── components/     # UI components
    │   ├── lib/           # Utilities
    │   └── App.tsx        # Main app
    └─��� package.json
```

## Technology Choices & Why

### Frontend
- **React + TypeScript**: Type safety and modern development experience
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Rapid UI development with consistent design
- **Apollo Client**: Powerful GraphQL client with caching
- **Recharts**: Simple, responsive charts
- **Radix UI**: Accessible, unstyled components
- **Sonner**: Clean toast notifications

### Backend  
- **Node.js + Express**: JavaScript everywhere, fast development
- **Apollo Server**: Easy GraphQL API setup
- **MongoDB + Mongoose**: Flexible document database, good for product data
- **TypeScript**: Better code quality and developer experience

### Why These Choices
- **GraphQL**: Single endpoint, efficient data fetching, great developer tools
- **MongoDB**: Product data varies (different attributes), NoSQL fits well
- **Docker**: Easy database setup, consistent across environments
- **Component Library**: Radix UI gives accessibility without design constraints

## Design Decisions

### UI/UX
- **Mobile-first**: Responsive design that works on all screen sizes
- **Loading states**: Users always know when something is happening
- **Error handling**: Clear error messages with actionable feedback
- **Toast notifications**: Non-intrusive success/error feedback
- **Color coding**: Instant visual status recognition
- **Drawer interface**: Mobile-friendly product details

### Data Flow
- **Optimistic updates**: UI updates immediately, then syncs with server
- **Auto-refetch**: Data stays fresh after mutations
- **Error boundaries**: Graceful handling of unexpected errors

### Performance
- **Lazy loading**: Components load when needed
- **Efficient queries**: Only fetch required data
- **Caching**: Apollo Client caches for faster subsequent loads

## What I'd Improve With More Time

### Features
- **User authentication** and role-based permissions
- **Real-time updates** using GraphQL subscriptions
- **Bulk operations** (update multiple products at once)
- **Advanced filtering** (date ranges, custom queries)
- **Export functionality** (CSV, PDF reports)
- **Inventory alerts** (email/SMS when stock is low)
- **Audit trail** (track who changed what and when)
- **Forecasting** (predict future demand based on trends)

### Technical Improvements
- **Database optimization**: Indexes, query optimization
- **API rate limiting** and security hardening  
- **Comprehensive testing** (unit, integration, e2e)
- **CI/CD pipeline** for automated deployments
- **Error monitoring** (Sentry, logging)
- **Performance monitoring** (metrics, alerts)
- **Database migrations** for schema changes
- **API versioning** for backward compatibility

### Code Quality
- **Better TypeScript types** (stricter, more specific)
- **Code splitting** for smaller bundle sizes
- **Accessibility improvements** (ARIA labels, keyboard navigation)
- **Internationalization** (multiple languages)
- **Better error boundaries** and fallback UIs
- **Performance profiling** and optimization

### Infrastructure
- **Production deployment** setup (Docker, Kubernetes)
- **Environment configuration** (dev, staging, prod)
- **Database backups** and disaster recovery
- **CDN** for static assets
- **Load balancing** for high availability

## Common Issues

### "Connection refused" error
- Make sure Docker is running: `docker ps`
- Check if MongoDB is up: `docker-compose ps`

### "Module not found" errors
- Run `npm install` in both folders
- Check Node.js version: `node --version`

### GraphQL errors
- Check server logs in the terminal
- Visit `http://localhost:4000/graphql` to test queries

### Frontend won't start
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check if port 5173 is available
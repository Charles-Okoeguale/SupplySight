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


## Descisions
I used Docker to run a MongoDB database with the seeded sample data instead of just using a mock API. This gives me a persistent, fully functional data store. This way, the app behaves more like it will in production.

With a real database, I can test queries, mutations, relationships, and performance more realistically. Docker makes it easy to run the same database setup on any machine without installing MongoDB manually—just start the container.

I chose MongoDB because it’s a flexible document database, which works well for storing product data. I used TypeScript to improve code quality and make development easier.

## Tradeoffs
Flexibility vs. Accuracy
Trade-off: A mock API can be easily changed to return any data you want.
A real DB is rigid—you need to seed it or modify schemas to adjust the data, which can slow development.
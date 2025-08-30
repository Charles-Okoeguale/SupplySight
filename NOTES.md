## What I'd Improve With More Time

### Features for Future Implementation
- Add/Delete Products: Enable the creation and removal of product entries from the system.
- User authentication and role-based permissions
- Real-time updates using GraphQL subscriptions
- Advanced filtering (date ranges, custom queries)
- Export functionality (CSV, PDF reports)
- Inventory alerts (email/SMS when stock is low)
- Audit trail (track who changed what and when)
- Forecasting (predict future demand based on trends)


## Descisions
I used 
TypeScript to build the application, which improved code quality and made development easier. TypeScript's static typing helped prevent common bugs and made the codebase more robust and maintainable.
Instead of a simple mock API, I chose to use 
Docker to run a MongoDB database that was seeded with the sample data. This approach gives the application a persistent and fully functional data store, making it behave more like a real-world production environment. With a real database, I could test queries, mutations, and data relationships more realistically. Docker makes it easy to set up the same database on any machine without a manual installation.
I chose MongoDB because it's a flexible document database, which is well-suited for the product data schema provided in the assignment.



## Tradeoffs
- Flexibility vs. Accuracy
A simple mock API is flexible and can be easily adjusted to return any data you want, which speeds up development.
Using a real database is more rigid; it requires proper schemas and data seeding, which can be slower but results in a more accurate and representative application.



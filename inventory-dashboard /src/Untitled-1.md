
Dashboard View
Initial Load: The user sees the main dashboard.

Top Bar: Displays "SupplySight" and a date range selector (7d, 14d, 30d). 7d is the default.
KPI Cards: Three cards show calculated values: Total Stock, Total Demand, and Fill Rate. These values correspond to the selected date range.
Line Chart: A chart visualizes the trend of stock versus demand over the chosen date period.
Filters: A row of interactive elements including a Search box, Warehouse dropdown, and Status dropdown.
Products Table: The table is populated with the first 10 products based on the default filters (all products, all statuses). It includes columns for Product, SKU, Warehouse, Stock, Demand, and Status.

Filter Interaction:
When a user types in the Search box or selects an option from the Warehouse or Status dropdowns, the data in the Products Table and all KPIs and the Line Chart update instantly to reflect the new filter criteria.

Pagination:
The user can click through the pages at the bottom of the table to view more product rows, with each page showing 10 items.
Product Details and Actions Drawer

Row Click:
Clicking any row in the Products Table triggers a side drawer to slide in from the right side of the screen.

Drawer Content:
The drawer displays detailed information for the selected product.
It contains two forms:
Update Demand: A form allowing the user to modify the demand for the product.
Transfer Stock: A form to manage stock transfers for the product.

Form Submission:
Submitting a form in the drawer (e.g., clicking "Save") triggers a data mutation.
Once the mutation is complete, the drawer closes, and the main dashboard view, including the KPIs, Line Chart, and Products Table, automatically refreshes to display the updated data.
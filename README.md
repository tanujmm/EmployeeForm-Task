# Employee Management System using JsonPowerDB

A single-page web application (SPA) for managing employee records, built with HTML, Bootstrap, and JavaScript, using **JsonPowerDB** as the backend database. This project demonstrates CRUD (Create, Read, Update, Delete) operations and record navigation without any page reloads.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete employee records seamlessly.
- **Intuitive Navigation**: Navigate through records using `First`, `Prev`, `Next`, and `Last` buttons.
- **Form Validation**: Client-side validation to ensure data integrity before saving.
- **Serverless Backend**: Leverages the power of JsonPowerDB, a high-performance NoSQL database, requiring zero server setup.
- **Responsive UI**: Built with Bootstrap for a clean and mobile-friendly interface.
- **State Management**: Uses browser localStorage to manage record navigation state.

## JsonPowerDB: Why It's Powerful

This project utilizes several key features of JsonPowerDB:
- **Schema-less JSON Storage**: Flexible data structure without predefined schema constraints.
- **RDBMS-like Capabilities**: Supports powerful commands like `GET NEXT RECORD`, `GET PREVIOUS RECORD`, etc., enabling easy navigation.
- **High Performance**: Built-in indexing (NETINDEX) ensures fast data retrieval.
- **Serverless Architecture**: Eliminates the need for traditional backend server management, reducing complexity and cost.

## Usage Guide

### 1. Creating a New Record
- Click the **"New"** button. This will clear the form and enable the input fields.
- Fill in all the employee details:
    - **Employee ID** (Key Attribute)
    - **Employee Name**
    - **Basic Salary**
    - **HRA**
    - **DA**
    - **Deduction**
- Click the **"Save"** button to commit the new record to the database.

### 2. Navigating Records
- Use the navigation buttons at the bottom of the form:
    - **First**: Load the first record in the database.
    - **Prev**: Load the previous record.
    - **Next**: Load the next record.
    - **Last**: Load the last record.

### 3. Updating an Existing Record
- You can load an existing record in two ways:
    1.  Enter the **Employee ID** and press `Tab` or click outside the field (`onchange` event).
    2.  Navigate to it using the **Prev/Next** buttons.
- Click the **"Edit"** button to enable editing (the Employee ID field will be locked as it is the key).
- Modify the details and click **"Change"** to update the record.

### 4. Resetting the Form
- Click the **"Reset"** button to clear the form and return to the default state.

### Key Functions in `index.js`:

- **`validateData()`**: Validates form inputs before saving.
- **`saveData()`**: Creates a new record using the `PUT` API.
- **`changeData()`**: Updates an existing record using the `UPDATE` API.
- **`getEmpFromEmpID()`**: Fetches a record by its key (Employee ID).
- **`getFirst()`, `getPrev()`, `getNext()`, `getLast()`**: Functions to navigate through records using JPDB's navigation commands.
- **`showData(jsonObj)`**: Populates the form with data from a JSON response.

## API Endpoints Used

The application interacts with the following JsonPowerDB endpoints:
- **`/api/irl`** (Index Relation Layer): Used for `GET` requests (e.g., `GET_BY_KEY`, `NEXT_RECORD`).
- **`/api/iml`** (Instance Mapping Layer): Used for `PUT` (Save) and `UPDATE` (Change) requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [JPInfotech](https://login2explore.com/) for providing JsonPowerDB.
- Bootstrap and jQuery teams for the frontend frameworks.



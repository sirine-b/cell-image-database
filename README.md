# Cell Image Database

<img src="frontend/src/logo2.png" width="250" title="Cell Image Database" alt="Cell Image Database" align="right" vspace="50">

The <strong>Cell Image Database</strong> is a comprehensive web application designed to streamline the management, storage, and analysis of cellular images. This platform addresses challenges faced by cellular biology researchers, such as the absence of centralized tools for storing and analyzing cell images, which often leads to inefficiencies in accessing, organizing, and cross-referencing data.

By centralizing image storage and automating cell counting, the application reduces manual errors and saves time, enabling researchers to focus on analyzing findings rather than repetitive tasks. Additionally, the platform enhances collaboration by providing seamless sharing and retrieval of data.

## Installation Instructions

### Step 1: Clone the Repository
1. Clone the repository from GitHub:
   ```bash
   git clone <https://github.com/sirine-b/cell-image-database.git>
   ```
2. Navigate to the cloned repository:
   ```bash
   cd <path to cell-image-database>
   ```

### Step 2: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create a React application:
   ```bash
   npx create-react-app .
   ```
3. Install the required dependencies:
   ```bash
   npm install axios react-router-dom redux react-redux
   ```

### Step 3: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```
3. Install the required dependencies:
   ```bash
   npm install express cors dotenv
   ```
4. Install the child process module for Node.js:
   ```bash
   npm install child_process
   ```
5. Make sure you have PostgreSQL installed. Check by verifying the PostgreSQL version:
   ```bash
   psql --version
   ```
   If PostgreSQL is not installed, download and install it from [PostgreSQL Official Website](https://www.postgresql.org/).

6. Install PostgreSQL adapter for Python:
   ```bash
   pip install psycopg2
   ```

### Step 4: Cellpose Installation
You can install Cellpose using native Python if you have **Python 3.8+**.

1. Create a Python virtual environment for Cellpose:
   ```bash
   python3 -m venv cellpose
   ```
2. Activate the virtual environment:
   - **Mac**:
     ```bash
     source cellpose/bin/activate
     ```
   - **Windows**:
     ```bash
     cellpose\Scripts\activate
     ```
3. Install Cellpose and its GUI:
   ```bash
   python -m pip install cellpose
   python -m pip install 'cellpose[gui]'  # Remove apostrophe if an error occurs
   ```
4. Test Cellpose by running:
   ```bash
   python -m cellpose
   ```
If you have problems installing or running Cellpose, please visit [Cellpose GitHub](https://github.com/MouseLand/cellpose).

## Running the App

### Step 1: Connect the PostgreSQL Database:
   - Ensure your PostgreSQL database is running.
   - Create a database and note down the login credentials (username and password).

### Step 2: Adjust the Login and Password in `server.js`:
   - Open the `server.js` file located in the backend directory.
   - Modify the database connection settings with your PostgreSQL credentials at 3 places (Cellpose, ImageUpload and count_cells.py):
     ```javascript
     const pool = new Pool({
       user: 'your-username',
       host: 'localhost',
       database: 'your-database-name',
       password: 'your-password',
       port: 5432,
     });
     ```

### Step 3: Run the Server:
   - In the backend directory, start the server:
     ```bash
     node server.js
     ```

### Step 4: Start the Frontend:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Start the React application:
     ```bash
     npm start
     ```

### Step 5. Access the Application:
   - Open your browser and go to `http://localhost:3000`.
   - The application should now be running.

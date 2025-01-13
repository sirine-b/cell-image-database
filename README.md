# Cell Image Database

<img src="frontend/src/logo2.png" width="250" title="Cell Image Database" alt="Cell Image Database" align="right" vspace="50">

The <strong>Cell Image Database</strong> is a comprehensive web application designed to streamline the management, storage, and analysis of cellular images. This platform addresses challenges faced by cellular biology researchers, such as the absence of centralized tools for storing and analyzing cell images, which often leads to inefficiencies in accessing, organizing, and cross-referencing data.

By centralizing image storage and automating cell counting, the application reduces manual errors and saves time, enabling researchers to focus on analyzing findings rather than repetitive tasks. Additionally, the platform enhances collaboration by providing seamless sharing and retrieval of data.

## Installation Instructions

### Install Node.js and PostgreSQL
Install Node from [Node Download](https://nodejs.org/en/download) and add Node to their system environment variables. Download and install PostgreSQL from [PostgreSQL Official Website](https://www.postgresql.org/). Remember your Username and Password when setting up PostgreSQL as it will be required later.

### Step 1: Clone the Repository
1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/sirine-b/cell-image-database.git
   ```
2. Navigate to the cloned repository:
   ```bash
   cd cell-image-database
   ```

### Step 2: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install axios react-router-dom redux react-redux
   ```

### Step 3: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install express cors dotenv
   ```
3. Install the child process module for Node.js:
   ```bash
   npm install child_process
   ```
4. Make sure you have PostgreSQL installed. Check by verifying the PostgreSQL version:
   ```bash
   psql --version
   ```
   If PostgreSQL is not installed, download and install it from [PostgreSQL Official Website](https://www.postgresql.org/).

5. Install PostgreSQL adapter for Python:
   ```bash
   pip install psycopg2
   ```

### Step 4: Cellpose Installation
You can install Cellpose using native Python if you have **Python 3.8+**.

1. Create a Python virtual environment for Cellpose in **backend**:
   ```bash
   python3 -m venv cellpose
   ```
2. Activate the virtual environment:
   - **macOS/Linux**:
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

### Step 5: Run the Application

#### Step 1: Connect the PostgreSQL Database:
   - Start IntelliJ, find database (cell_image_db), right click to find properties.
   - Fill in the login credentials (username and password), then test connection. If successful, proceed, if not, update any data driver files required.
   - Paste the following into the PostgreSQL console in IntelliJ to create the tables:
     ```javascript
     CREATE DATABASE cell_image_db;

     \c cell_image_db

     CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         username VARCHAR(50) UNIQUE NOT NULL,
         password VARCHAR(100) NOT NULL
     );

     CREATE TABLE images (
         id SERIAL PRIMARY KEY,
         filepath VARCHAR(255) NOT NULL,
         Category VARCHAR(255) NOT NULL,
         Species VARCHAR(255) NOT NULL,
         Cellular_Component VARCHAR(255) NOT NULL,
         Biological_Process VARCHAR(255) NOT NULL,
         Shape VARCHAR(255) NOT NULL,
         Imaging_Modality VARCHAR(255) NOT NULL,
         Description VARCHAR(255) NOT NULL,
         DOI VARCHAR(255) NOT NULL,
         Number_Cells INT
     );

     CREATE TABLE favorites (
         id SERIAL PRIMARY KEY,
         user_id INTEGER REFERENCES users(id),
         image_id INTEGER REFERENCES images(id),
         UNIQUE(user_id, image_id)
     );
     ```
- Run the database console code.

#### Step 2: Adjust the Login and Password for the database:
   - Modify the database connection settings with your PostgreSQL credentials in server.js and count_cells.py :
     ```javascript
     const pool = new Pool({
       user: 'your-username',
       host: 'localhost',
       database: 'your-database-name',
       password: 'your-password',
       port: 5432,
     });
     ```

#### Step 3: Run the Server:
   - From IntelliJ, run server.js

#### Step 4: Start the Frontend:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Start the React application:
     ```bash
     npm start
     ```
   - The application should now be running.

# Tradecard

## About
CSC7062 Web Development Final Project

## Instructions to Run Locally

### Prerequisites
Make sure the following software is installed on your machine:
- XAMPP (Windows) or MAMP (Mac)
- Visual Studio Code

### Setup Instructions

1. **Clone the Repository:**
  
2. **XAMPP/MAMP:**
- Open XAMPP Control Panel (Windows) or MAMP application (Mac)

3. **Configure MySQL:**
- Ensure MySQL is running
- Change const PORT in index.js to which ever port you would like the REST API to run

4. **Open phpMyAdmin:**
- Create a new database named `tradecard`.
- Import `tradecard.sql` located in your project's system files.

5. **Install Dependencies:**
- within terminal :
- cd tradecard (enter)
- npm install (enter)
- cd apitradecard (enter)
- npm install (enter) cd .. (enter)
- npx nodemon (i.e. running npx nodemon in tradecard directory)

- You can now use the website locally.


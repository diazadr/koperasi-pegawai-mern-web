# Big Data-Based Employee Cooperative Analysis Website

![Project Status](https://img.shields.io/badge/status-completed-brightgreen) [![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

An advanced web-based analytical system for managing and analyzing cooperative (koperasi) transactions using **Big Data** and the **MERN Stack**. This project aims to streamline data upload, analysis, prediction, and reporting for employee cooperatives.

---

## **System Architecture**

The system is built using the **MERN Stack** architecture:

* **MongoDB** – NoSQL database for storing cooperative transaction data.
* **Express.js** – Backend framework for API handling and business logic.
* **React.js** – Interactive frontend for data visualization and dashboard analytics.
* **Node.js** – Runtime environment for running backend processes.
* **Database Name**: `db_kopeg`

### **Theme Modes**

1. **Dark Mode**

   <img src="https://github.com/user-attachments/assets/41041879-0bcc-4f51-a8f2-ef415cc1d160" alt="Dark Mode Screenshot 1" style="width: 600px; height: auto;">

   <img src="https://github.com/user-attachments/assets/6718c1a4-721e-4ea1-8927-e4921da18dd7" alt="Dark Mode Screenshot 2" style="width: 600px; height: auto;">

2. **Light Mode**

   <img src="https://github.com/user-attachments/assets/251ca4d9-0bcd-45be-96ce-e2f76d0e27f7" alt="Light Mode Screenshot 1" style="width: 600px; height: auto;">

   <img src="https://github.com/user-attachments/assets/70e0630f-350c-4cd2-bcd3-5b2dce487f27" alt="Light Mode Screenshot 2" style="width: 600px; height: auto;">

---

## **Key Features**

### **1. Monthly Data Upload**

Allows users to upload monthly cooperative transaction files in **CSV** or **Excel** format.

The system:

* Reads files using **csv-parser** and **xlsx** modules.
* Normalizes data with `normalizeDataSync()`.
* Stores data into MongoDB collections (**Purchases**, **Sales**, **Returns**, **Stock**).
* Replaces existing data for the same period with the latest uploads to ensure accuracy.

<img src="https://github.com/user-attachments/assets/5bdbd008-879e-4d99-acd1-2c88da464d49" alt="Monthly Data Upload" style="width: 600px; height: auto;">

---

### **2. Data Period Management**

Comprehensive period management handled by `getDaftarPeriode()` function:

* Retrieves all available periods (e.g., *2023-September*, *2025-May*).
* Sorts periods chronologically by year and month.
* Displays the status of each period (whether it contains purchase, sales, return, or stock data).

<img src="https://github.com/user-attachments/assets/6c1b2269-9c52-4df6-88d5-eed23c1c3069" alt="Data Period Management" style="width: 600px; height: auto;">

---

### **3. Analytical Dashboard & Prediction**

Main analytics handled by `getDashboardSummary()` function, displaying:

* Total **Purchases**, **Sales**, **Returns**, and **Stock Opname** per period.
* Cooperative **Profit/Loss Calculation** using the formula:

  ```
  Profit/Loss = Sales - Purchases - Returns
  ```

<img src="https://github.com/user-attachments/assets/c4afab24-bb17-4045-9d2c-d3a31e3f3fd1" alt="Profit Loss Dashboard" style="width: 600px; height: auto;">

* Monthly trends for Purchases and Sales (visualized as charts).

  <img src="https://github.com/user-attachments/assets/b347d07f-e04d-4215-8f87-4f63f7ce356f" alt="Monthly Trend Chart 1" style="width: 600px; height: auto;">

  <img src="https://github.com/user-attachments/assets/e5c3a850-19aa-4b47-884f-d717bb5ee0c3" alt="Monthly Trend Chart 2" style="width: 600px; height: auto;">

* **Top-Selling Products** by quantity and total value.

  <img src="https://github.com/user-attachments/assets/5f06b2f5-72e2-44b2-ba6b-fcb56e2d7938" alt="Top Selling Products" style="width: 600px; height: auto;">

* **Next-Year Predictions** for top-selling products and profits using historical data growth averages.

  <img src="https://github.com/user-attachments/assets/0baa2721-fa3e-48db-baa2-4e0dc1f62121" alt="Next Year Prediction 1" style="width: 600px; height: auto;">

  <img src="https://github.com/user-attachments/assets/0a73ba06-d5c4-4080-9753-40ddac2778cb" alt="Next Year Prediction 2" style="width: 600px; height: auto;">

---

### **4. Transaction Data Tables**

Displays four integrated tables representing monthly cooperative activities:

1. **Purchases Table** – Contains item codes, names, quantities, units, total prices, and transaction dates.

   <img src="https://github.com/user-attachments/assets/01c99ecd-17a3-4785-bd0c-4cd884f824fa" alt="Purchases Table" style="width: 600px; height: auto;">

2. **Sales Table** – Lists all sales transactions, useful for revenue and product performance analysis.

   <img src="https://github.com/user-attachments/assets/016e54af-c590-4d2e-a99c-263bd6ea2bc3" alt="Sales Table" style="width: 600px; height: auto;">

3. **Returns Table** – Records returned items to evaluate product quality and transactional accuracy.

   <img src="https://github.com/user-attachments/assets/4889b5d7-13cd-44a0-90e7-4a2e8b957573" alt="Returns Table" style="width: 600px; height: auto;">

4. **Stock Opname Table** – Compares physical vs. system inventory, detecting potential losses or mismatches.

   <img src="https://github.com/user-attachments/assets/74246e2f-8658-40b9-8c1b-a7816a924387" alt="Stock Opname Table" style="width: 600px; height: auto;">

These tables are interlinked, forming the foundation for accurate analytics and forecasting.

---

### **5. Excel Report Export**

The `exportDashboardExcel()` function enables the export of analysis reports to a formatted **Excel (.xlsx)** file containing:

* Summary of **Purchases**, **Sales**, **Returns**, and **Profit**.
* **Top 10 Selling Products** list.
* **Stock distribution** by category.
* **Sales and Purchase Trends**.
* **Predicted Profits and Sales** for the next year.

The exported file includes styled headers and organized sheets for easy interpretation. <img src="https://github.com/user-attachments/assets/f6a8753b-21b0-4983-8351-2137728b528f" alt="Excel Export" style="width: 600px; height: auto;">

---

## **Technologies Used**

* **MongoDB**
* **Express.js**
* **React.js**
* **Node.js**
* **csv-parser**, **xlsx**, **mongoose**, **chart.js**, **react-bootstrap**

---

## **Setup**

1. **Clone the repository**

   ```sh
   git clone https://github.com/username/bigdata-cooperative-analysis.git
   cd bigdata-cooperative-analysis
   ```
2. **Install dependencies**

   ```sh
   npm install
   ```
3. **Configure environment variables**

   ```sh
   cp .env.example .env
   ```

   * Set MongoDB connection URI
   * Configure API ports and frontend URLs
4. **Run the backend server**

   ```sh
   npm run server
   ```
5. **Run the frontend (React)**

   ```sh
   npm start
   ```
6. **Upload CSV/Excel files and start analyzing cooperative data**

---

## **Usage**

1. Upload monthly cooperative transaction data.
2. View analytics dashboard for trends, top products, and profits.
3. Generate predictive reports and export them to Excel.

---

## **Project Status**

This project is **completed** and serves as a final deliverable for cooperative data analytics research.

---

## **Contributions**

Contributions are welcome! You can open issues or submit pull requests for improvements.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

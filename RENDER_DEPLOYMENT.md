# Deploying Expense Tracker to Render

This guide provides step-by-step instructions for deploying the **Daily Expense Tracker** to [Render](https://render.com).

---

## Prerequisites
1. Push your latest code to your GitHub repository:
   ```powershell
   git add .
   git commit -m "Add Render Docker deployment configuration"
   git push origin main
   ```
2. A free [Render account](https://dashboard.render.com).

---

## Deployment Steps

### Method 1: Automatic Blueprint (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository: `Keerthana756-arch/expense_tracker`.
4. Render will automatically detect the [**`render.yaml`**](file:///C:/Users/keert/Desktop/expense_tracker/render.yaml) file.
5. Click **Apply**.
6. Render will build the multi-stage Docker image and deploy the app!

---

### Method 2: Manual Web Service Setup
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect:
   `https://github.com/Keerthana756-arch/expense_tracker`
4. Configure the settings:
   - **Name**: `expense-tracker` (or any name you prefer)
   - **Region**: Any preferred region (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Language / Runtime**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: **Free**
5. Under **Environment Variables**, add:
   - `PORT`: `8080`
   - `DATA_DIR`: `/app/data`
6. Click **Create Web Service**.

---

## How It Works
- **Multi-Stage Docker Build**:
  1. Compiles the modern React frontend with Vite.
  2. Embeds the static production bundle into Spring Boot's resources.
  3. Packages the standalone runnable JAR (`app.jar`).
  4. Runs inside an ultra-lightweight Alpine JRE 21 container.
- **Dynamic Port Binding**: Automatically adapts to Render's dynamic `$PORT`.
- **Health Check**: Configured on `/api/expenses/categories` for zero-downtime monitoring.

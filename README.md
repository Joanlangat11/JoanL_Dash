# Farmers Dashboard

A modern, elegant dashboard for agricultural data analysis, built with Python Flask API backend and React frontend.

## Features

- Interactive data visualizations with smooth transitions and animations
- Dynamic filtering system with cascading county, sub-county, and ward selections
- Responsive dashboard layout optimized for all device sizes
- Summary statistics and beautiful value boxes
- Data tables with sorting, pagination, and export functionality

## Tech Stack

### Backend
- Python Flask
- Flask-CORS for cross-origin resource sharing
- Mock data generation for demo purposes

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- React Table for data tables
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/farmers-dashboard.git
cd farmers-dashboard
```

2. Install frontend dependencies

```bash
npm install
```

3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server

```bash
python app.py
```

2. In a new terminal, start the frontend development server

```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:5173

### Building for Production

1. Build the frontend

```bash
npm run build
```

2. Deploy the Flask app with the built frontend

```bash
python app.py
```

## Docker Deployment

You can also run the application using Docker:

```bash
docker build -t farmers-dashboard .
docker run -p 5000:5000 farmers-dashboard
```

Then visit http://localhost:5000 in your browser.

## Project Structure

```
farmers-dashboard/
├── src/                       # Frontend React application
│   ├── components/            # React components
│   │   ├── charts/            # Chart components
│   │   ├── layout/            # Layout components
│   │   ├── tabs/              # Dashboard tab components
│   │   └── ui/                # UI components
│   ├── context/               # React context for data management
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── app.py                     # Flask backend server
├── requirements.txt           # Python dependencies
└── Dockerfile                 # Docker configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# NuxeoDocs - Document Management System

A modern document management system built with React, TypeScript, and ElysiaJS.

## Project Overview

NuxeoDocs is a document management application inspired by Nuxeo. It provides a clean, enterprise-ready interface for managing, viewing, and searching documents.

## Features

- Dashboard with document statistics
- Document browsing with filtering options
- Document preview and metadata viewing
- Search functionality
- User settings
- Responsive design

## Tech Stack

### Frontend
- React
- TypeScript
- TanStack Query for data fetching
- TanStack Table for data tables
- Tailwind CSS for styling
- shadcn/ui for UI components

### Backend
- Bun runtime
- ElysiaJS framework
- RESTful API endpoints

## Running the Application

### Running the Frontend

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:8080`.

### Running the Backend

```bash
# Navigate to the backend directory
cd backend

# Install Bun if you don't have it
# For macOS, Linux, and WSL
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start the development server
bun run dev
```

The backend API will be available at `http://localhost:3000`.

## API Endpoints

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/documents` - Get all documents (with optional collection filter)
- `GET /api/documents/:id` - Get a specific document by ID
- `GET /api/documents/recent` - Get recently modified documents
- `GET /api/search` - Search documents (with optional filters)

## Project Structure

```
├── backend/                 # Backend code
│   ├── mockData.json        # Mock data for the backend
│   ├── index.ts             # ElysiaJS entry point
│   └── package.json         # Backend dependencies
│
├── src/                     # Frontend code
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and API clients
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point
│
├── public/                  # Static assets
├── package.json             # Frontend dependencies
└── README.md                # Project documentation
```

## License

This project is licensed under the MIT License.

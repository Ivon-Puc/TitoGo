# Carpool System

Welcome to the Carpool Application repository! This project is a full-stack web application designed to facilitate ride-sharing among users. Built with modern web technologies, it allows users to sign up, sign in, share rides, search for available rides, and manage their ride requests. Below, you'll find all the necessary information to understand, set up, and contribute to this project.

## Preview

Here are some screenshots showcasing the application:

- **Sign up**
  ![Screenshot from 2025-01-28 20-21-58](https://github.com/user-attachments/assets/59d3a06c-c282-4fd8-85ed-212ac5ae390a)

- **Sign in**
![Screenshot from 2025-01-28 20-01-05](https://github.com/user-attachments/assets/3ba1ed60-609c-4083-be63-28c7cf953a03)

- **Home Page**
![Screenshot from 2025-01-28 20-00-38](https://github.com/user-attachments/assets/7e49fa5a-92a2-4cca-b1af-f46f0e64ba63)

- **Share Rides**
  ![Screenshot from 2025-01-28 20-05-31](https://github.com/user-attachments/assets/b68b117a-b71e-42ad-a247-976c115ce9ea)

- **Search Rides**
  ![Screenshot from 2025-01-28 20-12-17](https://github.com/user-attachments/assets/0e920364-2efc-40f7-9211-61b7e9be1758)

- **Ride Management**
![Screenshot from 2025-01-28 20-18-54](https://github.com/user-attachments/assets/dfe26117-e357-4c8a-bb11-c663eb51ea62)
![Screenshot from 2025-01-28 20-19-57](https://github.com/user-attachments/assets/0261f333-f5ba-455d-9add-791785c4b2be)


## Features

- **User Authentication**: Secure sign-up and sign-in using JWT (JSON Web Tokens).
- **Ride Sharing**: Users can post rides with details like source, destination, time, and available seats.
- **Ride Search**: Users can request to join a ride, and the ride owner can approve, ignore or reject the request.
- **Ride Management**: Users can view their posted rides and the rides they are traveling to.
- **Interactive Map**: Powered by Leaflet and OpenStreetMap for visualizing ride routes.
- **UI Design**: Built with Tailwind CSS for a clean and visually appealing interface.



## Tech Stack

- **Frontend**: React, Leaflet & OpenStreetMap (for maps), Tailwind CSS
- **Backend**: Express, CORS, JWT
- **Database**: PostgreSQL (run using Docker)

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/flow.git
   ```

2. **Install dependencies**:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Set up PostgreSQL**:
   - Ensure Docker is installed and running.
   - Start a PostgreSQL container:
     ```bash
     docker run --name flow-postgres -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=flow -p 5432:5432 -d postgres
     ```

4. **Configure environment variables**:
   - Create a `.env` file in the backend directory with the following variables:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://your_user:your_password@localhost:5432/flow
     JWT_SECRET=your_jwt_secret
     ```

5. **Run the application**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm start
     ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request explaining your changes.

## Acknowledgments

- [React](https://reactjs.org/) for the frontend framework.
- [Express.js](https://expressjs.com/) for the backend framework.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Leaflet](https://leafletjs.com/) for map integration.
- [OpenStreetMap](https://www.openstreetmap.org/) for map data. 
- [PostgreSQL](https://www.postgresql.org/) for the database.

---

Happy carpooling 🚀


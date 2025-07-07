# Hot Take - Real-Time Polling App

Create, share, and participate in anonymous polls with real-time results visualization.

[https://cyeyyzqxgw.eu-west-3.awsapprunner.com/](https://cyeyyzqxgw.eu-west-3.awsapprunner.com/)

## Features

- **Anonymous polling**: No registration required - just vote and see results
- **Interactive charts**: Data visualization with ApexCharts
- **Poll creation**: Create custom polls with multiple options
- **Poll sharing**: Share polls via URL - polls are stored in MongoDB
- **Live results**: Votes update in real-time as others participate, with live chart animations
<br></br>
### Create a poll :

![create-poll](https://github.com/user-attachments/assets/74dd8a3c-98c8-4591-a31f-b6335da67d77)


### Vote in a poll :

![vote-poll](https://github.com/user-attachments/assets/b5e4dff5-7c53-4911-9257-11a2cf54d38e)

### And see the results immediately after voting :

![poll-results](https://github.com/user-attachments/assets/30a1c446-c193-4914-ae70-2f62670352d2)

## Tech Stack

### Frontend

- **Angular 20 (TypeScript)**
- **TailwindCSS**
- **ApexCharts** - Interactive data visualization library
- **Socket.IO Client** - room-based socket management for real-time updates

### Backend

- **Node.js/Express.js** - RESTful API design
- **MongoDB Atlas** - integrated with schema validation and seeding
- **Socket.IO** - room-based socket management for real-time updates

### DevOps & Deployment

- **Docker** - Containerization
- **Docker Compose** - Multi-container setup for development and production.
  - Ended up using a single container to deploy with AWS App Runner (by serving the Angular app from the Express backend)
- **AWS App Runner** - Cloud deployment, **AWS ECR** for container registry

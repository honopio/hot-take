# Hot Take - Real-Time Polling App

Create, share, and participate in anonymous polls with real-time results visualization.

[https://cyeyyzqxgw.eu-west-3.awsapprunner.com/](https://cyeyyzqxgw.eu-west-3.awsapprunner.com/)

## Features

- **Anonymous polling**: No registration required - just vote and see results
- **Interactive charts**: Data visualization with ApexCharts
- **Poll creation**: Create custom polls with multiple options
- **Poll sharing**: Share polls via URL - polls are stored in a MongoDB database
- **Live results**: Votes update in real-time as others participate, with live chart animations
<br></br>
### Create a poll :

![create-poll](https://github.com/user-attachments/assets/466d678a-fcba-43b9-9c4c-10a8d2bc10b4)



### Vote in a poll :

![vote-poll](https://github.com/user-attachments/assets/16027655-ebf6-45e7-ae6d-7baeb7499bcc)


### And see the results immediately after voting :

![poll-results](https://github.com/user-attachments/assets/a690b74e-50d9-4c53-a235-718a7f39e4e8)

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

### Deployment
- **Docker Compose** for local development.
- **AWS ECR** to store the single production image (contains compiled Angular frontend served by the Express backend and the backend API)
- **AWS App Runner** : serverless container service used to deploy the image from ECR.

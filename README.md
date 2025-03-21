# PDF Collaborator

A web application that allows users to upload, share, and collaborate on PDF documents through comments. Built with React, Node.js, Express, and MongoDB.

## Features

### User Authentication
- User registration and login
- Secure authentication using JWT tokens
- Protected routes for authenticated users

### PDF Management
- Upload PDF files (up to 10MB)
- View list of uploaded PDFs in dashboard
- Secure storage using AWS S3
- View PDFs directly in the browser

### Sharing & Collaboration
- Generate unique shareable links for PDFs
- Share PDFs with multiple users via email
- Real-time commenting system
- View comments from all collaborators
- Anonymous commenting support for shared links

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- react-pdf for PDF rendering
- Tailwind CSS for styling

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- AWS S3 for file storage
- Nodemailer for email notifications

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Storage: AWS S3

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS Account with S3 bucket
- Gmail account for email notifications

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=your_frontend_url
```

#### Frontend (.env)
```env
VITE_API_URL=your_backend_api_url
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pdf-collaborator.git
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Start the backend server
```bash
cd backend
npm start
```

5. Start the frontend development server
```bash
cd frontend
npm run dev
```

## Usage

1. Register/Login to access the dashboard
2. Upload PDFs using the upload button
3. Share PDFs by clicking the share button and entering recipient emails
4. Recipients will receive an email with a unique link to view the PDF
5. View and add comments on shared PDFs
6. Access your shared PDFs and their comments from the dashboard

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### PDF Management
- POST `/api/pdf/upload` - Upload new PDF
- GET `/api/pdf` - Get user's PDFs
- POST `/api/pdf/share` - Share PDF
- GET `/api/pdf/shared/:link` - Get shared PDF

### Comments
- POST `/api/comments` - Add comment
- GET `/api/comments/:pdfId` - Get PDF comments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments
- PDF.js for PDF rendering
- AWS S3 for file storage
- MongoDB Atlas for database hosting
- Vercel and Render for deployment
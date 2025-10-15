# BookBuddy - Book Sharing Platform

A comprehensive book sharing and management platform that enables users to share, borrow, and manage books within a community. BookBuddy provides a complete ecosystem for book enthusiasts to discover, request, and provide feedback on books while facilitating seamless communication between book owners and borrowers.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

### Core Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Email Verification**: OTP-based email verification during registration
- **Book Management**: Add, edit, delete, and manage personal book collections
- **Book Discovery**: Search and browse books with advanced filtering options
- **Borrowing System**: Request books from other users with approval workflow
- **Feedback & Rating**: Rate and review books with 5-star rating system
- **Real-time Chat**: Direct messaging between book owners and borrowers
- **User Profiles**: Comprehensive user dashboard and profile management
- **Admin Panel**: Administrative features for book approval and user management

### Advanced Features
- **Multi-image Upload**: Support for multiple book images with Cloudinary integration
- **Advanced Search**: Full-text search with multiple filter criteria
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live status updates for book availability
- **Email Notifications**: Welcome emails and verification OTP emails
- **Pagination**: Efficient handling of large datasets
- **Security**: Comprehensive security measures including input validation and authorization
- **Dark/Light Mode**: Theme toggle for better user experience

## Technology Stack

### Frontend
- **React.js** - Component-based UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Vite** - Build tool and development server

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Cloud Services
- **Cloudinary** - Image storage and management
- **MongoDB Atlas** - Cloud database hosting

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Cloudinary account for image storage

### Environment Variables

Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```env
PORT=5001
ALT_PORT=5002
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env)
```env
VITE_APP_API_URL=http://localhost:5001/api
VITE_APP_ALT_API_URL=http://localhost:5002/api
```

### Email Configuration

For OTP verification and welcome email functionality to work properly:

1. Use a Gmail account and create an App Password:
   - Go to your Google Account settings
   - Select "Security" > "2-Step Verification" > "App passwords"
   - Generate a new app password for "Mail" and "Other (Custom name)"
   - Use this password in your EMAIL_PASS environment variable

2. Email Features:
   - **OTP Verification**: 1-minute validity period for secure account verification
   - **Welcome Emails**: Personalized welcome messages sent after successful registration
   - **Development Mode**: In development mode, OTP is also included in API response for easier testing
   - **Production Mode**: In production mode, emails are sent to actual user mailboxes

## Installation

### Clone the repository
```bash
git clone https://github.com/prajwalbayari/BookBuddy.git
cd BookBuddy
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
BookBuddy/
├── backend/
│   ├── src/
│   │   ├── controller/        # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Database models
│   │   ├── router/           # API routes
│   │   ├── lib/              # Utilities and configurations
│   │   └── server.js         # Entry point
│   ├── uploads/              # Local file storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # Business logic
│   │   ├── lib/              # Utilities
│   │   └── App.jsx           # Main component
│   ├── public/               # Static assets
│   └── package.json
├── README.md
└── BookBuddy_Implementation_Guide.txt
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send verification OTP to email
- `POST /api/auth/verify-otp` - Verify OTP sent to email
- `POST /api/auth/resend-otp` - Resend verification OTP
- `POST /api/auth/signup` - Complete user registration after OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `POST /api/auth/adminLogin` - Admin login

### Book Endpoints
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `POST /api/books/:id/feedback` - Add book feedback

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/books` - Get user's books
- `GET /api/users/borrowed` - Get borrowed books

For detailed API documentation, see the [Implementation Guide](BookBuddy_Implementation_Guide.txt).

## Usage

### For Users

1. **Registration Process**: 
   - Enter your name and email
   - Receive OTP via email (valid for 1 minute)
   - Verify your email with the OTP
   - Complete registration with password
   - Receive welcome email
2. **Add Books**: Upload your books with images and descriptions
3. **Browse Books**: Search and filter through available books
4. **Request Books**: Send borrowing requests to book owners
5. **Manage Borrowing**: Track your borrowed and lent books
6. **Provide Feedback**: Rate and review books you've read
7. **Chat**: Communicate with other users about books

### For Admins

1. **Book Approval**: Review and approve/reject new book submissions
2. **User Management**: Manage user accounts and permissions
3. **Content Moderation**: Monitor and moderate user-generated content

## Key Features Walkthrough

### User Authentication & Email Verification
- Secure two-step registration process
- Email verification via one-time password (OTP)
- OTP expires after 1 minute for security
- Personalized welcome emails for new users
- JWT token-based authentication
- Secure password hashing
- Session management

### Book Management
- Upload multiple images for each book
- Add detailed descriptions and edition information
- Set availability status
- Track borrowing history

### Search & Discovery
- Text-based search across book titles and descriptions
- Filter by availability, rating, category
- Sort by date, popularity, rating
- Pagination for large result sets

### Borrowing System
- Request to borrow books from other users
- Owner approval/rejection workflow
- Status tracking (Available, Requested, Borrowed, Returned)
- Automatic notifications for status changes

### Feedback System
- 5-star rating system
- Written reviews and comments
- Average rating calculation
- One feedback per user per book restriction
- Feedback pagination and filtering

### Chat System
- Direct messaging between users
- Chat initiation from book details page
- Message history persistence
- Real-time communication capabilities

### UI & Experience
- Dark/Light theme toggling
- Responsive design for all screen sizes
- Toast notifications for important actions
- Intuitive navigation and user flow
- Email integration for critical notifications

## Contributing

We welcome contributions to BookBuddy! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Style

- Use ESLint configuration provided in the project
- Follow React best practices and hooks patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Security

BookBuddy implements several security measures:

- **Authentication**: JWT-based authentication with secure token storage
- **Password Security**: bcrypt hashing with appropriate salt rounds
- **Input Validation**: Comprehensive input validation and sanitization
- **File Upload Security**: File type validation and secure storage
- **API Security**: Rate limiting and request validation
- **Data Protection**: Secure HTTP headers and CORS configuration

## Testing

### Running Tests

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test
```

### Test Coverage

The project includes:
- Unit tests for components and functions
- Integration tests for API endpoints
- End-to-end tests for critical user journeys

## Deployment

### Production Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

### Environment Setup

For production deployment:
1. Set up MongoDB Atlas or production MongoDB instance
2. Configure Cloudinary for image storage
3. Set environment variables for production
4. Deploy backend to cloud platform (Heroku, Railway, etc.)
5. Deploy frontend to static hosting (Netlify, Vercel, etc.)

## Performance Considerations

- Image optimization with Cloudinary
- Database indexing for search queries
- Pagination for large datasets
- Lazy loading for images and components
- Caching strategies for frequently accessed data
- Bundle optimization for frontend assets

## Browser Support

BookBuddy supports modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

- Chat system currently uses polling instead of WebSockets
- Search could be enhanced with more advanced algorithms
- Mobile app is not yet available

## Roadmap

Future enhancements planned:
- Real-time chat with WebSocket integration
- Mobile application (React Native)
- Advanced recommendation system
- Social features (following users, groups)
- Enhanced analytics and reporting
- Multi-language support

## Support

If you encounter any issues or have questions:

1. Check the [Implementation Guide](BookBuddy_Implementation_Guide.txt) for detailed technical information
2. Search existing issues in the repository
3. Create a new issue with detailed description
4. Contact the development team

## Acknowledgments

- Thanks to all contributors who helped build this platform
- Inspired by the need for community-driven book sharing
- Built with modern web technologies and best practices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**BookBuddy** - Connecting book lovers, one book at a time.
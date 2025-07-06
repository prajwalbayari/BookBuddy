import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Home = () => {
  const features = [
    {
      title: 'Discover Books',
      description: 'Find your next favorite book from our vast collection',
      icon: '📚',
    },
    {
      title: 'Track Reading',
      description: 'Keep track of books you\'ve read and want to read',
      icon: '📖',
    },
    {
      title: 'Connect with Readers',
      description: 'Join a community of book lovers and share recommendations',
      icon: '👥',
    },
    {
      title: 'Personalized Recommendations',
      description: 'Get book suggestions based on your reading preferences',
      icon: '🎯',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="gradient-text">Book Buddy</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your personal reading companion that helps you discover, track, and enjoy books like never before.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Book Buddy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Reading Journey?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of readers who have already discovered their next favorite book.
        </p>
        <Link to="/signup">
          <Button variant="secondary" size="lg">
            Sign Up Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
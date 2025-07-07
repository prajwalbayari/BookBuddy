import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate reader with 15+ years in tech, dedicated to connecting readers worldwide.',
      avatar: '👩‍💼',
      gradient: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Mike Chen',
      role: 'Lead Developer',
      bio: 'Full-stack developer who loves building tools that make reading more enjoyable.',
      avatar: '👨‍💻',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Emma Davis',
      role: 'UX Designer',
      bio: 'Design enthusiast focused on creating intuitive and beautiful user experiences.',
      avatar: '👩‍🎨',
      gradient: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
    },
  ];

  const stats = [
    { label: 'Books in Library', value: '100K+', icon: '📚', color: 'text-blue-600' },
    { label: 'Active Readers', value: '50K+', icon: '👥', color: 'text-purple-600' },
    { label: 'Books Recommended', value: '1M+', icon: '⭐', color: 'text-green-600' },
    { label: 'Reading Communities', value: '500+', icon: '🏆', color: 'text-orange-600' },
  ];

  const values = [
    {
      title: 'Love for Reading',
      description: 'We believe reading enriches lives and opens minds to new possibilities and adventures.',
      icon: '📚',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Community First',
      description: 'Building genuine connections between readers is at the heart of everything we do.',
      icon: '🤝',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform to make reading more accessible and enjoyable.',
      icon: '🚀',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center py-16 sm:py-24 transform transition-all duration-700 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                📖 Our Story
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              About{' '}
              <span className="gradient-text">BookBuddy</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make reading more social, discoverable, and enjoyable for everyone. 
              BookBuddy connects readers, helps discover new books, and builds communities around shared reading experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
            }`}>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-6">
                🎯 Our Mission
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Connecting Readers with Great Books
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Reading is one of life's greatest pleasures, but finding the right book can be challenging. 
                  We believe that great books should be discoverable, and reading should be a shared experience.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  BookBuddy was created to solve this problem by connecting readers with books they'll love 
                  and communities of like-minded people who share their passion for reading.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  📚 Discovery
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  👥 Community
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🎯 Personalization
                </span>
              </div>
            </div>
            
            <div className={`transform transition-all duration-700 ease-out delay-300 ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
            }`}>
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-4">
              👨‍👩‍👧‍👦 Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet the People Behind BookBuddy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a passionate team of readers, developers, and designers committed to making your reading experience extraordinary.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-center ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 ${member.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <div className="text-3xl">{member.avatar}</div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              💎 Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we build products that truly serve our reading community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-center ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`w-12 h-12 ${value.bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                  <div className="text-2xl">{value.icon}</div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Reading Community
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to discover your next favorite book? Start your journey with BookBuddy today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Get Started Free
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
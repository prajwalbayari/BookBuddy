import Card from '../components/Card';
import Button from '../components/Button';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Passionate reader with 15+ years in tech, dedicated to connecting readers worldwide.',
      avatar: '👩‍💼',
    },
    {
      name: 'Mike Chen',
      role: 'Lead Developer',
      bio: 'Full-stack developer who loves building tools that make reading more enjoyable.',
      avatar: '👨‍💻',
    },
    {
      name: 'Emma Davis',
      role: 'UX Designer',
      bio: 'Design enthusiast focused on creating intuitive and beautiful user experiences.',
      avatar: '👩‍🎨',
    },
  ];

  const stats = [
    { label: 'Books in Library', value: '100K+' },
    { label: 'Active Readers', value: '50K+' },
    { label: 'Books Recommended', value: '1M+' },
    { label: 'Reading Communities', value: '500+' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          About <span className="gradient-text">Book Buddy</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to make reading more social, discoverable, and enjoyable for everyone. 
          Book Buddy connects readers, helps discover new books, and builds communities around shared reading experiences.
        </p>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Reading is one of life's greatest pleasures, but finding the right book can be challenging. 
              We believe that great books should be discoverable, and reading should be a shared experience.
            </p>
            <p className="text-gray-600 mb-6">
              Book Buddy was created to solve this problem by connecting readers with books they'll love 
              and communities of like-minded people who share their passion for reading.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                Discovery
              </span>
              <span className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                Community
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Personalization
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {member.name}
              </h3>
              <p className="text-primary-600 font-medium mb-4">
                {member.role}
              </p>
              <p className="text-gray-600 text-sm">
                {member.bio}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50 rounded-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Love for Reading
              </h3>
              <p className="text-gray-600">
                We believe reading enriches lives and opens minds to new possibilities.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Community First
              </h3>
              <p className="text-gray-600">
                Building genuine connections between readers is at the heart of everything we do.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We continuously improve our platform to make reading more accessible and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Join Our Community?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Discover your next favorite book and connect with fellow readers today.
        </p>
        <Button size="lg">
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default About;
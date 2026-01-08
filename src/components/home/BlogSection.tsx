import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogs = [
  {
    id: 1,
    title: 'Crafting Effective Learning Guide Line',
    author: 'ecredu',
    date: 'July 2, 2024',
    image: 'students',
    excerpt: 'Learn the best practices for effective learning and academic success.',
  },
  {
    id: 2,
    title: 'Career Opportunities in Aviation',
    author: 'ecredu',
    date: 'July 2, 2024',
    image: 'aviation',
    excerpt: 'Explore the vast career opportunities available in the aviation industry.',
  },
  {
    id: 3,
    title: 'Student Success Stories 2024',
    author: 'ecredu',
    date: 'July 2, 2024',
    image: 'success',
    excerpt: 'Read inspiring stories from our successful alumni and current students.',
  },
];

const BlogSection = () => {
  return (
    <section className="ecr-section bg-background">
      <div className="ecr-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Our Blog
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our Latest News
          </h2>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              className="ecr-card group overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="font-display text-lg">{blog.image}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {blog.date}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {blog.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{blog.excerpt}</p>

              {/* Read More */}
              <Link 
                to={`/blogs/${blog.id}`}
                className="inline-flex items-center text-primary font-medium text-sm gap-1 group-hover:gap-2 transition-all"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/blogs">
            <Button variant="outline" size="lg">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

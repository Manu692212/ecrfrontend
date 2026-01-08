import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  featured: boolean;
}

const BlogEditor = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Career Opportunities in Aviation Industry',
      excerpt: 'Explore the growing career prospects in the aviation sector and how ECR Academy prepares students for success.',
      content: 'The aviation industry is experiencing unprecedented growth...',
      author: 'ECR Team',
      date: '2024-01-15',
      category: 'Career Guidance',
      image: '/placeholder.svg',
      featured: true
    },
    {
      id: '2',
      title: 'Why Choose Aviation Management?',
      excerpt: 'Discover the benefits of pursuing a career in aviation management and the unique advantages at ECR.',
      content: 'Aviation management offers diverse career opportunities...',
      author: 'Faculty',
      date: '2024-01-10',
      category: 'Program Highlights',
      image: '/placeholder.svg',
      featured: false
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving blog data:', blogPosts);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateBlogPost = (id: string, field: keyof BlogPost, value: string | boolean) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id ? { ...post, [field]: value } : post
    ));
  };

  const addNewBlogPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      image: '/placeholder.svg',
      featured: false
    };
    setBlogPosts(prev => [...prev, newPost]);
  };

  const removeBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));
  };

  const categories = ['Career Guidance', 'Program Highlights', 'Industry News', 'Student Success', 'Events'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Blog Management
            </CardTitle>
            <CardDescription>
              Manage blog posts, articles, and news updates
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {blogPosts.map((post, index) => (
              <div key={post.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Blog Post {index + 1}</h4>
                  {blogPosts.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBlogPost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={post.title}
                      onChange={(e) => updateBlogPost(post.id, 'title', e.target.value)}
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={post.author}
                      onChange={(e) => updateBlogPost(post.id, 'author', e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={post.date}
                      onChange={(e) => updateBlogPost(post.id, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={post.category}
                      onChange={(e) => updateBlogPost(post.id, 'category', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={post.excerpt}
                    onChange={(e) => updateBlogPost(post.id, 'excerpt', e.target.value)}
                    placeholder="Enter brief excerpt"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={post.content}
                    onChange={(e) => updateBlogPost(post.id, 'content', e.target.value)}
                    placeholder="Enter full blog content"
                    rows={6}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`featured-${post.id}`}
                    checked={post.featured}
                    onChange={(e) => updateBlogPost(post.id, 'featured', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`featured-${post.id}`}>Featured Post</Label>
                </div>
              </div>
            ))}
            <Button onClick={addNewBlogPost} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Blog Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{post.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        {post.category}
                      </span>
                      {post.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogEditor;

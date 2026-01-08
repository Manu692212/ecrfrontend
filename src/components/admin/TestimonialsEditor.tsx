import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Aviation Manager',
      company: 'International Airlines',
      content: 'ECR Academy provided me with the perfect foundation for my career in aviation. The practical training and industry exposure were invaluable.',
      rating: 5,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Logistics Coordinator',
      company: 'Global Shipping Corp',
      content: 'The comprehensive curriculum and experienced faculty at ECR helped me secure my dream job. I highly recommend this institution.',
      rating: 5,
      image: '/placeholder.svg'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving testimonials data:', testimonials);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
    ));
  };

  const addNewTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      image: '/placeholder.svg'
    };
    setTestimonials(prev => [...prev, newTestimonial]);
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Testimonials Management
            </CardTitle>
            <CardDescription>
              Manage student testimonials and reviews
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
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Testimonial {index + 1}</h4>
                  {testimonials.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestimonial(testimonial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                      placeholder="Enter person's name"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                      placeholder="Enter job role"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={testimonial.company}
                      onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <select
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(testimonial.id, 'rating', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Testimonial Content</Label>
                  <Textarea
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
                    placeholder="Enter testimonial content"
                    rows={4}
                  />
                </div>
              </div>
            ))}
            <Button onClick={addNewTestimonial} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Testimonial
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{testimonial.company}</span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialsEditor;

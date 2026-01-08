import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  eligibility: string;
  fees: string;
  image: string;
}

const CoursesEditor = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'BCA + Aviation and Hospitality Management',
      description: 'Dual degree combining computer applications with aviation and hospitality operations.',
      duration: '3 Years',
      eligibility: '10+2 in any stream',
      fees: '₹68,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'BBA + Aviation and Hospitality Management',
      description: 'BBA curriculum enriched with aviation & hospitality industry exposure.',
      duration: '3 Years',
      eligibility: '10+2 with 45% marks',
      fees: '₹72,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      title: 'B.Com + Aviation and Hospitality Management',
      description: 'Commerce studies coupled with aviation and hospitality specialization.',
      duration: '3 Years',
      eligibility: '10+2 with Commerce subjects',
      fees: '₹70,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '4',
      title: 'BBA/BCA/B.Com + Artificial Intelligence',
      description: 'Add-on AI track for business, computing, and commerce students.',
      duration: '1 Year add-on',
      eligibility: 'Enrolled in BBA/BCA/B.Com',
      fees: '₹38,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '5',
      title: 'BBA/BCA/B.Com + Cyber Security',
      description: 'Cyber security foundation for students across management, tech, and commerce.',
      duration: '1 Year add-on',
      eligibility: 'Enrolled in BBA/BCA/B.Com',
      fees: '₹38,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '6',
      title: 'BBA/BCA/B.Com + Big Data Analytics',
      description: 'Big Data module focused on analytics workflows for modern businesses.',
      duration: '1 Year add-on',
      eligibility: 'Enrolled in BBA/BCA/B.Com',
      fees: '₹38,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '7',
      title: 'BBA/BCA/B.Com + Digital Marketing',
      description: 'Digital marketing certificate for commerce, business, and tech learners.',
      duration: '1 Year add-on',
      eligibility: 'Enrolled in BBA/BCA/B.Com',
      fees: '₹38,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '8',
      title: 'BBA/BCA/B.Com + Supply Chain Logistics',
      description: 'Supply chain and logistics specialization tailored for multidisciplinary students.',
      duration: '1 Year add-on',
      eligibility: 'Enrolled in BBA/BCA/B.Com',
      fees: '₹38,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '9',
      title: 'Paramedical Course',
      description: 'Hands-on training for paramedical services with practical hospital exposure.',
      duration: '2 Years',
      eligibility: '10+2 with PCB',
      fees: '₹1,20,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '10',
      title: 'BSC Nursing',
      description: 'Professional nursing degree covering clinical, theoretical, and practical care.',
      duration: '4 Years',
      eligibility: '10+2 with PCB & 45% marks',
      fees: '₹1,50,000 per year',
      image: '/placeholder.svg'
    },
    {
      id: '11',
      title: 'GNM Nursing',
      description: 'General nursing midwifery diploma with hospital internships.',
      duration: '3 Years',
      eligibility: '10+2 with PCB',
      fees: '₹1,10,000 per year',
      image: '/placeholder.svg'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving courses data:', courses);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const addNewCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: '',
      eligibility: '',
      fees: '',
      image: '/placeholder.svg'
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Courses Management
            </CardTitle>
            <CardDescription>
              Add, edit, and remove course offerings and details
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
            {courses.map((course, index) => (
              <div key={course.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Course {index + 1}</h4>
                  {courses.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCourse(course.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Course Title</Label>
                    <Input
                      value={course.title}
                      onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                      placeholder="Enter course title"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={course.duration}
                      onChange={(e) => updateCourse(course.id, 'duration', e.target.value)}
                      placeholder="e.g., 3 Years"
                    />
                  </div>
                  <div>
                    <Label>Eligibility</Label>
                    <Input
                      value={course.eligibility}
                      onChange={(e) => updateCourse(course.id, 'eligibility', e.target.value)}
                      placeholder="Enter eligibility criteria"
                    />
                  </div>
                  <div>
                    <Label>Fees</Label>
                    <Input
                      value={course.fees}
                      onChange={(e) => updateCourse(course.id, 'fees', e.target.value)}
                      placeholder="Enter course fees"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={course.description}
                    onChange={(e) => updateCourse(course.id, 'description', e.target.value)}
                    placeholder="Enter course description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <Button onClick={addNewCourse} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Course
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                <p className="text-muted-foreground mb-3">{course.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-muted-foreground">{course.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium">Eligibility:</span>
                    <p className="text-muted-foreground">{course.eligibility}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fees:</span>
                    <p className="text-muted-foreground">{course.fees}</p>
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

export default CoursesEditor;

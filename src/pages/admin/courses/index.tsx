import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CoursesList from './CoursesList';
import CourseForm from './CourseForm';

// Mock API functions - replace with actual API calls
const fetchCourse = async (id: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: 'Web Development Fundamentals',
        code: 'WD101',
        description: 'Learn the basics of web development',
        duration: '6 months',
        fee: 50000,
        status: 'active',
        seats: 30,
        startDate: new Date().toISOString().split('T')[0],
      });
    }, 500);
  });
};

const createCourse = async (data: any) => {
  console.log('Creating course:', data);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Math.random().toString(36).substr(2, 9), ...data });
    }, 1000);
  });
};

const updateCourse = async ({ id, ...data }: { id: string } & any) => {
  console.log('Updating course:', id, data);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, ...data });
    }, 1000);
  });
};

// Course Detail Component
function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id!), 
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <div className="space-x-2">
          <button 
            onClick={() => navigate(`/admin/courses/${id}/edit`)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Course
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Course Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Code</p>
              <p>{course.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{course.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Course Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>{course.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fee</p>
              <p>₹{course.fee?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available Seats</p>
              <p>{course.seats}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p>{new Date(course.startDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Course Component
function CreateCourse() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      navigate('/admin/courses');
    },
  });

  return (
    <CourseForm
      onSubmit={async (data) => {
        await createCourseMutation.mutateAsync(data);
      }}
      isLoading={createCourseMutation.isPending}
    />
  );
}

// Edit Course Component
function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id!),
    enabled: !!id,
  });
  
  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      navigate(`/admin/courses/${id}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <CourseForm
      defaultValues={course}
      isEdit
      onSubmit={async (data) => {
        if (!id) return;
        await updateCourseMutation.mutateAsync({ id, ...data });
      }}
      isLoading={updateCourseMutation.isPending}
    />
  );
}

// Main Courses Page Component
export default function CoursesPage() {
  return (
    <Routes>
      <Route path="/" element={<CoursesList />} />
      <Route path="new" element={<CreateCourse />} />
      <Route path=":id" element={<CourseDetail />} />
      <Route path=":id/edit" element={<EditCourse />} />
    </Routes>
  );
}

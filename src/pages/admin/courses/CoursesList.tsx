import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2, Eye, ArrowUpDown } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  code: string;
  duration: string;
  fee: number;
  status: 'active' | 'inactive';
  students: number;
};

export default function CoursesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Course; direction: 'asc' | 'desc' } | null>(null);

  // Mock data - replace with API call
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'BCA + Aviation and Hospitality Management',
      code: 'BCA-AHM',
      duration: '3 Years',
      fee: 68000,
      status: 'active',
      students: 320,
    },
    {
      id: '2',
      title: 'BBA + Aviation and Hospitality Management',
      code: 'BBA-AHM',
      duration: '3 Years',
      fee: 72000,
      status: 'active',
      students: 280,
    },
    {
      id: '3',
      title: 'B.Com + Aviation and Hospitality Management',
      code: 'BCOM-AHM',
      duration: '3 Years',
      fee: 70000,
      status: 'active',
      students: 260,
    },
    {
      id: '4',
      title: 'BBA/BCA/B.Com + Artificial Intelligence',
      code: 'AI-ADD',
      duration: '1 Year add-on',
      fee: 38000,
      status: 'active',
      students: 180,
    },
    {
      id: '5',
      title: 'BBA/BCA/B.Com + Cyber Security',
      code: 'CYBER-ADD',
      duration: '1 Year add-on',
      fee: 38000,
      status: 'active',
      students: 170,
    },
    {
      id: '6',
      title: 'BBA/BCA/B.Com + Big Data Analytics',
      code: 'BIGDATA-ADD',
      duration: '1 Year add-on',
      fee: 38000,
      status: 'active',
      students: 160,
    },
    {
      id: '7',
      title: 'BBA/BCA/B.Com + Digital Marketing',
      code: 'DM-ADD',
      duration: '1 Year add-on',
      fee: 38000,
      status: 'active',
      students: 150,
    },
    {
      id: '8',
      title: 'BBA/BCA/B.Com + Supply Chain Logistics',
      code: 'SCL-ADD',
      duration: '1 Year add-on',
      fee: 38000,
      status: 'active',
      students: 140,
    },
    {
      id: '9',
      title: 'Paramedical Course',
      code: 'PARAMED',
      duration: '2 Years',
      fee: 120000,
      status: 'active',
      students: 220,
    },
    {
      id: '10',
      title: 'BSC Nursing',
      code: 'BSC-NURS',
      duration: '4 Years',
      fee: 150000,
      status: 'active',
      students: 200,
    },
    {
      id: '11',
      title: 'GNM Nursing',
      code: 'GNM-NURS',
      duration: '3 Years',
      fee: 110000,
      status: 'active',
      students: 180,
    },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      // TODO: Implement delete API call
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const requestSort = (key: keyof Course) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredCourses = sortedCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center">
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>₹{course.fee.toLocaleString()}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/courses/${course.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/courses/${course.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination will go here */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}

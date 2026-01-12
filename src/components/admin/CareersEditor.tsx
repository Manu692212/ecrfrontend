import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  deadline: string;
  active: boolean;
}

const CareersEditor = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([
    {
      id: '1',
      title: 'Assistant Professor - Aviation Management',
      department: 'Aviation Studies',
      location: 'Udupi Campus',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹10-14 LPA',
      description: 'Lead the Aviation department with engaging lectures and hands-on training.',
      requirements: [
        'PhD/M.Tech in Aviation or related field',
        'Minimum 3 years of teaching experience',
        'Industry exposure preferred',
      ],
      deadline: '2024-05-31',
      active: true,
    },
    {
      id: '2',
      title: 'Digital Marketing Trainer',
      department: 'Management Studies',
      location: 'Mangalore Campus',
      type: 'Full-time',
      experience: '4+ years',
      salary: '₹8-12 LPA',
      description: 'Guide students through the latest digital marketing tactics and tools.',
      requirements: [
        'MBA with Digital Marketing specialization',
        'Hands-on experience with campaigns',
        'Strong communication skills',
      ],
      deadline: '2024-06-15',
      active: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCareers = async () => {
      setLoading(true);
      try {
        const setting = await settingsAPI.getByKey('careers.openings');
        if (setting?.value) {
          setSettingId(String(setting.id));
          const parsed = JSON.parse(setting.value);
          if (Array.isArray(parsed)) {
            setJobOpenings(
              parsed.map((job, index) => ({
                id: job.id ?? String(index + 1),
                title: job.title ?? '',
                department: job.department ?? '',
                location: job.location ?? '',
                type: job.type ?? 'Full-time',
                experience: job.experience ?? '',
                salary: job.salary ?? '',
                description: job.description ?? '',
                requirements: Array.isArray(job.requirements) ? job.requirements : [''],
                deadline: job.deadline ?? '',
                active: job.active ?? true,
              }))
            );
          }
        }
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          setError(err.message || 'Failed to load job openings.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  const handleSave = async () => {
    setError(null);
    try {
      const payload = jobOpenings.map((job, index) => ({
        ...job,
        id: job.id ?? String(index + 1),
      }));

      if (settingId) {
        await settingsAPI.update(settingId, {
          value: JSON.stringify(payload),
        });
      } else {
        const created = await settingsAPI.create({
          key: 'careers.openings',
          value: JSON.stringify(payload),
          type: 'json',
          group: 'careers',
          description: 'Careers page job listings',
          is_public: true,
        });
        const newId = created.setting?.id ?? created.id;
        if (newId) {
          setSettingId(String(newId));
        }
      }

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save job openings.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateJobOpening = (id: string, field: keyof JobOpening, value: any) => {
    setJobOpenings(prev => prev.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const addNewJobOpening = () => {
    const newJob: JobOpening = {
      id: Date.now().toString(),
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      salary: '',
      description: '',
      requirements: [''],
      deadline: '',
      active: true
    };
    setJobOpenings(prev => [...prev, newJob]);
  };

  const removeJobOpening = (id: string) => {
    setJobOpenings(prev => prev.filter(job => job.id !== id));
  };

  const updateRequirement = (jobId: string, index: number, value: string) => {
    setJobOpenings(prev => prev.map(job => {
      if (job.id === jobId) {
        const newRequirements = [...job.requirements];
        newRequirements[index] = value;
        return { ...job, requirements: newRequirements };
      }
      return job;
    }));
  };

  const addRequirement = (jobId: string) => {
    setJobOpenings(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, requirements: [...job.requirements, ''] };
      }
      return job;
    }));
  };

  const removeRequirement = (jobId: string, index: number) => {
    setJobOpenings(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, requirements: job.requirements.filter((_, i) => i !== index) };
      }
      return job;
    }));
  };

  const departments = ['Academics', 'Administration', 'Marketing', 'IT', 'Finance', 'HR'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Careers Management
          </CardTitle>
          <CardDescription>Loading job openings…</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Careers Management
            </CardTitle>
            <CardDescription>
              Manage job openings and career opportunities
            </CardDescription>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
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
            {jobOpenings.map((job, index) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Job Opening {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={job.active}
                        onChange={(e) => updateJobOpening(job.id, 'active', e.target.checked)}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    {jobOpenings.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeJobOpening(job.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={job.title}
                      onChange={(e) => updateJobOpening(job.id, 'title', e.target.value)}
                      placeholder="Enter job title"
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <select
                      value={job.department}
                      onChange={(e) => updateJobOpening(job.id, 'department', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={job.location}
                      onChange={(e) => updateJobOpening(job.id, 'location', e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>
                  <div>
                    <Label>Job Type</Label>
                    <select
                      value={job.type}
                      onChange={(e) => updateJobOpening(job.id, 'type', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Experience Required</Label>
                    <Input
                      value={job.experience}
                      onChange={(e) => updateJobOpening(job.id, 'experience', e.target.value)}
                      placeholder="e.g., 2+ years"
                    />
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <Input
                      value={job.salary}
                      onChange={(e) => updateJobOpening(job.id, 'salary', e.target.value)}
                      placeholder="e.g., ₹4-6 LPA"
                    />
                  </div>
                  <div>
                    <Label>Application Deadline</Label>
                    <Input
                      type="date"
                      value={job.deadline}
                      onChange={(e) => updateJobOpening(job.id, 'deadline', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Job Description</Label>
                  <Textarea
                    value={job.description}
                    onChange={(e) => updateJobOpening(job.id, 'description', e.target.value)}
                    placeholder="Enter job description"
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Requirements</Label>
                    <Button onClick={() => addRequirement(job.id)} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Requirement
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {job.requirements.map((requirement, reqIndex) => (
                      <div key={reqIndex} className="flex gap-2">
                        <Input
                          value={requirement}
                          onChange={(e) => updateRequirement(job.id, reqIndex, e.target.value)}
                          placeholder="Enter requirement"
                        />
                        {job.requirements.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeRequirement(job.id, reqIndex)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addNewJobOpening} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Job Opening
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobOpenings.filter(job => job.active).map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{job.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{job.salary}</div>
                    <div className="text-sm text-muted-foreground">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-3">{job.description}</p>
                
                <div>
                  <h5 className="font-medium mb-2">Requirements:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{requirement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            
            {jobOpenings.filter(job => job.active).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active job openings at the moment.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareersEditor;

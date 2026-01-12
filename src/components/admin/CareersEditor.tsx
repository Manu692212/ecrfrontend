import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';
import { settingsAPI } from '@/lib/api';
import {
  DEFAULT_JOB_OPENINGS,
  JobOpening,
  createEmptyJobOpening,
  normalizeJobOpenings,
  prepareJobOpeningsForSave,
  DEFAULT_PART_TIME_JOBS,
  PartTimeJob,
  createEmptyPartTimeJob,
  normalizePartTimeJobs,
  preparePartTimeJobsForSave,
} from '@/data/careers';

const CareersEditor = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(DEFAULT_JOB_OPENINGS);
  const [partTimeJobs, setPartTimeJobs] = useState<PartTimeJob[]>(DEFAULT_PART_TIME_JOBS);

  const [isEditing, setIsEditing] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [partTimeSettingId, setPartTimeSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCareers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [openingsSetting, partTimeSetting] = await Promise.all([
        settingsAPI.getByKey('careers.openings'),
        settingsAPI.getByKey('careers.part_time'),
      ]);

      if (openingsSetting?.value) {
        try {
          const parsed = JSON.parse(openingsSetting.value);
          const normalized = normalizeJobOpenings(parsed, { ensureRequirementEntry: true });
          setJobOpenings(normalized.length ? normalized : DEFAULT_JOB_OPENINGS);
        } catch (parseError) {
          console.error('Failed to parse job openings JSON', parseError);
          setJobOpenings(DEFAULT_JOB_OPENINGS);
        }
        setSettingId(String(openingsSetting.id));
      } else {
        setSettingId(null);
        setJobOpenings(DEFAULT_JOB_OPENINGS);
      }

      if (partTimeSetting?.value) {
        try {
          const parsed = JSON.parse(partTimeSetting.value);
          const normalized = normalizePartTimeJobs(parsed, { ensureEntry: true });
          setPartTimeJobs(normalized.length ? normalized : DEFAULT_PART_TIME_JOBS);
        } catch (parseError) {
          console.error('Failed to parse part-time jobs JSON', parseError);
          setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
        }
        setPartTimeSettingId(String(partTimeSetting.id));
      } else {
        setPartTimeSettingId(null);
        setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load careers data.');
      setJobOpenings(DEFAULT_JOB_OPENINGS);
      setPartTimeJobs(DEFAULT_PART_TIME_JOBS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  const handleSave = async () => {
    setError(null);
    try {
      const payload = prepareJobOpeningsForSave(jobOpenings);
      const partTimePayload = preparePartTimeJobsForSave(partTimeJobs);

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

      if (partTimeSettingId) {
        await settingsAPI.update(partTimeSettingId, {
          value: JSON.stringify(partTimePayload),
        });
      } else {
        const created = await settingsAPI.create({
          key: 'careers.part_time',
          value: JSON.stringify(partTimePayload),
          type: 'json',
          group: 'careers',
          description: 'Careers page part-time opportunities',
          is_public: true,
        });
        const newId = created.setting?.id ?? created.id;
        if (newId) {
          setPartTimeSettingId(String(newId));
        }
      }

      setIsEditing(false);
      await loadCareers();
    } catch (err: any) {
      setError(err.message || 'Failed to save job openings.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadCareers();
  };

  const updateJobOpening = (id: string, field: keyof JobOpening, value: any) => {
    setJobOpenings(prev => prev.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const addNewJobOpening = () => {
    setJobOpenings(prev => [...prev, createEmptyJobOpening()]);
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
        const updatedRequirements = job.requirements.filter((_, i) => i !== index);
        return {
          ...job,
          requirements: updatedRequirements.length ? updatedRequirements : [''],
        };
      }
      return job;
    }));
  };

  const updatePartTimeJob = (id: string, field: keyof PartTimeJob, value: any) => {
    setPartTimeJobs(prev => prev.map(job => (job.id === id ? { ...job, [field]: value } : job)));
  };

  const addPartTimeJob = () => {
    setPartTimeJobs(prev => [...prev, createEmptyPartTimeJob()]);
  };

  const removePartTimeJob = (id: string) => {
    setPartTimeJobs(prev => prev.filter(job => job.id !== id));
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

            <div className="pt-6 border-t">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Part-time Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Manage student part-time roles displayed on the careers page.
                </p>
              </div>

              <div className="space-y-4">
                {partTimeJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{job.title || 'Part-time Role'}</h4>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={job.active}
                            onChange={(e) => updatePartTimeJob(job.id, 'active', e.target.checked)}
                          />
                          Active
                        </label>
                        {partTimeJobs.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePartTimeJob(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={job.title}
                          onChange={(e) => updatePartTimeJob(job.id, 'title', e.target.value)}
                          placeholder="Part-time role title"
                        />
                      </div>
                      <div>
                        <Label>Stipend</Label>
                        <Input
                          value={job.stipend}
                          onChange={(e) => updatePartTimeJob(job.id, 'stipend', e.target.value)}
                          placeholder="e.g., ₹5,000/month"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={job.duration}
                          onChange={(e) => updatePartTimeJob(job.id, 'duration', e.target.value)}
                          placeholder="e.g., 6 months"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={job.description}
                        onChange={(e) => updatePartTimeJob(job.id, 'description', e.target.value)}
                        placeholder="Describe the role"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={addPartTimeJob} variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Part-time Role
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Openings</h3>
              {jobOpenings.filter(job => job.active).map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
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
                        Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Part-time Opportunities</h3>
              {partTimeJobs.filter(job => job.active).map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {job.stipend && <div className="font-semibold text-primary">{job.stipend}</div>}
                      {job.duration && <div>Duration: {job.duration}</div>}
                    </div>
                  </div>
                </div>
              ))}

              {partTimeJobs.filter(job => job.active).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active part-time opportunities at the moment.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareersEditor;

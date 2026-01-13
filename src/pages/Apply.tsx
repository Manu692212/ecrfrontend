import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, Briefcase, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { publicAPI } from '@/lib/api';

const applicationTypes = [
  { id: 'course', label: 'Course Enrollment', icon: GraduationCap, description: 'Apply for our degree programs' },
  { id: 'career', label: 'Career Application', icon: Briefcase, description: 'Join our team as faculty or staff' },
  { id: 'job', label: 'Part-time Job', icon: Clock, description: 'Student part-time opportunities' },
];

const courses = [
  'BCA + Aviation and Hospitality Management',
  'BBA + Aviation and Hospitality Management',
  'B.Com + Aviation and Hospitality Management',
  'BBA/BCA/B.Com + Artificial Intelligence',
  'BBA/BCA/B.Com + Cyber Security',
  'BBA/BCA/B.Com + Big Data Analytics',
  'BBA/BCA/B.Com + Digital Marketing',
  'BBA/BCA/B.Com + Supply Chain Logistics',
  'Paramedical Course',
  'BSC Nursing',
  'GNM Nursing',
];

const partTimeJobs = [
  'HR Intern',
  'Finance Assistant',
  'Event Management Coordinator',
  'Marketing Executive (Part-time)',
  'Administrative Support',
  'Other',
];

const Apply = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'course';
  
  const [applicationType, setApplicationType] = useState(initialType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    qualification: '',
    course: '',
    position: '',
    experience: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: any = {
      form_type: applicationType,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      title:
        applicationType === 'course'
          ? formData.course
          : formData.position || formData.course,
      message: formData.message,
      payload: {
        ...formData,
      },
    };

    try {
      await publicAPI.submitApplication(payload);
      toast({
        title: 'Application submitted!',
        description: "We'll review your application and contact you soon.",
      });
      setSubmitted(true);
    } catch (err: any) {
      const message = err?.message || 'Failed to submit application. Please try again.';
      setError(message);
      toast({
        title: 'Submission failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="ecr-section bg-hero-pattern min-h-[60vh] flex items-center">
          <div className="ecr-container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for your interest in ECR Academy. Our admissions team will review your 
                application and contact you within 2-3 business days.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Submit Another Application
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="ecr-section bg-hero-pattern">
        <div className="ecr-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Apply Now
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Start Your Application
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Choose your application type and fill in the required details
            </p>
          </div>
        </div>
      </section>

      {/* Application Type Selection */}
      <section className="py-12 bg-card">
        <div className="ecr-container">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {applicationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setApplicationType(type.id)}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  applicationType === type.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <type.icon className={`w-8 h-8 mb-4 ${
                  applicationType === type.id ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <h3 className="font-semibold text-foreground mb-1">{type.label}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="ecr-section bg-background">
        <div className="ecr-container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                {applicationType === 'course' && 'Course Enrollment Form'}
                {applicationType === 'career' && 'Career Application Form'}
                {applicationType === 'job' && 'Part-time Job Application'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name *"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="h-12"
                    />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12"
                    />
                    <Input
                      type="date"
                      placeholder="Date of Birth *"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <Textarea
                    placeholder="Full Address *"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                {/* Course-specific fields */}
                {applicationType === 'course' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Academic Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Highest Qualification *"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        required
                        className="h-12"
                      />
                      <Select onValueChange={(value) => setFormData({ ...formData, course: value })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Course *" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Career-specific fields */}
                {applicationType === 'career' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Professional Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Position Applying For *"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                        className="h-12"
                      />
                      <Input
                        placeholder="Years of Experience *"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        required
                        className="h-12"
                      />
                      <Input
                        placeholder="Highest Qualification *"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                {/* Job-specific fields */}
                {applicationType === 'job' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Job Preference
                    </h3>
                    <Select onValueChange={(value) => setFormData({ ...formData, position: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Position *" />
                      </SelectTrigger>
                      <SelectContent>
                        {partTimeJobs.map((job) => (
                          <SelectItem key={job} value={job}>
                            {job}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Current Course/Year (if student)"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="h-12"
                    />
                  </div>
                )}

                {/* Additional Message */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Additional Information
                  </h3>
                  <Textarea
                    placeholder="Any additional information or message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                    {error}
                  </p>
                )}

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Send className="w-5 h-5 animate-pulse" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;

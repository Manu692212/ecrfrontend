import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';

interface AdmissionData {
  title: string;
  subtitle: string;
  description: string;
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  requirements: Array<{
    category: string;
    items: string[];
  }>;
  importantDates: Array<{
    event: string;
    date: string;
    description: string;
  }>;
  contactInfo: {
    phone: string;
    email: string;
    office: string;
  };
}

const AdmissionEditor = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionData>({
    title: "Admission Process",
    subtitle: "Join ECR Academy - Your Gateway to Aviation Excellence",
    description: "Our admission process is designed to be simple and transparent. Follow the steps below to begin your journey with us.",
    process: [
      {
        step: 1,
        title: "Application Form",
        description: "Fill out the online application form with your personal and academic details."
      },
      {
        step: 2,
        title: "Document Submission",
        description: "Submit required documents including mark sheets, ID proof, and photographs."
      },
      {
        step: 3,
        title: "Counseling Session",
        description: "Attend a counseling session to understand the program and career opportunities."
      },
      {
        step: 4,
        title: "Fee Payment",
        description: "Complete the admission process by paying the required fees."
      }
    ],
    requirements: [
      {
        category: "Academic Requirements",
        items: [
          "10+2 or equivalent from recognized board",
          "Minimum 50% marks in qualifying examination",
          "Physics and Mathematics compulsory for Aviation courses"
        ]
      },
      {
        category: "Documents Required",
        items: [
          "10th and 12th mark sheets",
          "Transfer Certificate",
          "Migration Certificate (if applicable)",
          "Passport size photographs (4)",
          "Aadhar Card or ID proof"
        ]
      }
    ],
    importantDates: [
      {
        event: "Admission Start",
        date: "2024-01-15",
        description: "Online applications open"
      },
      {
        event: "Last Date for Application",
        date: "2024-05-31",
        description: "Submission deadline"
      },
      {
        event: "Counseling Begins",
        date: "2024-06-01",
        description: "Counseling sessions start"
      }
    ],
    contactInfo: {
      phone: "+91 1234567890",
      email: "admissions@ecracademy.com",
      office: "Admission Office, ECR Campus, Mangalore"
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving admission data:', admissionData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateField = (field: keyof AdmissionData, value: any) => {
    setAdmissionData(prev => ({ ...prev, [field]: value }));
  };

  const updateProcessStep = (index: number, field: string, value: string) => {
    setAdmissionData(prev => ({
      ...prev,
      process: prev.process.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const addProcessStep = () => {
    const newStep = {
      step: admissionData.process.length + 1,
      title: '',
      description: ''
    };
    updateField('process', [...admissionData.process, newStep]);
  };

  const removeProcessStep = (index: number) => {
    updateField('process', admissionData.process.filter((_, i) => i !== index));
  };

  const updateRequirement = (categoryIndex: number, itemIndex: number, value: string) => {
    setAdmissionData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, catIndex) => 
        catIndex === categoryIndex 
          ? {
              ...req,
              items: req.items.map((item, i) => i === itemIndex ? value : item)
            }
          : req
      )
    }));
  };

  const addRequirementItem = (categoryIndex: number) => {
    setAdmissionData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, index) => 
        index === categoryIndex 
          ? { ...req, items: [...req.items, ''] }
          : req
      )
    }));
  };

  const removeRequirementItem = (categoryIndex: number, itemIndex: number) => {
    setAdmissionData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, catIndex) => 
        catIndex === categoryIndex 
          ? {
              ...req,
              items: req.items.filter((_, i) => i !== itemIndex)
            }
          : req
      )
    }));
  };

  const updateImportantDate = (index: number, field: string, value: string) => {
    setAdmissionData(prev => ({
      ...prev,
      importantDates: prev.importantDates.map((date, i) => 
        i === index ? { ...date, [field]: value } : date
      )
    }));
  };

  const addImportantDate = () => {
    const newDate = {
      event: '',
      date: '',
      description: ''
    };
    updateField('importantDates', [...admissionData.importantDates, newDate]);
  };

  const removeImportantDate = (index: number) => {
    updateField('importantDates', admissionData.importantDates.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Admission Management
            </CardTitle>
            <CardDescription>
              Manage admission process, requirements, and important dates
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
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={admissionData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter admission page title"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={admissionData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={admissionData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Admission Process</Label>
                <Button onClick={addProcessStep} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {admissionData.process.map((step, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Step {index + 1}</h4>
                      {admissionData.process.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProcessStep(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={step.title}
                      onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                      placeholder="Step title"
                    />
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                      placeholder="Step description"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Requirements</Label>
              <div className="space-y-4">
                {admissionData.requirements.map((category, catIndex) => (
                  <div key={catIndex} className="border rounded-lg p-3 space-y-2">
                    <Input
                      value={category.category}
                      onChange={(e) => {
                        const newRequirements = [...admissionData.requirements];
                        newRequirements[catIndex] = { ...category, category: e.target.value };
                        updateField('requirements', newRequirements);
                      }}
                      placeholder="Category name"
                    />
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateRequirement(catIndex, itemIndex, e.target.value)}
                            placeholder="Requirement item"
                          />
                          {category.items.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeRequirementItem(catIndex, itemIndex)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button onClick={() => addRequirementItem(catIndex)} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Important Dates</Label>
                <Button onClick={addImportantDate} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>
              <div className="space-y-3">
                {admissionData.importantDates.map((date, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Date {index + 1}</h4>
                      {admissionData.importantDates.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeImportantDate(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        value={date.event}
                        onChange={(e) => updateImportantDate(index, 'event', e.target.value)}
                        placeholder="Event name"
                      />
                      <Input
                        type="date"
                        value={date.date}
                        onChange={(e) => updateImportantDate(index, 'date', e.target.value)}
                      />
                      <Input
                        value={date.description}
                        onChange={(e) => updateImportantDate(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Contact Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={admissionData.contactInfo.phone}
                  onChange={(e) => updateField('contactInfo', { ...admissionData.contactInfo, phone: e.target.value })}
                  placeholder="Phone number"
                />
                <Input
                  value={admissionData.contactInfo.email}
                  onChange={(e) => updateField('contactInfo', { ...admissionData.contactInfo, email: e.target.value })}
                  placeholder="Email address"
                />
                <Input
                  value={admissionData.contactInfo.office}
                  onChange={(e) => updateField('contactInfo', { ...admissionData.contactInfo, office: e.target.value })}
                  placeholder="Office address"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{admissionData.title}</h3>
              <p className="text-muted-foreground">{admissionData.subtitle}</p>
              <p className="text-muted-foreground mt-2">{admissionData.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Admission Process</h4>
              <div className="space-y-3">
                {admissionData.process.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {step.step}
                    </div>
                    <div>
                      <h5 className="font-medium">{step.title}</h5>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Requirements</h4>
              <div className="space-y-4">
                {admissionData.requirements.map((category, index) => (
                  <div key={index}>
                    <h5 className="font-medium mb-2">{category.category}</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Important Dates</h4>
              <div className="space-y-2">
                {admissionData.importantDates.map((date, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h5 className="font-medium">{date.event}</h5>
                      <p className="text-sm text-muted-foreground">{date.description}</p>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {new Date(date.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Phone:</span>
                  <p className="text-muted-foreground">{admissionData.contactInfo.phone}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-muted-foreground">{admissionData.contactInfo.email}</p>
                </div>
                <div>
                  <span className="font-medium">Office:</span>
                  <p className="text-muted-foreground">{admissionData.contactInfo.office}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdmissionEditor;

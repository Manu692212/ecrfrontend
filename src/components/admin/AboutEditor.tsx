import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';

interface AboutData {
  title: string;
  subtitle: string;
  description: string[];
  achievements: string[];
  stats: {
    distinctions: string;
    placement: string;
    ranks: string;
    students: string;
  };
  values: Array<{
    title: string;
    description: string;
  }>;
}

const AboutEditor = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: "ECR Group of Institutions",
    subtitle: "Reformation through education and charity - shaping the future of Aviation & Logistics",
    description: [
      "ECR Group of Institutions, under the ECR Trust, stands out with its innovative approach to education. Spread across approximately 40 acres, the campus is equipped with state-of-the-art facilities and offers a variety of degree courses approved by AICTE, Indian Nursing Council, Mangalore University, and Rajiv Gandhi University of Health Sciences.",
      "Unlike conventional degree courses such as BBA, BCA, B.Com, Aviation, Hotel Management, and Fashion Designing, which primarily focus on academics and achieving high results, ECR goes a step further. The institution emphasizes job-oriented courses like Artificial Intelligence, Data Science, Digital Marketing, Cyber Security, Airport Management, HR, Marketing, Finance, and Operations in collaboration with foreign companies.",
      "Part-time job opportunities in areas like HR, Finance, Operations, Advertising, Share Trading Consultancy, and Event Management are provided within the campus. Students earn a monthly income through these jobs, transitioning from candidates to professionals.",
      "ECR's unique vision was inspired by the realization that even students who graduate with high marks often struggle to secure well-paying jobs. The issue lies not in their abilities but in the traditional education methods, which fail to prepare them for the demands of the real world. ECR bridges this gap by focusing on planning and development to cultivate essential skills."
    ],
    achievements: [
      "AICTE Approved Programs",
      "Indian Nursing Council Recognition",
      "Mangalore University Affiliation",
      "Rajiv Gandhi University of Health Sciences Partnership",
      "40+ Acres State-of-the-art Campus",
      "International Collaboration with Foreign Companies"
    ],
    stats: {
      distinctions: "90%",
      placement: "100%",
      ranks: "4-5",
      students: "1L+"
    },
    values: [
      {
        title: "Vision",
        description: "To be the leading educational institution that transforms students into industry-ready professionals with global competence."
      },
      {
        title: "Mission",
        description: "To provide quality education combined with practical training, ensuring every student is equipped for success."
      },
      {
        title: "Excellence",
        description: "Consistently achieving 4 to 5 top ranks at the university level with 90% of students earning distinctions."
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving about data:', aboutData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateField = (field: keyof AboutData, value: any) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  const addAchievement = () => {
    updateField('achievements', [...aboutData.achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...aboutData.achievements];
    newAchievements[index] = value;
    updateField('achievements', newAchievements);
  };

  const removeAchievement = (index: number) => {
    updateField('achievements', aboutData.achievements.filter((_, i) => i !== index));
  };

  const addValue = () => {
    updateField('values', [...aboutData.values, { title: '', description: '' }]);
  };

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    const newValues = [...aboutData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    updateField('values', newValues);
  };

  const removeValue = (index: number) => {
    updateField('values', aboutData.values.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              About Page Content
            </CardTitle>
            <CardDescription>
              Edit about page content, achievements, and core values
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
                  value={aboutData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  value={aboutData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label>Description Paragraphs</Label>
              <div className="space-y-2">
                {aboutData.description.map((paragraph, index) => (
                  <Textarea
                    key={index}
                    value={paragraph}
                    onChange={(e) => {
                      const newDescription = [...aboutData.description];
                      newDescription[index] = e.target.value;
                      updateField('description', newDescription);
                    }}
                    rows={3}
                    placeholder={`Paragraph ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Achievements</Label>
                <Button onClick={addAchievement} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
              <div className="space-y-2">
                {aboutData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Enter achievement"
                    />
                    {aboutData.achievements.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label>Statistics</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Students with Distinctions</Label>
                  <Input
                    value={aboutData.stats.distinctions}
                    onChange={(e) => updateField('stats', { ...aboutData.stats, distinctions: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Placement Assistance</Label>
                  <Input
                    value={aboutData.stats.placement}
                    onChange={(e) => updateField('stats', { ...aboutData.stats, placement: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Top University Ranks</Label>
                  <Input
                    value={aboutData.stats.ranks}
                    onChange={(e) => updateField('stats', { ...aboutData.stats, ranks: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Students Trained</Label>
                  <Input
                    value={aboutData.stats.students}
                    onChange={(e) => updateField('stats', { ...aboutData.stats, students: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Core Values</Label>
                <Button onClick={addValue} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>
              <div className="space-y-4">
                {aboutData.values.map((value, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Value {index + 1}</h4>
                      {aboutData.values.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeValue(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        placeholder="Enter value title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        placeholder="Enter value description"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{aboutData.title}</h3>
              <p className="text-muted-foreground">{aboutData.subtitle}</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <div className="space-y-2">
                {aboutData.description.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground">{paragraph}</p>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Achievements</h4>
              <ul className="list-disc list-inside space-y-1">
                {aboutData.achievements.map((achievement, index) => (
                  <li key={index} className="text-muted-foreground">{achievement}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-bold text-primary">{aboutData.stats.distinctions}</div>
                  <p className="text-sm text-muted-foreground">Students with Distinctions</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{aboutData.stats.placement}</div>
                  <p className="text-sm text-muted-foreground">Placement Assistance</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{aboutData.stats.ranks}</div>
                  <p className="text-sm text-muted-foreground">Top University Ranks</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{aboutData.stats.students}</div>
                  <p className="text-sm text-muted-foreground">Students Trained</p>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Core Values</h4>
              <div className="space-y-2">
                {aboutData.values.map((value, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h5 className="font-medium">{value.title}</h5>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutEditor;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, Plus, Trash2, Users, BookOpen, GraduationCap, Building2 } from 'lucide-react';

interface StatItem {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

const StatsEditor = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { id: '1', icon: 'Users', value: 150, suffix: '+', label: 'Teachers' },
    { id: '2', icon: 'BookOpen', value: 20, suffix: '+', label: 'Courses' },
    { id: '3', icon: 'GraduationCap', value: 7000, suffix: '+', label: 'Students' },
    { id: '4', icon: 'Building2', value: 40, suffix: ' Acres', label: 'Campus' },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving stats data:', stats);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateStat = (id: string, field: keyof StatItem, value: any) => {
    setStats(prev => prev.map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  };

  const addNewStat = () => {
    const newStat: StatItem = {
      id: Date.now().toString(),
      icon: 'Users',
      value: 0,
      suffix: '+',
      label: 'New Stat'
    };
    setStats(prev => [...prev, newStat]);
  };

  const removeStat = (id: string) => {
    setStats(prev => prev.filter(stat => stat.id !== id));
  };

  const iconOptions = [
    'Users', 'BookOpen', 'GraduationCap', 'Building2', 'Award', 'Target', 'Heart'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Statistics Section
            </CardTitle>
            <CardDescription>
              Manage the statistics displayed on the home page
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
            {stats.map((stat, index) => (
              <div key={stat.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Stat {index + 1}</h4>
                  {stats.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStat(stat.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Icon</Label>
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStat(stat.id, 'value', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Suffix</Label>
                    <Input
                      value={stat.suffix}
                      onChange={(e) => updateStat(stat.id, 'suffix', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addNewStat} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Stat
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center p-4 border rounded-lg">
                  <div className="font-display text-2xl font-bold text-primary mb-2">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsEditor;

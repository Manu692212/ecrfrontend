import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, Plus, Trash2 } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface HeroData {
  mainHeading: string;
  subHeading: string;
  badgeText: string;
  enrollButtonText: string;
  contactButtonText: string;
  trustBadgeText: string;
}

const HeroEditor = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    mainHeading: "Welcome to India's Largest Aviation College",
    subHeading: "ECR Academy for Professional Training and Placements - A premier institute dedicated to shaping the future of Aviation & Logistics.",
    badgeText: "University Approved Institution",
    enrollButtonText: "Enroll Now",
    contactButtonText: "Contact Us",
    trustBadgeText: "Trusted by 1,00,000+ Students"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const setting = await settingsAPI.getByKey('home.hero');
        if (setting && setting.value) {
          setSettingId(String(setting.id));
          try {
            const parsed = JSON.parse(setting.value);
            setHeroData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse hero setting JSON', e);
          }
        }
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          console.error('Failed to load hero settings', err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      if (settingId) {
        const updated = await settingsAPI.update(settingId, {
          value: JSON.stringify(heroData),
        });
        setSettingId(String(updated.id ?? settingId));
      } else {
        const created = await settingsAPI.create({
          key: 'home.hero',
          value: JSON.stringify(heroData),
          type: 'json',
          group: 'home',
          description: 'Home hero section content',
          is_public: true,
        });
        const newId = created.setting?.id ?? created.id;
        if (newId) {
          setSettingId(String(newId));
        }
      }
      console.log('Saving hero data:', heroData);
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to save hero data', e);
      setError('Failed to save content. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Hero Section
            </CardTitle>
            <CardDescription>
              Edit the main hero section content including headings and buttons
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
        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading hero content...</p>
        ) : isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="mainHeading">Main Heading</Label>
                <Input
                  id="mainHeading"
                  value={heroData.mainHeading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, mainHeading: e.target.value }))}
                  placeholder="Enter main heading"
                />
              </div>
              <div>
                <Label htmlFor="subHeading">Sub Heading</Label>
                <Textarea
                  id="subHeading"
                  value={heroData.subHeading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, subHeading: e.target.value }))}
                  placeholder="Enter sub heading"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badgeText">Badge Text</Label>
                  <Input
                    id="badgeText"
                    value={heroData.badgeText}
                    onChange={(e) => setHeroData(prev => ({ ...prev, badgeText: e.target.value }))}
                    placeholder="Enter badge text"
                  />
                </div>
                <div>
                  <Label htmlFor="trustBadgeText">Trust Badge Text</Label>
                  <Input
                    id="trustBadgeText"
                    value={heroData.trustBadgeText}
                    onChange={(e) => setHeroData(prev => ({ ...prev, trustBadgeText: e.target.value }))}
                    placeholder="Enter trust badge text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="enrollButtonText">Enroll Button Text</Label>
                  <Input
                    id="enrollButtonText"
                    value={heroData.enrollButtonText}
                    onChange={(e) => setHeroData(prev => ({ ...prev, enrollButtonText: e.target.value }))}
                    placeholder="Enter enroll button text"
                  />
                </div>
                <div>
                  <Label htmlFor="contactButtonText">Contact Button Text</Label>
                  <Input
                    id="contactButtonText"
                    value={heroData.contactButtonText}
                    onChange={(e) => setHeroData(prev => ({ ...prev, contactButtonText: e.target.value }))}
                    placeholder="Enter contact button text"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Main Heading</h3>
              <p className="text-lg font-semibold">{heroData.mainHeading}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Sub Heading</h3>
              <p className="text-muted-foreground">{heroData.subHeading}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Badge Text</h3>
                <p className="text-sm">{heroData.badgeText}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Trust Badge Text</h3>
                <p className="text-sm">{heroData.trustBadgeText}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Enroll Button Text</h3>
                <p className="text-sm">{heroData.enrollButtonText}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Button Text</h3>
                <p className="text-sm">{heroData.contactButtonText}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeroEditor;

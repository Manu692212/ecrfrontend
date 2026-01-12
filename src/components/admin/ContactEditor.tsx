import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

interface ContactData {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapEmbed: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

const ContactEditor = () => {
  const [contactData, setContactData] = useState<ContactData>({
    title: "Get in Touch",
    subtitle: "We're here to help you with any questions about our programs and admissions",
    address: "ECR Group of Institutions, Airport Road, Mangalore, Karnataka - 575030",
    phone: "+91 1234567890",
    email: "info@ecracademy.com",
    workingHours: "Monday - Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM",
    mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d74.8!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2zMTLCsDA1JzQwLjAiTiA3NMKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    socialMedia: {
      facebook: 'https://facebook.com/ecracademy',
      twitter: 'https://twitter.com/ecracademy',
      linkedin: 'https://linkedin.com/company/ecracademy',
      instagram: 'https://instagram.com/ecracademy'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      setLoading(true);
      try {
        const setting = await settingsAPI.getByKey('contact.info');
        if (setting?.value) {
          setSettingId(String(setting.id));
          const parsed = JSON.parse(setting.value);
          setContactData(prev => ({
            ...prev,
            ...parsed,
            socialMedia: parsed.socialMedia ? { ...prev.socialMedia, ...parsed.socialMedia } : prev.socialMedia,
          }));
        }
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          setError(err.message || 'Failed to load contact settings.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  const handleSave = async () => {
    setError(null);
    try {
      const payload = contactData;
      if (settingId) {
        await settingsAPI.update(settingId, {
          value: JSON.stringify(payload),
        });
      } else {
        const created = await settingsAPI.create({
          key: 'contact.info',
          value: JSON.stringify(payload),
          type: 'json',
          group: 'contact',
          description: 'Contact page information',
          is_public: true,
        });
        const newId = created.setting?.id ?? created.id;
        if (newId) {
          setSettingId(String(newId));
        }
      }
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save contact info.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateField = (field: keyof ContactData, value: any) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialMedia = (platform: keyof ContactData['socialMedia'], value: string) => {
    setContactData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Loading contact info…</CardDescription>
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
              Contact Information
            </CardTitle>
            <CardDescription>
              Update contact details, address, and social media links
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={contactData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter contact page title"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={contactData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Enter contact page subtitle"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={contactData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={contactData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Textarea
                value={contactData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Enter full address"
                rows={2}
              />
            </div>

            <div>
              <Label>Working Hours</Label>
              <Textarea
                value={contactData.workingHours}
                onChange={(e) => updateField('workingHours', e.target.value)}
                placeholder="Enter working hours"
                rows={2}
              />
            </div>

            <div>
              <Label>Google Maps Embed Code</Label>
              <Textarea
                value={contactData.mapEmbed}
                onChange={(e) => updateField('mapEmbed', e.target.value)}
                placeholder="Paste Google Maps embed iframe code"
                rows={3}
              />
            </div>

            <div>
              <Label>Social Media Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={contactData.socialMedia.facebook}
                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                    placeholder="Enter Facebook URL"
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={contactData.socialMedia.twitter}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    placeholder="Enter Twitter URL"
                  />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={contactData.socialMedia.linkedin}
                    onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                    placeholder="Enter LinkedIn URL"
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={contactData.socialMedia.instagram}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="Enter Instagram URL"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{contactData.title}</h3>
              <p className="text-muted-foreground">{contactData.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-muted-foreground">{contactData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">{contactData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-muted-foreground">{contactData.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Working Hours</h4>
                    <p className="text-muted-foreground">{contactData.workingHours}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Find Us</h4>
                <div 
                  className="border rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: contactData.mapEmbed }}
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <a href={contactData.socialMedia.facebook} className="text-primary hover:underline">
                  Facebook
                </a>
                <a href={contactData.socialMedia.twitter} className="text-primary hover:underline">
                  Twitter
                </a>
                <a href={contactData.socialMedia.linkedin} className="text-primary hover:underline">
                  LinkedIn
                </a>
                <a href={contactData.socialMedia.instagram} className="text-primary hover:underline">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactEditor;

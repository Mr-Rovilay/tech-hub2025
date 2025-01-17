import { useState } from 'react';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { QRScanner } from './components/QRScanner';
import { CreateAttendee } from './components/CreateAttendee';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, MessageSquare, QrCode, UserPlus } from 'lucide-react';
import StaticQRCode from './components/StaticQRCode';

const App = () => {
  const [attendee, setAttendee] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');

  const handleAttendeeFound = (foundAttendee) => {
    setAttendee(foundAttendee);
    setActiveTab('feedback');
  };

  const handleFeedbackSubmitted = () => {
    setAttendee(null);
    setActiveTab('allFeedback');
  };

  const handleAttendeeCreated = (newAttendee) => {
    setAttendee(newAttendee);
    setActiveTab('feedback');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 space-y-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-2">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Tech Guru Meetup 2025
                </h1>
                <p className="text-muted-foreground mt-2">
                  Share your thoughts and help shape the future of tech events
                </p>
              </div>
              <div className="flex items-center gap-3 bg-secondary p-2 rounded-lg">
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <Label htmlFor="dark-mode" className="text-sm">
                  Dark Mode
                </Label>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 gap-4 bg-muted p-1 mb-8">
                <TabsTrigger value="scan" className="flex items-center gap-2">
                  <QrCode size={16} />
                  Scan QR
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <UserPlus size={16} />
                  New Attendee
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2" disabled={!attendee}>
                  <MessageSquare size={16} />
                  Give Feedback
                </TabsTrigger>
                <TabsTrigger value="allFeedback" className="flex items-center gap-2">
                  <Users size={16} />
                  All Feedback
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="scan" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="border-2 border-dashed">
                      <CardContent className="p-0">
                        <QRScanner onAttendeeFound={handleAttendeeFound} />
                      </CardContent>
                    </div>
                    
                    <>
                      <CardContent className="p-0">
                        <h3 className="text-lg font-semibold mb-4 flex justify-center">Your Event QR Code</h3>
                        <div className="flex justify-center">
                          <StaticQRCode />
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                          Share this QR code with attendees to quickly register their feedback
                        </p>
                      </CardContent>
                    </>
                  </div>
                </TabsContent>

                <TabsContent value="create" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <CreateAttendee onAttendeeCreated={handleAttendeeCreated} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="feedback" className="mt-0">
                  {attendee && (
                    <Card>
                      <CardContent className="p-6">
                        <FeedbackForm 
                          attendee={attendee} 
                          onFeedbackSubmitted={handleFeedbackSubmitted} 
                        />
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="allFeedback" className="mt-0">
                  <Card>
                    <CardContent className="p-0">
                      <FeedbackList />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { getAllFeedback } from '@/api/api';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { ThumbsUp, Smile, Meh, Frown, CalendarDays, Lightbulb, Target, Wrench } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FeedbackList() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const experienceIcons = {
    Excellent: { icon: ThumbsUp, color: 'text-green-500' },
    Good: { icon: Smile, color: 'text-blue-500' },
    Fair: { icon: Meh, color: 'text-yellow-500' },
    Poor: { icon: Frown, color: 'text-red-500' }
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getAllFeedback();
        setFeedback(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching feedback');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-muted-foreground">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-red-500 text-lg">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-2 sm:items-center sm:justify-between p-2">
        <h2 className="text-xl font-bold">Community Feedback</h2>
        <p className="text-muted-foreground">{feedback.length} responses collected</p>
      </div>

      <ScrollArea className="h-[500px] md:h-[600px] p-2">
        <div className="space-y-4">
          {feedback.map((item) => {
            const ExperienceIcon = experienceIcons[item.experience]?.icon || ThumbsUp;
            const colorClass = experienceIcons[item.experience]?.color || 'text-gray-500';

            return (
              <Card key={item._id} className="p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base sm:text-lg">{item.attendee.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <ExperienceIcon className={`w-4 h-4 ${colorClass}`} />
                        <span className="text-sm">{item.experience} experience</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2 sm:mt-0">
                      <CalendarDays className="w-4 h-4" />
                      <time>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FeedbackSection icon={Target} title="Expectations" content={item.expectations} />
                    <FeedbackSection icon={Lightbulb} title="Key Takeaways" content={item.keyTakeaways} />
                    <FeedbackSection icon={Wrench} title="Suggested Improvements" content={item.improvements} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function FeedbackSection({ icon: Icon, title, content }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <p className="text-sm">{content}</p>
    </div>
  );
}

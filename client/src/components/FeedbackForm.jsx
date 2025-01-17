import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Smile, Frown, Meh, ThumbsUp } from 'lucide-react';
import { submitFeedback, createAttendee } from '../api/api';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  expectations: z.string().min(10, {
    message: "Expectations must be at least 10 characters.",
  }),
  experience: z.enum(['Excellent', 'Good', 'Fair', 'Poor'], {
    required_error: "You need to select an experience rating.",
  }),
  keyTakeaways: z.string().min(10, {
    message: "Key takeaways must be at least 10 characters.",
  }),
  improvements: z.string().min(10, {
    message: "Improvements must be at least 10 characters.",
  }),
});

export function FeedbackForm({ attendee, onFeedbackSubmitted }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: attendee?.name || "",
      email: attendee?.email || "",
      expectations: "",
      experience: undefined,
      keyTakeaways: "",
      improvements: "",
    },
  });

   // Experience options with their corresponding icons
   const experienceOptions = [
    { value: 'Excellent', icon: <ThumbsUp className="w-6 h-6 text-green-500" />, color: 'border-green-500' },
    { value: 'Good', icon: <Smile className="w-6 h-6 text-blue-500" />, color: 'border-blue-500' },
    { value: 'Fair', icon: <Meh className="w-6 h-6 text-yellow-500" />, color: 'border-yellow-500' },
    { value: 'Poor', icon: <Frown className="w-6 h-6 text-red-500" />, color: 'border-red-500' }
  ];

  async function onSubmit(values) {
    try {
      let attendeeId = attendee?._id;
      if (!attendeeId) {
        const newAttendee = await createAttendee(values.name, values.email);
        attendeeId = newAttendee._id;
      }

      const feedbackData = {
        attendeeId,
        expectations: values.expectations,
        experience: values.experience,
        keyTakeaways: values.keyTakeaways,
        improvements: values.improvements,
      };
      await submitFeedback(feedbackData);
      setIsSubmitted(true);
      setTimeout(() => {
        onFeedbackSubmitted();
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('An error occurred while submitting your feedback. Please try again.');
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto transform transition-all duration-500 ease-in-out">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <ThumbsUp className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <CardTitle className="text-center text-2xl text-green-600">Thank You!</CardTitle>
          <CardDescription className="text-center text-lg">
            Your feedback has been successfully submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your input will help us create better experiences for you and our community.
          </p>
          <p className="text-center mt-6 font-semibold">
            Cheers,<br />
            Team Tech Hub Africa
          </p>
        </CardContent>
      </Card>
    );
  }

  const steps = [
    {
      title: "Personal Information",
      fields: ["name", "email"],
    },
    {
      title: "Initial Feedback",
      fields: ["expectations", "experience"],
    },
    {
      title: "Detailed Feedback",
      fields: ["keyTakeaways", "improvements"],
    },
  ];

  const currentStepFields = steps[currentStep - 1].fields;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Share Your Experience</CardTitle>
        <CardDescription className="text-center">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
        </CardDescription>
        <div className="flex justify-center space-x-2 mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-16 rounded-full transition-all duration-300 ${
                index + 1 === currentStep
                  ? 'bg-primary'
                  : index + 1 < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {currentStepFields.includes("name") && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          disabled={!!attendee?.name}
                          className="h-11" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStepFields.includes("email") && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your email" 
                          {...field} 
                          disabled={!!attendee?.email}
                          className="h-11" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStepFields.includes("expectations") && (
                <FormField
                  control={form.control}
                  name="expectations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What were your expectations?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What motivated you to attend the Tech Guru Meetup?"
                          className="min-h-[120px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Tell us about your motivations and expectations for the event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

{currentStepFields.includes("experience") && (
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Rate your experience</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4">
                        {experienceOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                              field.value === option.value
                                ? `${option.color} bg-muted`
                                : 'border-muted hover:border-primary'
                            }`}
                            onClick={() => field.onChange(option.value)}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              {option.icon}
                              <span className="font-medium">{option.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

              {currentStepFields.includes("keyTakeaways") && (
                <FormField
                  control={form.control}
                  name="keyTakeaways"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Takeaways</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What insights or learnings will you take away?"
                          className="min-h-[120px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Share the most valuable things you've learned from the event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStepFields.includes("improvements") && (
                <FormField
                  control={form.control}
                  name="improvements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggestions for Improvement</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What would make future events even better?"
                          className="min-h-[120px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Your suggestions will help us improve future events.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(step => step - 1)}
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  className="ml-auto"
                  onClick={() => setCurrentStep(step => step + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Submit Feedback
                </Button>
              )}
            </div>
          </form>
        </Form>
        {error && (
          <p className="text-red-500 mt-4 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Code2, Rocket, Brain, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Code2,
    title: 'Interactive Learning',
    description: 'Practice JavaScript in real-time with our built-in code editor and instant feedback system.'
  },
  {
    icon: Brain,
    title: 'Structured Curriculum',
    description: 'Progress through carefully crafted lessons, from basics to advanced JavaScript concepts.'
  },
  {
    icon: Rocket,
    title: 'Hands-on Projects',
    description: 'Apply your knowledge by building real-world projects and applications.'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join a community of learners and get help when you need it.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    content: 'This platform helped me transition from a beginner to a confident JavaScript developer. The interactive exercises are fantastic!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&crop=face'
  },
  {
    name: 'Michael Chen',
    role: 'Student',
    content: 'The structured approach and instant feedback made learning JavaScript much easier than I expected.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&crop=face'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Software Engineer',
    content: 'The advanced concepts section helped me fill crucial gaps in my JavaScript knowledge. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&crop=face'
  }
];

export function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-background">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Master JavaScript the
              <span className="text-emerald-500"> interactive </span>
              way
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              Learn JavaScript through hands-on practice with instant feedback. 
              Start coding now and build real-world projects.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link to="/learn">Start Learning <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LearnJS?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <Icon className="h-12 w-12 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-lg bg-white dark:bg-background",
                  "border shadow-sm flex flex-col"
                )}
              >
                <div className="flex items-start mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground flex-1">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-500 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-emerald-50">
            Join thousands of students learning JavaScript today
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/learn">
              Get Started Free
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
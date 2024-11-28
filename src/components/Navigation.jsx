import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Menu, Home, CreditCard, Settings, BookOpenCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';
import { useAdminStore } from '@/lib/store';
import { AuthButtons } from './auth/AuthButtons';
import { UserMenu } from './auth/UserMenu';

export function Navigation({ chapters, currentChapter, currentLesson, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const { isLessonComplete, user } = useAdminStore();

  const handleNavigate = (chapterId, lessonId) => {
    onNavigate(chapterId, lessonId);
    setIsOpen(false);
  };

  const navigationLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: CreditCard, label: 'Pricing', href: '/pricing' },
    ...(user?.role === 'admin' ? [{ 
      icon: Settings, 
      label: isAdmin ? 'Back to Course' : 'Admin Dashboard', 
      href: isAdmin ? '/learn' : '/admin'
    }] : []),
  ];

  // Function to check if a lesson is accessible
  const isLessonAccessible = (chapterIndex, lessonIndex) => {
    // First lesson of first chapter is always accessible
    if (chapterIndex === 0 && lessonIndex === 0) return true;

    // Get previous lesson
    let prevLesson;
    if (lessonIndex === 0) {
      // First lesson of chapter - check last lesson of previous chapter
      const prevChapter = chapters[chapterIndex - 1];
      if (!prevChapter) return false;
      prevLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
    } else {
      // Check previous lesson in same chapter
      prevLesson = chapters[chapterIndex].lessons[lessonIndex - 1];
    }

    return isLessonComplete(prevLesson.id);
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center flex-1">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold ml-2">LearnJS</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 mr-4">
          {navigationLinks.map(({ icon: Icon, label, href }) => (
            <Button 
              key={label} 
              variant={location.pathname === href ? "secondary" : "ghost"} 
              asChild
            >
              <Link to={href} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? <UserMenu /> : <AuthButtons />}
        </div>

        {/* Menu Button (Mobile & Desktop) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Course Navigation
                </div>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="p-6 space-y-6">
                {/* Lessons Hub Link */}
                <Button
                  variant="secondary"
                  className="w-full justify-start py-6 text-left"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/learn">
                    <div className="flex items-center text-lg font-semibold">
                      <BookOpenCheck className="h-5 w-5 mr-2" />
                      Lessons Hub
                    </div>
                  </Link>
                </Button>

                {/* Mobile Navigation Links */}
                <div className="md:hidden space-y-3 pt-6 border-t">
                  {navigationLinks.map(({ icon: Icon, label, href }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to={href} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>

                {/* Chapters and Lessons */}
                <div className="space-y-6 pt-6 border-t">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Course Content
                  </div>
                  {chapters.map((chapter, chapterIndex) => (
                    <div key={chapter.id} className="space-y-3">
                      <div className="font-medium text-lg">{chapter.title}</div>
                      <div className="space-y-1 pl-4 border-l-2 border-muted">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          const isAccessible = isLessonAccessible(chapterIndex, lessonIndex);
                          const isComplete = isLessonComplete(lesson.id);

                          return (
                            <Button
                              key={lesson.id}
                              variant={currentLesson === lesson.id ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full justify-start",
                                currentLesson === lesson.id && "bg-secondary",
                                !isAccessible && "opacity-50 cursor-not-allowed"
                              )}
                              onClick={() => isAccessible && handleNavigate(chapter.id, lesson.id)}
                              disabled={!isAccessible}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{lesson.title}</span>
                                {!isAccessible ? (
                                  <Lock className="h-4 w-4 ml-2" />
                                ) : isComplete ? (
                                  <CheckCircle2 className="h-4 w-4 ml-2 text-emerald-500" />
                                ) : null}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LessonContent } from './components/LessonContent';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAdminStore } from './lib/store';
import { Button } from './components/ui/button';
import { checkApiHealth } from './lib/api';
import { toast } from 'sonner';
import { Pricing } from './components/Pricing';
import { HomePage } from './components/HomePage';
import { LessonsHub } from './components/LessonsHub';
import { ProfilePage } from './components/profile/ProfilePage';
import { PaymentSuccess } from './components/payment/PaymentSuccess';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user } = useAdminStore();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (user?.role !== 'admin') return null;
  return <>{children}</>;
}

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapters, loadChapters, user } = useAdminStore();
  const [currentChapter, setCurrentChapter] = useState('');
  const [currentLesson, setCurrentLesson] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let mounted = true;
    let retryTimeout;

    async function init() {
      try {
        if (!mounted) return;
        setIsLoading(true);
        
        const isHealthy = await checkApiHealth();
        if (!isHealthy) {
          if (retryCount < MAX_RETRIES) {
            retryTimeout = setTimeout(() => {
              if (mounted) {
                setRetryCount(prev => prev + 1);
              }
            }, 2000 * (retryCount + 1)); // Exponential backoff
            return;
          }
          setApiError(true);
          return;
        }

        await loadChapters();
        if (mounted) {
          setApiError(false);
          setRetryCount(0);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          setApiError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [loadChapters, retryCount]);

  useEffect(() => {
    if (chapters.length > 0 && !currentChapter) {
      setCurrentChapter(chapters[0].id);
      setCurrentLesson(chapters[0].lessons[0]?.id);
    }
  }, [chapters, currentChapter]);

  const handleNavigate = (chapterId, lessonId) => {
    setCurrentChapter(chapterId);
    setCurrentLesson(lessonId);
    navigate('/learn/lesson');
  };

  const handleNextLesson = () => {
    const currentChapterObj = chapters.find((c) => c.id === currentChapter);
    if (!currentChapterObj) return;

    const currentLessonIndex = currentChapterObj.lessons.findIndex(
      (l) => l.id === currentLesson
    );

    if (currentLessonIndex < currentChapterObj.lessons.length - 1) {
      // Next lesson in current chapter
      const nextLesson = currentChapterObj.lessons[currentLessonIndex + 1];
      handleNavigate(currentChapter, nextLesson.id);
    } else {
      // First lesson of next chapter
      const currentChapterIndex = chapters.findIndex((c) => c.id === currentChapter);
      if (currentChapterIndex < chapters.length - 1) {
        const nextChapter = chapters[currentChapterIndex + 1];
        handleNavigate(nextChapter.id, nextChapter.lessons[0].id);
      }
    }
  };

  const handlePreviousLesson = () => {
    const currentChapterObj = chapters.find((c) => c.id === currentChapter);
    if (!currentChapterObj) return;

    const currentLessonIndex = currentChapterObj.lessons.findIndex(
      (l) => l.id === currentLesson
    );

    if (currentLessonIndex > 0) {
      // Previous lesson in current chapter
      const previousLesson = currentChapterObj.lessons[currentLessonIndex - 1];
      handleNavigate(currentChapter, previousLesson.id);
    } else {
      // Last lesson of previous chapter
      const currentChapterIndex = chapters.findIndex((c) => c.id === currentChapter);
      if (currentChapterIndex > 0) {
        const previousChapter = chapters[currentChapterIndex - 1];
        const lastLesson = previousChapter.lessons[previousChapter.lessons.length - 1];
        handleNavigate(previousChapter.id, lastLesson.id);
      }
    }
  };

  const getCurrentLesson = () => {
    const chapter = chapters.find((c) => c.id === currentChapter);
    return chapter?.lessons.find((l) => l.id === currentLesson);
  };

  const isFirstLesson = () => {
    return currentChapter === chapters[0]?.id && currentLesson === chapters[0]?.lessons[0]?.id;
  };

  const lesson = getCurrentLesson();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Retrying... ({retryCount}/{MAX_RETRIES})
            </p>
          )}
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-lg mb-4">Cannot connect to the API server.</p>
          <p className="text-gray-600 mb-6">Please ensure the server is running and try again.</p>
          <Button 
            onClick={() => {
              setRetryCount(0);
              setApiError(false);
            }}
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        chapters={chapters}
        currentChapter={currentChapter}
        currentLesson={currentLesson}
        onNavigate={handleNavigate}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={
          <main className="container mx-auto py-8 px-4 flex-1">
            <LessonsHub onStartLesson={handleNavigate} />
          </main>
        } />
        <Route path="/learn/lesson" element={
          <main className="container mx-auto py-8 px-4 flex-1">
            {lesson && (
              <LessonContent 
                lesson={lesson}
                onNext={handleNextLesson}
                onPrevious={handlePreviousLesson}
                isFirstLesson={isFirstLesson()}
              />
            )}
          </main>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
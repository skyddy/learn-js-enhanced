export function LessonHeader({ lesson }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">{lesson.title}</h2>
      <p className="text-lg text-muted-foreground">{lesson.description}</p>
    </div>
  );
}
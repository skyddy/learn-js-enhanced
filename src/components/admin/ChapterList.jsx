import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, BookOpen, MoreVertical, Pencil, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ChapterList({
  chapters,
  selectedChapter,
  onSelectChapter,
  onMoveChapter,
  onDeleteChapter,
  onUpdateChapter,
}) {
  const [editingChapter, setEditingChapter] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleStartEditing = (chapter) => {
    setEditingChapter(chapter.id);
    setEditedTitle(chapter.title);
  };

  const handleSave = (id) => {
    if (editedTitle.trim()) {
      onUpdateChapter(id, editedTitle.trim());
      setEditingChapter(null);
      toast.success('Chapter renamed successfully');
    }
  };

  const handleCancel = () => {
    setEditingChapter(null);
    setEditedTitle('');
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Chapters</CardTitle>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                selectedChapter === chapter.id
                  ? "bg-secondary"
                  : "hover:bg-secondary/50",
                "cursor-pointer"
              )}
              onClick={() => onSelectChapter(chapter.id)}
            >
              {editingChapter === chapter.id ? (
                <div className="flex items-center space-x-2 flex-1 mr-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-8"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(chapter.id);
                    }}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span className="font-medium">{chapter.title}</span>
              )}
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditing(chapter);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onMoveChapter(chapter.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4" /> Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onMoveChapter(chapter.id, 'down')}
                      disabled={index === chapters.length - 1}
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4" /> Move Down
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChapter(chapter.id);
                        toast.success('Chapter deleted');
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
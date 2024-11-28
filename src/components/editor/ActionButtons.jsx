import { Button } from '@/components/ui/button';
import { RefreshCw, Check, Play } from 'lucide-react';

export function ActionButtons({ onReset, onShowSolution, onRun }) {
  return (
    <div className="flex justify-end space-x-3 py-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 hover:border-zinc-600 text-zinc-100"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onShowSolution}
        className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700 hover:border-zinc-600 text-zinc-100"
      >
        <Check className="w-4 h-4 mr-2" />
        Solution
      </Button>
      <Button 
        size="sm" 
        onClick={onRun}
        className="bg-emerald-600 hover:bg-emerald-500 text-white border-none min-w-[100px]"
      >
        <Play className="w-4 h-4 mr-2" />
        Run
      </Button>
    </div>
  );
}
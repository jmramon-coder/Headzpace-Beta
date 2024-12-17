import { Clock, FileText, CheckSquare, Image, MessageCircle, Radio } from 'lucide-react';

export const WIDGETS = Object.freeze([
  {
    type: 'clock' as const,
    name: 'Clock',
    icon: Clock,
    description: 'Keep track of time with style'
  },
  {
    type: 'notes' as const,
    name: 'Notes',
    icon: FileText,
    description: 'Capture your thoughts instantly'
  },
  {
    type: 'tasks' as const,
    name: 'Tasks',
    icon: CheckSquare,
    description: 'Stay organized and productive',
    className: 'col-span-2'
  },
  {
    type: 'media' as const,
    name: 'Media',
    icon: Image,
    description: 'Visualize your inspiration'
  },
  {
    type: 'chat' as const,
    name: 'Chat',
    icon: MessageCircle,
    description: 'Your AI assistant',
    className: 'col-span-2'
  },
  {
    type: 'radio' as const,
    name: 'Radio',
    icon: Radio,
    description: 'Stream ambient music and focus stations'
  }
]);
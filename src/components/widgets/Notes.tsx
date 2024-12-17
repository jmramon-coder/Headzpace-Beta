import React from 'react';
import { FileText } from 'lucide-react';

export const Notes = () => {
  const [text, setText] = React.useState('');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type your thoughts..."
        className="h-full w-full bg-transparent text-slate-800 dark:text-white p-3 pt-10 resize-none focus:outline-none placeholder:text-indigo-500/30 dark:placeholder:text-cyan-500/30"
      />
    </div>
  );
};
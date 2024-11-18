import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Type,
  Palette,
} from 'lucide-react';

function WriteStory() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [showColorGrid, setShowColorGrid] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content: editorRef.current.innerHTML,
          tags: tags.split(',').map((tag) => tag.trim()),
        }),
      });

      if (response.ok) {
        alert('Story submitted successfully!');
        navigate('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit the story. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const colorOptions = [
    '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFFFFF', '#000000', '#808080',
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Write Your Story</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your story title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-800 p-2 flex items-center gap-1 flex-wrap border-b border-gray-700">
                {[
                  { icon: Undo, command: 'undo' },
                  { icon: Redo, command: 'redo' },
                  { icon: Bold, command: 'bold' },
                  { icon: Italic, command: 'italic' },
                  { icon: Underline, command: 'underline' },
                  { icon: AlignLeft, command: 'justifyLeft' },
                  { icon: AlignCenter, command: 'justifyCenter' },
                  { icon: AlignRight, command: 'justifyRight' },
                  { icon: AlignJustify, command: 'justifyFull' },
                  { icon: List, command: 'insertUnorderedList' },
                  { icon: ListOrdered, command: 'insertOrderedList' },
                ].map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleFormat(item.command)}
                    className="p-1 text-gray-400 hover:text-gray-100 focus:outline-none"
                  >
                    <item.icon className="h-4 w-4" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowColorGrid(!showColorGrid)}
                  className="p-1 text-gray-400 hover:text-gray-100 focus:outline-none"
                >
                  <Palette className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const size = prompt('Enter font size (1-7):');
                    if (size) handleFormat('fontSize', size);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-100 focus:outline-none"
                >
                  <Type className="h-4 w-4" />
                </button>
              </div>
              {showColorGrid && (
                <div className="absolute bg-gray-800 border border-gray-700 rounded-lg p-2 grid grid-cols-3 gap-2 mt-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        handleFormat('foreColor', color);
                        setShowColorGrid(false);
                      }}
                    ></button>
                  ))}
                </div>
              )}
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[300px] p-4 bg-gray-800 focus:outline-none"
                onInput={() => setContent(editorRef.current.innerHTML)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="fiction, romance, mystery"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
}

export default WriteStory;

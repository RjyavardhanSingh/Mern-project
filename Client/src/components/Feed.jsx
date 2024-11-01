import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Feed() {
  const [stories, setStories] = useState([]);
  
//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         // Replace with your API endpoint to get stories
//         const response = await fetch('/api/stories');
//         const data = await response.json();
//         setStories(data);
//       } catch (error) {
//         console.error('Error fetching stories:', error);
//       }
//     };

//     fetchStories();
//   }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Your Feed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {stories.map(story => (
          <div key={story.id} className="p-4 bg-white rounded shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-600">{story.title}</h3>
            <p className="text-gray-600">{story.description}</p>
            <Link to={`/story/${story.id}`} className="text-blue-500 hover:underline mt-2 block">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;

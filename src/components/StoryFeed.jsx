import React from 'react';

const StoryFeed = ({ stories }) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <div
          key={story.id}
          className="p-6 bg-blue-800 bg-opacity-70 border border-cyan-400 rounded-lg shadow-md text-white hover:shadow-xl transition-shadow duration-200 hover:scale-105 transform"
        >
          <h3 className="text-xl font-semibold text-cyan-400 mb-3">{story.title}</h3>
          <p className="text-gray-300 mb-4">{story.description}</p>
          <button className="text-cyan-400 hover:underline">Read more</button>
        </div>
      ))}
    </div>
  );
};

export default StoryFeed;

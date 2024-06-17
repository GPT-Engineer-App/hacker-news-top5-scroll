import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Switch from 'react-switch';
import './index.css';

const App = () => {
  const [stories, setStories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      const top5StoryIds = topStoryIds.slice(0, 5);
      const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
      const stories = await Promise.all(storyPromises);
      setStories(stories.map(story => story.data));
    } catch (error) {
      console.error('Error fetching top stories:', error);
    }
  };

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-primary text-primary">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Hacker News Top Stories</h1>
            <div className="flex items-center">
              <span className="mr-2">Dark Mode</span>
              <Switch onChange={() => setDarkMode(!darkMode)} checked={darkMode} />
            </div>
          </div>
          <input
            type="text"
            placeholder="Search stories..."
            className="w-full p-2 mb-4 border rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <ul className="space-y-4">
            {filteredStories.map(story => (
              <li key={story.id} className="p-4 bg-secondary rounded shadow">
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p className="text-gray-600">Upvotes: {story.score}</p>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Read more</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
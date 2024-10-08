import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

const Poll: React.FC = () => {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    fetchPollData();
    const interval = setInterval(fetchPollData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPollData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/poll'); // Replace with your API endpoint
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching poll data:', error);
    }
  };

  const handleVote = async () => {
    if (selectedOption !== null) {
      try {
        await axios.post('http://localhost:3000/api/vote', { optionId: selectedOption });
        fetchPollData();
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Live Poll</h2>
      <form className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`option-${option.id}`}
              name="pollOption"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
              className="form-radio"
            />
            <label htmlFor={`option-${option.id}`} className="flex-grow">{option.text}</label>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(option.votes / options.reduce((sum, opt) => sum + opt.votes, 0)) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">{option.votes} votes</span>
          </div>
        ))}
        <Button type="button" onClick={handleVote} disabled={selectedOption === null}>
          Vote
        </Button>
      </form>
    </div>
  );
};

export default Poll;
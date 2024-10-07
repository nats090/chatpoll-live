import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

const Poll: React.FC = () => {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial poll data
    fetchPollData();

    // Set up interval to fetch updates
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
        fetchPollData(); // Refresh poll data after voting
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Live Poll</h2>
      <form>
        {options.map((option) => (
          <div key={option.id} className="mb-3 form-check">
            <input
              type="radio"
              className="form-check-input"
              id={`option-${option.id}`}
              name="pollOption"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
            />
            <label className="form-check-label" htmlFor={`option-${option.id}`}>
              {option.text}
            </label>
            <div className="progress mt-2">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${(option.votes / options.reduce((sum, opt) => sum + opt.votes, 0)) * 100}%` }}
                aria-valuenow={(option.votes / options.reduce((sum, opt) => sum + opt.votes, 0)) * 100}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {option.votes} votes
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={handleVote} disabled={selectedOption === null}>
          Vote
        </button>
      </form>
    </div>
  );
};

export default Poll;
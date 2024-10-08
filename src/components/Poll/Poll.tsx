import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

const Poll: React.FC = () => {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { user } = useContext(AppContext);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/poll'); // Replace with your WebSocket server URL for polls

    socket.onopen = () => {
      console.log('Poll WebSocket connected');
      socket.send(JSON.stringify({ type: 'getPollData' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'pollUpdate') {
        setOptions(data.options);
      }
    };

    socket.onclose = () => {
      console.log('Poll WebSocket disconnected');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleVote = () => {
    if (selectedOption !== null && ws) {
      ws.send(JSON.stringify({ type: 'vote', optionId: selectedOption, user: user?.email }));
    }
  };

  return (
    <div className="card">
      <div className="card-header">Live Poll</div>
      <div className="card-body">
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
    </div>
  );
};

export default Poll;
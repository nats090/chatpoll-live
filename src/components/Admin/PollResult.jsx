import React, { useEffect, useState } from 'react';
import { db } from '../../config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Progress } from "@/components/ui/progress"

const PollResult = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setPolls(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPolls();
  }, []);

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Poll Results</h2>
      <div className="space-y-6">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
          return (
            <div key={poll.id} className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">{poll.question}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Created by: {poll.createdBy} on {poll.createdAt.toDate().toLocaleString()}
              </p>
              <div className="space-y-2">
                {poll.options.map((option, index) => {
                  const percentage = calculatePercentage(option.votes, totalVotes);
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{option.text}</span>
                        <span>{option.votes} votes ({percentage}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-gray-600">Total votes: {totalVotes}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollResult;
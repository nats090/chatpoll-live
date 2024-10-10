import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { db } from '../../config';
import { collection, addDoc, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const Poll = () => {
  const [polls, setPolls] = useState([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPolls = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPolls(fetchedPolls);
    });

    return () => unsubscribe();
  }, []);

  const createPoll = async (e) => {
    e.preventDefault();
    if (newPollQuestion && newPollOptions.every(option => option.trim()) && user) {
      try {
        await addDoc(collection(db, 'polls'), {
          question: newPollQuestion,
          options: newPollOptions.map(option => ({ text: option, votes: 0 })),
          createdBy: user.email,
          createdAt: new Date()
        });
        setNewPollQuestion('');
        setNewPollOptions(['', '']);
      } catch (error) {
        console.error('Error creating poll:', error);
      }
    }
  };

  const vote = async (pollId, optionIndex) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: polls.find(p => p.id === pollId).options[optionIndex].votes + 1
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Live Polls</h2>
      
      <form onSubmit={createPoll} className="mb-6">
        <Input
          type="text"
          value={newPollQuestion}
          onChange={(e) => setNewPollQuestion(e.target.value)}
          placeholder="Enter poll question"
          className="mb-2"
        />
        {newPollOptions.map((option, index) => (
          <Input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...newPollOptions];
              newOptions[index] = e.target.value;
              setNewPollOptions(newOptions);
            }}
            placeholder={`Option ${index + 1}`}
            className="mb-2"
          />
        ))}
        <Button 
          type="button" 
          onClick={() => setNewPollOptions([...newPollOptions, ''])}
          className="mr-2"
        >
          Add Option
        </Button>
        <Button type="submit">Create Poll</Button>
      </form>

      {polls.map((poll) => (
        <div key={poll.id} className="mb-4 p-4 border rounded">
          <h3 className="font-semibold">{poll.question}</h3>
          <p className="text-sm text-gray-500 mb-2">Created by: {poll.createdBy}</p>
          {poll.options.map((option, index) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const percentage = calculatePercentage(option.votes, totalVotes);
            return (
              <div key={index} className="mb-2">
                <Button 
                  onClick={() => vote(poll.id, index)}
                  className="w-full text-left justify-between mb-1"
                >
                  <span>{option.text}</span>
                  <span>{option.votes} votes</span>
                </Button>
                <Progress value={percentage} className="h-2" />
                <span className="text-sm text-gray-500">{percentage}%</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Poll;
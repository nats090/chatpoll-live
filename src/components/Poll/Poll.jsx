import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { db } from '../../config';
import { collection, addDoc, query, onSnapshot, orderBy, updateDoc, doc, increment } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from 'sonner'

const Poll = () => {
  const [polls, setPolls] = useState([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const { user, isAdmin } = useContext(AppContext);

  useEffect(() => {
    const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPolls = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        options: Array.isArray(doc.data().options) ? doc.data().options : []
      }));
      setPolls(fetchedPolls);
    }, (error) => {
      console.error("Error fetching polls:", error);
      toast.error('Failed to fetch polls: ' + error.message);
    });

    return () => unsubscribe();
  }, []);

  const createPoll = async (e) => {
    e.preventDefault();
    if (newPollQuestion && newPollOptions.every(option => option.trim()) && user && isAdmin) {
      try {
        await addDoc(collection(db, 'polls'), {
          question: newPollQuestion,
          options: newPollOptions.map(option => ({ text: option, votes: 0 })),
          createdBy: user.email,
          createdAt: new Date(),
          active: true
        });
        setNewPollQuestion('');
        setNewPollOptions(['', '']);
        toast.success('Poll created successfully!');
      } catch (error) {
        console.error('Error creating poll:', error);
        toast.error('Failed to create poll: ' + error.message);
      }
    }
  };

  const vote = async (pollId, optionIndex) => {
    if (!user) return;
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: increment(1)
      });
      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote: ' + error.message);
    }
  };

  const stopPoll = async (pollId) => {
    if (!isAdmin) return;
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, { active: false });
      toast.success('Poll stopped successfully!');
    } catch (error) {
      console.error('Error stopping poll:', error);
      toast.error('Failed to stop poll: ' + error.message);
    }
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6 hover-effect">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Live Polls</h2>
      
      {isAdmin && (
        <form onSubmit={createPoll} className="mb-6 space-y-4">
          <Input
            type="text"
            value={newPollQuestion}
            onChange={(e) => setNewPollQuestion(e.target.value)}
            placeholder="Enter poll question"
            className="bg-muted text-muted-foreground"
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
              className="bg-muted text-muted-foreground"
            />
          ))}
          <Button 
            type="button" 
            onClick={() => setNewPollOptions([...newPollOptions, ''])}
            className="mr-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Add Option
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/80">Create Poll</Button>
        </form>
      )}

      <div className="space-y-6">
        {polls.map((poll) => {
          if (!poll || !Array.isArray(poll.options)) {
            console.error('Invalid poll data:', poll);
            return null;
          }
          const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
          return (
            <div key={poll.id} className="border border-border rounded-lg p-4 hover-effect">
              <h3 className="font-semibold mb-2 text-lg">{poll.question}</h3>
              <p className="text-sm text-muted-foreground mb-2">Created by: {poll.createdBy}</p>
              {poll.options.map((option, index) => {
                const percentage = calculatePercentage(option.votes || 0, totalVotes);
                return (
                  <div key={index} className="mb-3">
                    <Button 
                      onClick={() => vote(poll.id, index)}
                      className="w-full text-left justify-between mb-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      disabled={!user || !poll.active}
                    >
                      <span>{option.text}</span>
                      <span>{option.votes || 0} votes</span>
                    </Button>
                    <Progress value={percentage} className="h-2" />
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                );
              })}
              {isAdmin && poll.active && (
                <Button onClick={() => stopPoll(poll.id)} className="mt-2 bg-destructive text-destructive-foreground hover:bg-destructive/80">
                  Stop Poll
                </Button>
              )}
              {!poll.active && (
                <p className="text-sm text-destructive mt-2">This poll has ended.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Poll;
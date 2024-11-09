import React,
{
  useState, 
  useEffect
} from 'react';

import io from 'socket.io-client';

import './App.css';

const socket = io('http://localhost:8001');

function App() {
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.on('updateContent',
        (updatedContent) => {
            setContent(updatedContent);
        });

    return () => {
        socket.off('updateContent');
    };
  });

  const handleEdit = (event) => {
      const updatedContent = event.target.value;
      setContent(updatedContent);
      console.log("content updated");
      socket.emit('edit', updatedContent);
  };

  return (
    <div className="App">
        <h1>Real-time Collaborative Editor</h1>
        <textarea
            value={content}
            defaultValue={"Start typing here..."}
            onChange={handleEdit}
            rows={10}
            cols={50}
        />
    </div>
  );
}

export default App;

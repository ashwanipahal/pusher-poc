import './App.css';
import Pusher from 'pusher-js';
import { useEffect, useState, useMemo } from 'react';

const pusher = new Pusher('d7f7b6f80a80bc22a961', {
  cluster: 'us2',
  channelAuthorization: { endpoint: "http://localhost:4000/pusher/user-auth"} 
});

Pusher.logToConsole = true;

function App() {
  const [pusherChannel, setPusherChannel] = useState(null);
  const [todoItems, setTodoItem] = useState([]);
  useEffect(()=>{
    const channel = pusher.subscribe("private-pusher-poc")
    setPusherChannel(channel);
  }, []);
  useEffect(()=>{
    if(pusherChannel){
      pusherChannel.bind('pusher:subscription_succeeded', () => {
        // when user subscribed successfully
      });
      pusherChannel.bind('my-event', (newItem)=> {
        if(newItem){
          setTodoItem((item)=> [...item, newItem])
        }
        
      });
    }
  }, [pusherChannel])
  return (
    <div className="App">
      <div className='list-wrapper'>
      {todoItems && todoItems.length ? todoItems.map((item,index)=>{
        return <div style={{margin: "10px",borderBottom:"1px solid", display: 'flex', flexDirection:"column", alignItems:"flex-start"}} key={index}>
            <p>Id:{item.id}</p>
            <p>Item:{item.item}</p>
            <p>Date Created:{new Date(item.publishedAt).toString()}</p>
        </div>
      }): null}
      </div>
      
    </div>
  );
}

export default App;

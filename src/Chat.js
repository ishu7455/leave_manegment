import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import formatMessageDate from "./formatMessageDate";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';

const Chat = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const gerUser = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchChat = async() => {
    
    const response = await fetch(`http://127.0.0.1:8000/api/messages/${id}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      }
    });
    const result = await response.json();
    if (response.ok) {
      setData(result.data);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // const newMessage = { message,    sender_id: gerUser.id, receiver_id: id, created_at: new Date() };
    // console.log(message);
    // setData((prevData) => [...prevData, newMessage]);

    const formData = new FormData();
    formData.append('message', message);
    formData.append('receiver_id', id);

    const response = await fetch(`http://127.0.0.1:8000/api/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (response.ok) {
      setMessage(""); 
    } else {
      alert('Failed to send message');
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const unreadMessages = data.filter(
        (msg) => !msg.is_read && msg.receiver_id == gerUser.id
      );
      if (unreadMessages.length === 0) return; 

      const response = await fetch("http://127.0.0.1:8000/api/messages/read", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_id: id }),
      });

      if (!response.ok) {
        console.error("Failed to mark messages as read.");
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };
  
  
  useEffect(() => {
    fetchChat(); 

    const echo = new Echo({
      broadcaster: 'pusher',
      key: 'local',
      cluster: 'mt1',
      wsHost: '127.0.0.1',
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
    });

    const channel = echo.channel('chat.' + gerUser.id)
      .listen('MessageSent', (event) => {
        console.log('New message received:', event.message);
        setData((prevData) => [...prevData, event.message]); 
      })
      .error((err) => {
        console.log('Pusher error:', err);
      });

      const channelRead = echo.channel('Read.' + gerUser.id)
      .listen('MessageRead', (event) => {
       // alert('jhkjh');
       setData((prevData) =>
          prevData.map((msg) =>
            msg.id == event.message.id ? { ...msg, is_read: true } : msg
          )
        );
        //console.log(s);
      //  setData((prevData) => [...prevData, event.message]); 
      });

    return () => {
      channel.stopListening('MessageSent'); 
      channelRead.stopListening('MessageRead');
      echo.leaveChannel('chat.' + id);
    };
  }, [id]);

  useEffect(() => {
    markMessagesAsRead();
  }, [data]);


  return (
    <div className="card direct-chat direct-chat-primary">
      <div className="card-header">
        <h3 className="card-title">Direct Chat</h3>
      </div>
      <div className="card-body">
        <div className="direct-chat-messages">
        {data && data.length > 0 ? (
  data.map((chat) => (
    <div key={chat.id} className={`direct-chat-msg ${chat.sender_id === gerUser.id ? '' : 'right'}`}>
      <div className="direct-chat-infos clearfix">
        <span className={`direct-chat-name ${chat.sender_id === gerUser.id ? 'float-left' : 'float-right'}`}>
          {chat.sender ? chat.sender.name : gerUser.name}
        </span>
      </div>
      <img className="direct-chat-img" src={`http://127.0.0.1:8000/storage/${chat.sender?.image || gerUser.image }`} alt="message user" />
      <div className="direct-chat-text">
        {chat.message}
      
      {chat.sender_id == gerUser.id &&
      (<span style={{float:"right"}}>
     <FontAwesomeIcon 
      style={chat.is_read ? { color: "#1695ea" } : {}} 
      icon={faCheckDouble} 
     />
      </span>
      )}
      
      </div>
      <span className={`direct-chat-timestamp ${chat.sender_id === gerUser.id ? 'float-left' : 'float-right'}`}>
        {formatMessageDate(chat.created_at)}
      </span>
      
    </div>
  ))
) : (
  <p>No chat available</p>
)}
        </div>
      </div>
      <div className="card-footer">
        <form onSubmit={submitHandler}>
          <div className="input-group">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type Message ..." className="form-control" />
            <span className="input-group-append">
              <button type="submit" className="btn btn-primary">Send</button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

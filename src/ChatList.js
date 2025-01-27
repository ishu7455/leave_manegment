import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Echo from "laravel-echo";
import formatMessageDate from "./formatMessageDate";

const ChatList = () => {
  const [data, setData] = useState([]);
  const gerUser = JSON.parse(localStorage.getItem("user"));

  const fetchList = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/messages-list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (response.ok) {
      const chatsWithUnread = result.data.map((chat) => ({
        ...chat,
        unreadCount: 0, 
      }));
      setData(chatsWithUnread);
    }
  };

  useEffect(() => {
    fetchList(); 

   
    const echo = new Echo({
      broadcaster: "pusher",
      key: "local",
      cluster: "mt1",
      wsHost: "127.0.0.1",
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
    });

    const channel = echo.channel("chat." + gerUser.id)
      .listen("MessageSent", (event) => {
        console.log("New message received:", event);

        setData((prevData) =>
          prevData.map((chat) =>
            chat.receiver.id === event.message.sender_id || chat.sender.id === event.message.sender_id
              ? {
                  ...chat,
                  message: event.message.message, 
                  created_at: event.message.created_at, 
                  unreadCount: chat.unreadCount + 1,
                }
              : chat
          )
        );
      })
      .error((err) => {
        console.error("Pusher error:", err);
      });

    return () => {
      channel.stopListening("MessageSent");
      echo.leaveChannel("chat." + gerUser.id);
    };
  }, [gerUser.id]);

  return (
    <div className="chat-list-container">
      <header className="chat-header">
        <h2>Chats</h2>
      </header>
      <div className="chat-list">
        {data && data.length > 0 ? (
          data.map((msg) => (
            <Link
              to={`/chat/${msg.receiver.id !== gerUser.id ? msg.receiver.id : msg.sender.id}`}
              key={msg.id}
              onClick={() => {
                // Reset unread count when opening the chat
                setData((prevData) =>
                  prevData.map((chat) =>
                    chat.receiver.id === msg.receiver.id || chat.sender.id === msg.sender.id
                      ? { ...chat, unreadCount: 0 }
                      : chat
                  )
                );
              }}
            >
              <div className="chat-item">
                <img
                  src={
                    msg.receiver.id !== gerUser.id
                      ? `http://127.0.0.1:8000/storage/${msg.receiver.image}`
                      : `http://127.0.0.1:8000/storage/${msg.sender.image}`
                  }
                  alt="Profile Picture"
                  className="profile-pic"
                />
                <div className="chat-details">
                  <h4 className="chat-name" style={{ color: "black" }}>
                    {msg.receiver.id !== gerUser.id ? msg.receiver.name : msg.sender.name}
                  </h4>
                  <p className="chat-message">
                    {msg.message.length > 30 ? `${msg.message.slice(0, 30)}...` : msg.message}
                  </p>
                </div>
                <div className="chat-meta">
                  <div>
                 {msg.unreadCount > 0 && (
                   // <span className="unread-badge">{msg.unreadCount}</span>
                    <span  class="badge badge-success" >{msg.unreadCount}</span>
                  )}
                  </div>
                  <span className="chat-time">{formatMessageDate(msg.created_at)}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;

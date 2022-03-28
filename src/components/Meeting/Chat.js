import { useState, useEffect, useRef } from "react";
import { Reactions, Send } from "../../utils/svgs";

function ChatTab({ name, messages, unread, active, onClick }) {
  const handleTabClick = () => {
    if (active) return;

    onClick && onClick();
  };

  return (
    <button
      onClick={handleTabClick}
      className={
        "outline-none relative w-full border-b dark:border-dark-600 border-lt-300 justify-center " +
        (active && "dark:border-dark-400 border-lt-600")
      }
    >
      {active && (
        <span className="absolute top-1/8 left-0 rounded-full w-full h-full bg-primary-600 blur-md dark:opacity-10 opacity-20"></span>
      )}
      <span className="flex flex-row gap-x-4 p-3 justify-center">
        <p
          className={
            "font-medium " +
            (active
              ? "dark:text-text-200 text-text-900"
              : "dark:text-text-500 text-text-500")
          }
        >
          {name}
        </p>{" "}
        {messages && unread > 0 && (
          <span className="rounded-full w-6 h-6 flex items-center justify-center dark:bg-dark-600 bg-lt-300 bg-opacity-60">
            {unread}
          </span>
        )}
      </span>
    </button>
  );
}

function Message({ message }) {
  return (
    <div className="flex flex-col gap-y-2 p-2">
      <header className="flex flex-row justify-between">
        <p className="dark:text-text-200 font-medium">{message.sender}</p>
        <p className="dark:text-text-400">{message.time}</p>
      </header>
      <p className="dark:text-text-400">{message.message}</p>
    </div>
  );
}

function Chat({
  sendMessage,
  generalMessages,
  privateMessages,
  unreadGeneralMessages,
  unreadPrivateMessages,
  onOpenGeneralMessages,
  onOpenPrivateMessages,
}) {
  const [generalTab, setGeneralTab] = useState(true);
  const [privateTab, setPrivateTab] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleGeneralTabClick = () => {
    setPrivateTab(false);
    setGeneralTab(true);
    onOpenGeneralMessages();
  };

  const handlePrivateTabClick = () => {
    setPrivateTab(true);
    setGeneralTab(false);
    onOpenPrivateMessages();
  };

  const getMessages = () => {
    console.log(generalMessages, privateMessages);
    if (generalTab) return generalMessages;
    else return privateMessages;
  };

  const handleChange = (e) => {
    e.persist();
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    sendMessage(message);
    inputRef.current.value = "";
  };

  useEffect(() => {
    if (generalTab) onOpenGeneralMessages();
  }, [generalMessages]);

  useEffect(() => {
    if (privateTab) onOpenPrivateMessages();
  }, [privateMessages]);

  return (
    <div className="flex flex-col justify-between dark:bg-dark-900 bg-lt-50 col-span-3">
      {/* Tabs */}
      <div>
        <div className="flex flex-row justify-center items-center">
          <ChatTab
            name={"General"}
            messages={generalMessages}
            unread={unreadGeneralMessages}
            active={generalTab}
            onClick={handleGeneralTabClick}
          />
          <ChatTab
            name={"Private"}
            messages={privateMessages}
            unread={unreadPrivateMessages}
            active={privateTab}
            onClick={handlePrivateTabClick}
          />
        </div>
      </div>
      {/* Chat Messages */}
      <div className="h-full">
        {getMessages().map((message, idx) => (
          <Message message={message} key={`message-${idx}`} />
        ))}
      </div>
      {/* Message Input */}
      <div className="p-4 border-t dark:border-dark-400 flex flex-row justify-between w-10/12 self-center items-center">
        <button className="outline-none text-text-900 dark:text-text-200  dark:bg-none bg-lt-600 bg-opacity-30 rounded-full p-1">
          <Reactions className="w-6 h-6" />
        </button>
        <input
          className="dark:bg-dark-900 bg-lt-50 outline-none"
          type="text"
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          className="outline-none text-text-900 dark:text-text-200"
          onClick={handleSendMessage}
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Chat;

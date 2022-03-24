import { useState } from "react";
import { Reactions, Send } from "../../utils/svgs";

const generalMessages = [
  { message: "Hello World", sender: "Anthony L.", time: "1:57pm" },
  {
    message:
      "Mollit voluptate aliquip in ex voluptate et Lorem nulla mollit Lorem pariatur et. Lorem nostrud fugiat deserunt irure. Cillum ea nulla incididunt officia enim est et reprehenderit minim voluptate ad. Ex et nostrud proident ipsum. Irure consectetur proident do nulla fugiat nostrud nulla elit consequat. Sit nisi quis cupidatat labore ad do eu do reprehenderit excepteur. Id magna do culpa voluptate commodo veniam commodo eu ad.",
    sender: "Anthony L.",
    time: "1:57pm",
  },
  {
    message:
      "Sit cillum veniam elit sunt irure velit est dolor et ipsum elit quis qui minim.",
    sender: "Sarah K.",
    time: "1:57pm",
  },
  { message: "Hello World", sender: "Michal S.", time: "1:57pm" },
];

const privateMessages = [
  {
    message: "k",
    sender: "f",
    time: "1:23 pm",
  },
];

function ChatTab({ name, messages, active, onClick }) {
  const handleTabClick = () => {
    if (active) return;

    onClick && onClick();
  };

  return (
    <button
      onClick={handleTabClick}
      className={
        "outline-none w-full flex flex-row border-b dark:border-dark-600 border-lt-300 justify-center gap-x-4 p-4 " +
        (active && "dark:border-dark-400 border-lt-600")
      }
    >
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
      {messages && (
        <span className="rounded-full w-6 h-6 flex items-center justify-center dark:bg-dark-600 bg-lt-300 bg-opacity-60">
          {messages.length}
        </span>
      )}
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

function Chat(props) {
  const [generalTab, setGeneralTab] = useState(true);
  const [privateTab, setPrivateTab] = useState(false);

  const handleGeneralTabClick = () => {
    setPrivateTab(false);
    setGeneralTab(true);
  };

  const handlePrivateTabClick = () => {
    setPrivateTab(true);
    setGeneralTab(false);
  };

  const getMessages = () => {
    if (generalTab) return generalMessages;
    else return privateMessages;
  };

  return (
    <div className="flex flex-col justify-between dark:bg-dark-900 bg-lt-50 col-span-3">
      {/* Tabs */}
      <div>
        <div className="flex flex-row justify-center items-center">
          <ChatTab
            name={"General"}
            messages={generalMessages}
            active={generalTab}
            onClick={handleGeneralTabClick}
          />
          <ChatTab
            name={"Private"}
            messages={privateMessages}
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
          placeholder="Type your message..."
        />
        <button className="outline-none text-text-900 dark:text-text-200">
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Chat;

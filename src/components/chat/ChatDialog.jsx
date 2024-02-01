import { useEffect } from "react";
import { useState } from "react";
import { useBoundStore } from "../../stores";

function CustomizedInputBase() {
  const sendChatMessageAsync = useBoundStore(
    (state) => state.sendChatMessageAsync
  );
  const pendingResponse = useBoundStore((state) => state.pendingResponse);
  const initChatWebSocket = useBoundStore((state) => state.initChatWebSocket);
  const currWebSocket = useBoundStore((state) => state.currWebSocket);
  const [message, setMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    initChatWebSocket();
    return () => {
      try {
        currWebSocket.close();
      } catch (err) {
        // log
      }
    };
  }, []);

  const clickHandler = async (e) => {
    if (message.trim().length == 0) return;
    setMessage("");
    sendChatMessageAsync(message);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      clickHandler(event);
    }
  };
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  return (
    <div className="px-4 py-2 flex items-center w-auto">
      <input
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        id="message_box"
        onKeyDown={handleKeyDown}
        value={message}
        type="text"
        name="text"
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-700 placeholder:text-gray-400 sm:text-sm sm:leading-6"
        placeholder="Send message"
        disabled={pendingResponse}
        ref={(input) => {
          if (input != null) {
            input.focus();
          }
        }}
      />
      <button
        type="button"
        id="send_message"
        disabled={pendingResponse}
        onClick={clickHandler}
        className="px-2"
      >
        {pendingResponse ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
        )}
      </button>

      {openSnack && <p className="text-red-600 w-100">Error sending message</p>}
    </div>
  );
}

const ChatDialog = () => {
  const chatMessages = useBoundStore((state) => state.chatMessages);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 justify-end items-end bg-[#7EDEF1]">
        <div className="flex flex-col flex-wrap w-100 px-3">
          {chatMessages.map(({ id, message, msg_from }) => {
            return (
              <div
                key={id}
                className={`${
                  msg_from === "gpt"
                    ? "bg-sky-200 rounded-br-3xl"
                    : "bg-white rounded-bl-3xl"
                } leading-5 items-stretch rounded-t-3xl  shadow-sm justify-center mb-4 p-4`}
              >
                <pre className="m-0 text-sm whitespace-break-spaces">
                  {message}
                </pre>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-1 bg-[#EAEFF1] mt-auto">
        <CustomizedInputBase />
      </div>
    </div>
  );
};

export default ChatDialog;

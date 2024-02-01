import { useState, useEffect } from "react";
import ChatDialog from "./ChatDialog";
import { useBoundStore } from "../../stores";

export default function Chat() {
  const clearChatMessages = useBoundStore((state) => state.clearChatMessages);
  useEffect(() => {
    clearChatMessages();
    // startChat()
  }, []);

  return (
    <div className="flex min-h-[100vh]">
      <ChatDialog />
    </div>
  );
}

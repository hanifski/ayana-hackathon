"use client";

import { useAssistant } from "ai/react";

export default function AssistantChat() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({
      api: "/api/assistant",
    });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role}: {message.content}
        </div>
      ))}
      <form onSubmit={submitMessage}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <button type="submit" disabled={status !== "awaiting_message"}>
          Send
        </button>
      </form>
    </div>
  );
}

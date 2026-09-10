"use client";

import React, { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Message = {
    role : string,
    content : string
}

function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>();

  const onSend =  async () => {

    if(!userInput?.trim()) return;

    setUserInput('');
    const newMsg:Message={
        role: 'user',
        content:userInput
    }

    setMessages((prev:Message[]) => [...prev, newMsg]);

    const result = await axios.post("/api/aimodel", {
        messages:[...messages, newMsg]

  });

  setMessages((prev:Message[]) => [...prev, {
    role: 'assistant',
    content: result?.data?.response 
  }])

  console.log(result.data);
}

  return (
    <div className="h-[85vh] flex flex-col">

      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto p-4">

        {/* User Message */}
        <div className="flex justify-end mt-2">
          <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg">
            User Msg
          </div>
        </div>

        {/* AI Agent Message */}
        <div className="flex justify-start mt-2">
          <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
            AI Agent Msg
          </div>
        </div>

      </section>

      {/* User Input */}
      <section className="p-4">

        <div className="relative">

          <Textarea
          onChange = {(event)=> setUserInput(event.target.value)}
            value={userInput}
            placeholder="Create a trip for Paris from New York"
            className="h-36 w-full resize-none rounded-xl p-4 pr-16"
            
          />

          <Button
            onClick={onSend}
            size="icon"
            className="absolute bottom-4 right-4 rounded-lg"
          >
            <Send size={20} />
          </Button>

        </div>

      </section>

    </div>
  );
}

export default Chatbox;
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';

export default function Chat() {
/*
  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/vercel-guides',
    }),

    // Auto continue after tool outputs
    sendAutomaticallyWhen:
      lastAssistantMessageIsCompleteWithToolCalls,

    // Auto execute client-side tools
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;

      if (toolCall.toolName === 'getLocation') {
        const cities = [
          'New York',
          'Los Angeles',
          'Chicago',
          'San Francisco',
        ];

        const city =
          cities[Math.floor(Math.random() * cities.length)];

        return addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: city,
        });
      }
    },
  });
*/
const chat = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),

  sendAutomaticallyWhen:
    lastAssistantMessageIsCompleteWithToolCalls,

  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) return;

    if (toolCall.toolName === 'getLocation') {
      const cities = [
        'New York',
        'Los Angeles',
        'Chicago',
        'San Francisco',
      ];

      const city =
        cities[Math.floor(Math.random() * cities.length)];

      return chat.addToolOutput({
        tool: 'getLocation',
        toolCallId: toolCall.toolCallId,
        output: city,
      });
    }
  },
});

const {
  messages,
  sendMessage,
  addToolOutput,
  status,
  error,
} = chat;


  const [input, setInput] = useState('');

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-4">
      {/* Messages */}
      {messages.map(message => (
        <div
          key={message.id}
          className="border rounded-lg p-4 space-y-2"
        >
          <strong>{message.role}</strong>

          {message.parts.map((part, index) => {
            switch (part.type) {
              /**
               * TEXT
               */
              case 'text':
                return (
                  <p key={`${message.id}-${index}`}>
                    {part.text}
                  </p>
                );

              /**
               * ASK CONFIRMATION TOOL
               */
              case 'tool-askForConfirmation': {
                const callId = part.toolCallId;

                switch (part.state) {
                  case 'input-streaming':
                    return (
                      <div key={callId}>
                        Loading confirmation request...
                      </div>
                    );

                  case 'input-available':
                    return (
                      <div
                        key={callId}
                        className="space-y-2"
                      >
                        <p>{part.input.message}</p>

                        <div className="flex gap-2">
                          <button
                            className="border px-3 py-1 rounded"
                            onClick={() =>
                              addToolOutput({
                                tool: 'askForConfirmation',
                                toolCallId: callId,
                                output: 'Yes, confirmed.',
                              })
                            }
                          >
                            Yes
                          </button>

                          <button
                            className="border px-3 py-1 rounded"
                            onClick={() =>
                              addToolOutput({
                                tool: 'askForConfirmation',
                                toolCallId: callId,
                                output: 'No, denied.',
                              })
                            }
                          >
                            No
                          </button>
                        </div>
                      </div>
                    );

                  case 'output-available':
                    return (
                      <div key={callId}>
                        Confirmation: {part.output}
                      </div>
                    );

                  case 'output-error':
                    return (
                      <div key={callId}>
                        Error: {part.errorText}
                      </div>
                    );
                }

                break;
              }

              /**
               * GET LOCATION TOOL
               */
              case 'tool-getLocation': {
                const callId = part.toolCallId;

                switch (part.state) {
                  case 'input-streaming':
                    return (
                      <div key={callId}>
                        Preparing location request...
                      </div>
                    );

                  case 'input-available':
                    return (
                      <div key={callId}>
                        Getting location...
                      </div>
                    );

                  case 'output-available':
                    return (
                      <div key={callId}>
                        Location: {part.output}
                      </div>
                    );

                  case 'output-error':
                    return (
                      <div key={callId}>
                        Error getting location: {part.errorText}
                      </div>
                    );
                }

                break;
              }

              /**
               * GET WEATHER TOOL
               */
              case 'tool-getWeatherInformation': {
                const callId = part.toolCallId;

                switch (part.state) {
                  case 'input-streaming':
                    return (
                      <div key={callId}>
                        Preparing weather request...
                      </div>
                    );

                  case 'input-available':
                    return (
                      <div key={callId}>
                        Getting weather for {part.input.city}...
                      </div>
                    );

                  case 'output-available':
                    return (
                      <div key={callId}>
                        Weather in {part.input.city}:{' '}
                        {part.output}
                      </div>
                    );

                  case 'output-error':
                    return (
                      <div key={callId}>
                        Error getting weather for {part.input.city}:{' '}
                        {part.errorText}
                      </div>
                    );
                }

                break;
              }

              default:
                return null;
            }
          })}
        </div>
      ))}

      {/* Loading */}
      {status === 'streaming' && <p>Thinking...</p>}

      {/* Error */}
      {error && (
        <p className="text-red-500">
          Error: {error.message}
        </p>
      )}

      {/* Input */}
      <form
        className="flex gap-2"
        onSubmit={e => {
          e.preventDefault();

          if (!input.trim()) return;

          sendMessage({
            text: input,
          });

          setInput('');
        }}
      >
        <input
          className="border rounded px-3 py-2 flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
        />

        <button
          className="border rounded px-4 py-2"
          type="submit"
        >
          Send
        </button>
      </form>
    </main>
  );
}
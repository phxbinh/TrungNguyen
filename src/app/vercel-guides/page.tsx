'use client';

import { useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';

type AddToolOutput =
  ReturnType<typeof useChat>['addToolOutput'];

export default function Chat() {
  const [input, setInput] = useState('');

  const toolOutputRef =
    useRef<AddToolOutput | null>(null);

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: '/api/vercel-guides',
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

        return toolOutputRef.current?.({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: city,
        });
      }
    },
  });

  toolOutputRef.current = chat.addToolOutput;

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
  } = chat;

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

                  case 'input-available': {
                    const toolInput = part.input as {
                      message: string;
                    };

                    return (
                      <div
                        key={callId}
                        className="space-y-2"
                      >
                        <p>{toolInput.message}</p>

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
                  }

                  case 'output-available':
                    return (
                      <div key={callId}>
                        Confirmation: {String(part.output)}
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
                        Location: {String(part.output)}
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

                  case 'input-available': {
                    const toolInput = part.input as {
                      city: string;
                    };

                    return (
                      <div key={callId}>
                        Getting weather for {toolInput.city}...
                      </div>
                    );
                  }

                  case 'output-available': {
                    const toolInput = part.input as {
                      city: string;
                    };

                    return (
                      <div key={callId}>
                        Weather in {toolInput.city}:{' '}
                        {String(part.output)}
                      </div>
                    );
                  }

                  case 'output-error': {
                    const toolInput = part.input as {
                      city: string;
                    };

                    return (
                      <div key={callId}>
                        Error getting weather for {toolInput.city}:{' '}
                        {part.errorText}
                      </div>
                    );
                  }
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
// app/page.tsx
/*
import React from 'react';

export default function HomePage() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Hello world</h1>
    </div>
  );
}

// Cấu hình style cơ bản cho đẹp mắt
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
  fontFamily: 'system-ui, sans-serif',
};

const headingStyle: React.CSSProperties = {
  fontSize: '3rem',
  color: '#333',
  fontWeight: 'bold',
};
*/

// app/page.tsx -> Đang chạy ổn
/*
import React from 'react';
import Link from 'next/link'; // 1. Import Link từ next/link

export default function HomePage() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Hello world</h1>
      
      
      <Link href="/ai-agent" style={linkStyle}>
        Khám phá AI Agent →
      </Link>
      <Link href="/chat-tool" style={linkStyle}>
        Khám phá AI Agent with chatTool →
      </Link>
      <Link href="/ai-hybrid-chat" style={linkStyle}>
        Khám phá AI Agent with Hybrid →
      </Link>
      <Link href="/vercel-guides" style={linkStyle}>
        Khám phá AI Agent with Vercel Guide SDK →
      </Link>
      <Link href="/langchain-sdk" style={linkStyle}>
        Khám phá AI Agent with LangChain SDK →
      </Link>
      <Link href="/use-gemini-in-langchain" style={linkStyle}>
        AI Agent use Gemini in LangChain →
      </Link>
    </div>
  );
}

// Cấu hình style
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', // Đổi sang column để chữ và link xếp theo chiều dọc
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
  fontFamily: 'system-ui, sans-serif',
  gap: '20px', // Tạo khoảng cách giữa h1 và link
};

const headingStyle: React.CSSProperties = {
  fontSize: '3rem',
  color: '#333',
  fontWeight: 'bold',
  margin: 0, // Xóa margin mặc định để gap hoạt động chuẩn
};

const linkStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#0070f3',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '10px 20px',
  border: '1px solid #0070f3',
  borderRadius: '8px',
  backgroundColor: '#fff',
  transition: 'all 0.2s ease',
};
*/


// app/page.tsx
import Link from 'next/link';
import React from 'react';

const routes = [
  {
    href: '/ai-agent',
    title: 'AI Agent',
    summary:
      'Flow agent cơ bản với tool calling, multi-step reasoning và stop conditions.',
    status: 'done',
  },
  {
    href: '/chat-tool',
    title: 'AI Agent with Chat Tool',
    summary:
      'Demo tool invocation trong chat, render tool result trực tiếp lên UI.',
    status: 'done',
  },
  {
    href: '/ai-hybrid-chat',
    title: 'AI Hybrid Agent',
    summary:
      'Kết hợp deterministic flow + AI intent parsing để giảm token và tăng kiểm soát.',
    status: 'testing',
  },
  {
    href: '/vercel-guides',
    title: 'Vercel AI SDK Guide',
    summary:
      'Playground để test các pattern từ Vercel AI SDK v6 (streamText, generateText, tools).',
    status: 'done',
  },
  {
    href: '/langchain-sdk',
    title: 'LangChain SDK',
    summary:
      'Thử nghiệm agent/tool orchestration bằng LangChain với custom tools.',
    status: 'testing',
  },
  {
    href: '/use-gemini-in-langchain',
    title: 'Gemini + LangChain',
    summary:
      'Tích hợp Gemini model vào LangChain để test reasoning + tool execution.',
    status: 'draft',
  },
];

export default function HomePage() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>AI Playground</h1>

      <div style={listStyle}>
        {routes.map((route) => (
          <Link key={route.href} href={route.href} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span>{route.title}</span>
              <span style={badgeStyle(route.status)}>
                {route.status}
              </span>
            </div>

            <p style={summaryStyle}>{route.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: '40px',
  minHeight: '100vh',
  background: '#f7f8fa',
};

const headingStyle: React.CSSProperties = {
  fontSize: '2rem',
  marginBottom: '30px',
};

const listStyle: React.CSSProperties = {
  display: 'grid',
  gap: '16px',
  maxWidth: '900px',
};

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '12px',
  background: '#fff',
  textDecoration: 'none',
  color: '#111',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  fontWeight: 'bold',
};

const summaryStyle: React.CSSProperties = {
  margin: 0,
  color: '#666',
  lineHeight: 1.5,
};

const badgeStyle = (status: string): React.CSSProperties => ({
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  border: '1px solid #ccc',
});




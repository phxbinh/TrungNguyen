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

// app/page.tsx
import React from 'react';
import Link from 'next/link'; // 1. Import Link từ next/link

export default function HomePage() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Hello world</h1>
      
      {/* 2. Thêm thẻ Link để chuyển hướng sang /ai-agent */}
      <Link href="/ai-agent" style={linkStyle}>
        Khám phá AI Agent →
      </Link>
      <Link href="/chat-tool" style={linkStyle}>
        Khám phá AI Agent with chatTool →
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


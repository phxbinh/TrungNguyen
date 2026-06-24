// app/page.tsx
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

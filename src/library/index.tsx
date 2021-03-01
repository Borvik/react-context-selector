import React from 'react';

export const TestComponent: React.FC = ({ children }) => {
  return <div className='test-component'>
    <div>Test Component</div>
    <div>
      {children}
    </div>
  </div>
}
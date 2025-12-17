import React, { useState, useEffect } from "react";

function Greeting({ name }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;

    return () => {
      document.title = 'React App';
    };
  }, [count]);

  return (
    <div>
      {}
      <h1>Hello, {name}!</h1> 
      
      {}
      <p>You clicked {count} times.</p>
      
      {}
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
export default Greeting;
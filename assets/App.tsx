import React, { useState, useEffect } from 'react';
import Nav from './src/Navbar/Nav'
import fetcher from './fetcher';

const App = () => {

const [message, setMessage] = useState<string>('Frontend');
console.log(setMessage);

useEffect(() => {
  const fetchData = async () => {
     fetcher(
      "http://localhost:8080/api/test"
    ).then((result) => {
      setMessage(result);

  });
  };

  fetchData();
})

console.log(setMessage)
  return (
    <div>
      <Nav />
      <br/>
      <br/>
      <br/>
      <pre>
    <code>
      {message && JSON.stringify(message, null, 4)}
    </code>
  </pre>
  </div>
  );
};

export default App;


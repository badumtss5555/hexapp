import React, { useState, useEffect } from 'react';

const WalletConnect = ({ onAddressSubmit }: { onAddressSubmit: (address: string, label: string) => void }) => {
  const [address, setAddress] = useState(''); // State for the address input
  const [label, setLabel] = useState('');     // State for the label input
  const [data, setData] = useState<any | null>(null); // State for the API data
  const [isCached, setIsCached] = useState(false); // State to track if cached data is being used

  // Check if data for the address exists in sessionStorage
  useEffect(() => {
    const cachedData = sessionStorage.getItem(address);
    if (cachedData) {
      setData(JSON.parse(cachedData)); // If data is cached, set it to state
      setIsCached(true); // Mark that cached data is being used
    }
  }, [address]); // Trigger when the address changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the data is already cached
    const cachedData = sessionStorage.getItem(address);
    if (!cachedData) {
      // If not cached, call the parent function to handle API call and save the result
      onAddressSubmit(address, label); // Assuming API call happens in the parent
      sessionStorage.setItem(address, JSON.stringify({ address, label })); // Save the data to sessionStorage
      setIsCached(false); // Mark that cached data is not being used
    } else {
      setData(JSON.parse(cachedData)); // Load cached data if available
      setIsCached(true); // Mark that cached data is being used
    }

    // Clear the input fields
    setAddress('');
    setLabel('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter PulseChain Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="p-2 border rounded-md"
      />
      <input
        type="text"
        placeholder="Label (Optional)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="ml-2 p-2 border rounded-md"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">
        fetch api data
      </button>

      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">
        upload stake data from local storage
      </button>

      {/* Display cached data if available */}
      {data && (
        <div>
          <h2>Data for Address: {address}</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>

          {/* Display message if cached data was pulled */}
          {isCached && <p style={{ color: 'green' }}>This data was pulled from cache.</p>}
        </div>
      )}
    </form>
  );
};

export default WalletConnect;

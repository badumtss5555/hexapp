import React, { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import BalanceCard from './components/BalanceCard';
import StakeCard from './components/StakeCard';
import StakeTable from './components/StakeTable'; // Import new StakeTable component
import { fetchBalance } from './hooks/useFetchBalances';
import { fetchStakes } from './hooks/useFetchStakes';

const App = () => {
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    setSavedAddresses(storedAddresses);
  }, []);

  const handleAddressSubmit = async (address: string, label: string) => {
    setIsLoading(true);

    // Check if stakes for this address are already cached
    const cachedStakes = JSON.parse(localStorage.getItem(`stakes_${address}`) || 'null');
    let fetchedStakes;

    if (cachedStakes) {
      fetchedStakes = cachedStakes;
    } else {
      fetchedStakes = await fetchStakes(address);
      localStorage.setItem(`stakes_${address}`, JSON.stringify(fetchedStakes)); // Cache stakes for this address
    }

    const fetchedBalance = await fetchBalance(address);
    setIsLoading(false);

    const newEntry = { address, label, balance: fetchedBalance, stakes: fetchedStakes };
    const updatedAddresses = [...savedAddresses, newEntry];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleRefresh = async (address: string) => {
    setIsLoading(true);

    // Force fetch from API on refresh and update localStorage
    const refreshedStakes = await fetchStakes(address);
    localStorage.setItem(`stakes_${address}`, JSON.stringify(refreshedStakes)); // Cache refreshed stakes

    const refreshedBalance = await fetchBalance(address);
    setIsLoading(false);

    const updatedAddresses = savedAddresses.map((entry) =>
      entry.address === address ? { ...entry, balance: refreshedBalance, stakes: refreshedStakes } : entry
    );
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const handleDelete = (address: string) => {
    const updatedAddresses = savedAddresses.filter((entry) => entry.address !== address);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));

    // Also remove cached stakes for this address
    localStorage.removeItem(`stakes_${address}`);
  };

  const toggleView = () => {
    setViewMode(viewMode === 'grid' ? 'table' : 'grid');
  };

  // Function to format the address parts
  const formatAddress = (address: string) => {
    const firstTwo = address.slice(0, 2);   // First 2 characters
    const middle = address.slice(6, -4);    // Middle part of the address
    const nextFour = address.slice(2, 6);   // Next 4 characters
    const lastFour = address.slice(-4);     // Last 4 characters

    return (
      <span>
        {/* First two characters in yellow */}
        <span style={{ color: 'yellow' }}>{firstTwo}</span>
        {/* Next four characters in pink */}
        <span style={{ color: 'magenta' }}>{nextFour}</span>
        {/* Middle part of the address in white */}
        <span style={{ color: 'white' }}>{middle}</span>
        {/* Last four characters in pink */}
        <span style={{ color: 'magenta' }}>{lastFour}</span>
      </span>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">PulseChain Address Lookup</h1>
      <WalletConnect onAddressSubmit={handleAddressSubmit} />

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>

        {isLoading ? (
          <div className="p-4 text-center">
            <p>Loading data, please wait...</p>
          </div>
        ) : (
          <ul>
            {savedAddresses.length > 0 ? (
              savedAddresses.map((entry, index) => (
                <li key={index}>
                  <span className="font-semibold">{entry.label || 'Unnamed Hexican'}:</span>{' '}
                  {formatAddress(entry.address)} {/* Apply custom address formatting here */}

                  <button
                    onClick={() => handleRefresh(entry.address)}
                    className="ml-4 p-2 bg-green-500 text-white rounded-md"
                  >
                    pull old data from cache
                  </button>
                  <button
                    onClick={() => handleDelete(entry.address)}
                    className="ml-2 p-2 bg-red-500 text-white rounded-md"
                  >
                    Delete cache
                  </button>

                  <button
                    onClick={() => handleDelete(entry.address)}
                    className="ml-2 p-2 bg-red-500 text-white rounded-md"
                  >
                    download cached stake data
                  </button>

                  <div className="mt-2">
                    <BalanceCard balance={entry.balance} />
                  </div>

                  <div className="mt-4">
                    <button onClick={toggleView} className="p-2 bg-blue-500 text-white rounded-md mb-4">
                      Toggle {viewMode === 'grid' ? 'Classic' : 'card'} View
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2">ACTIVE HEX STAKES</h3>

                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {entry.stakes.length > 0 ? (
                          entry.stakes.map((stake: any, stakeIndex: number) => {
                            // Calculate the start date, end date, and percent served
                            const lockedDayNum = parseInt(stake?.lockedDay || '0');
                            const stakedDaysNum = parseInt(stake?.stakedDays || '0');
                            const hexLaunchDate = new Date('2019-12-02');
                            const startDate = new Date(hexLaunchDate.getTime() + lockedDayNum * 24 * 60 * 60 * 1000);
                            const endDate = new Date(startDate.getTime() + stakedDaysNum * 24 * 60 * 60 * 1000);
                            const today = new Date();
                            const totalStakeTime = endDate.getTime() - startDate.getTime();
                            const timeServed = today.getTime() - startDate.getTime();
                            const percentServed = Math.min((timeServed / totalStakeTime) * 100, 100).toFixed(2);

                            return (
                              <StakeCard
                                key={stakeIndex}
                                stakeId={stake?.stakeId?.toString() || 'N/A'}
                                stakedHearts={stake?.stakedHearts?.toString() || '0'}
                                stakeShares={stake?.stakeShares?.toString() || '0'}
                                lockedDay={stake?.lockedDay?.toString() || 'Unknown'}
                                stakedDays={stake?.stakedDays?.toString() || '0'}
                                unlockedDay={stake?.unlockedDay?.toString() || 'Unknown'}
                              />
                            );
                          })
                        ) : (
                          <p>No stakes found for this address.</p>
                        )}
                      </div>
                    ) : (
                      <StakeTable stakes={entry.stakes} />
                    )}
                  </div>

                  {/* Add EXPIRED HEX STAKES section here if needed */}
                </li>
              ))
            ) : (
              <p>No saved addresses.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';

interface StakeTableProps {
  stakes: any[]; // You can replace 'any' with the correct typing if available
}

// Helper function to format large numbers
const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'; // Trillions
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';  // Billions
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';  // Millions
  return num.toFixed(2);  // Default to two decimals
};

const StakeTable: React.FC<StakeTableProps> = ({ stakes }) => {
  const [showDayNumber, setShowDayNumber] = useState(false); // Toggle state

  // Function to toggle between date and day number
  const toggleDisplay = () => {
    setShowDayNumber(!showDayNumber);
  };

  return (
    <table className="min-w-full bg-white border">
      <thead>
        {/* Primary Header Row */}
        <tr>
          <th className="px-4 py-2" colSpan={3}>Time Value</th>
          <th className="px-4 py-2" rowSpan={2}>Chart</th>
          <th className="px-4 py-2" rowSpan={2}>delete this maybe?</th>
          <th className="px-4 py-2" colSpan={2}>% APY</th> {/* Update APY cols */}
          <th className="px-4 py-2" rowSpan={2}>T-Shares</th>
          <th className="px-4 py-2" rowSpan={2}>Principal</th> {/* Update T-Shares */}
          <th className="px-4 py-2" rowSpan={2}>BigPayDay</th> {/* BigPayDay col needs to be dynamically omitted if every stake is zero */}
          <th className="px-4 py-2" rowSpan={2}>Yield</th>
          <th className="px-4 py-2" colSpan={2}>Current Value</th>
        </tr>

        {/* Secondary Header Row */}
        <tr>
          <th className="px-4 py-2">Start</th>
          <th className="px-4 py-2">End</th>
          <th className="px-4 py-2">Progress</th>
          <th className="px-4 py-2">All</th>
          <th className="px-4 py-2">Yesterday</th>
          <th className="px-4 py-2">USD</th>
        </tr>
      </thead>

      <tbody>
        {stakes.length > 0 ? (
          stakes.map((stake: any, stakeIndex: number) => {
            const lockedDayNum = parseInt(stake?.lockedDay || '0');
            const stakedDaysNum = parseInt(stake?.stakedDays || '0');
            const hexLaunchDate = new Date('2019-12-02'); // Example HEX launch date
            const startDate = new Date(hexLaunchDate.getTime() + lockedDayNum * 24 * 60 * 60 * 1000);
            const endDate = new Date(startDate.getTime() + stakedDaysNum * 24 * 60 * 60 * 1000);
            const today = new Date();
            const totalStakeTime = endDate.getTime() - startDate.getTime();
            const timeServed = today.getTime() - startDate.getTime();
            const percentServed = Math.min((timeServed / totalStakeTime) * 100, 100).toFixed(2); // Cap at 100%
            const stakedHex = (stake?.stakedHearts) / 1e8; // Convert stakedHearts to HEX

            return (
              <tr key={stakeIndex}>
                {/* Add onClick event to toggle between date and day number */}
                <td className="border px-4 py-2" onClick={toggleDisplay}>
                  {showDayNumber ? lockedDayNum : startDate.toISOString().split('T')[0]} {/* ISO format */}
                </td>
                <td className="border px-4 py-2" onClick={toggleDisplay}>
                  {showDayNumber ? lockedDayNum + stakedDaysNum : endDate.toISOString().split('T')[0]} {/* ISO format */}
                </td>
                <td className="border px-4 py-2">{percentServed}%</td>
                <td className="border px-4 py-2">Chart Placeholder</td>
                <td className="border px-4 py-2">{stake?.apyYesterday?.toFixed(2) || 'N/A'}</td>
                <td className="border px-4 py-2">{stake?.apyAllTime?.toFixed(2) || 'N/A'}</td>
                <td className="border px-4 py-2">{stakedHex ? Math.floor(Number(stakedHex)).toString() : '0'}</td>
                <td className="border px-4 py-2">{formatLargeNumber(parseFloat(stake?.stakeShares || '0'))}</td>
                <td className="border px-4 py-2">{stake?.bigPayDay?.toString() || '0'}</td>
                <td className="border px-4 py-2">{stake?.yield?.toString() || '0'}</td> 
                <td className="border px-4 py-2">{stake?.hexValue?.toString() || '0'}</td>
                <td className="border px-4 py-2">{stake?.usdValue?.toString() || '0'}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={12} className="border px-4 py-2 text-center">
              No stakes found for this address.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StakeTable;

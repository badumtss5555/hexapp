import React from 'react';

interface BalanceCardProps {
  balance: string;  // Balance is a string to handle large numbers
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  // Convert the balance string to a number, divide by 1e12 (trillions), and format with commas
  const formattedBalance = (Number(balance) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="border p-4 rounded-md shadow-md">
      <h3>Balance: {formattedBalance} Pulse (PLS)</h3>
    </div>
  );
};

export default BalanceCard;

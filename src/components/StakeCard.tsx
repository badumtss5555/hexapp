import React from 'react';
import '../styles/StakeCard.css';

// Helper function to format large numbers (for Shares)
const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'; // Trillions
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';  // Billions
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';  // Millions
  return num.toFixed(2);  // Default to two decimals
};

interface StakeCardProps {
  stakeId: string;
  stakedHearts: string;
  stakeShares: string;
  lockedDay: string;
  stakedDays: string;
  unlockedDay: string | null;
}

const StakeCard: React.FC<StakeCardProps> = ({ stakeId, stakedHearts, stakeShares, lockedDay, stakedDays, unlockedDay }) => {
  const lockedDayNum = parseInt(lockedDay, 10);
  const stakedDaysNum = parseInt(stakedDays, 10);

  const hexLaunchDate = new Date('2019-12-02');
  const startDate = new Date(hexLaunchDate.getTime() + lockedDayNum * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + stakedDaysNum * 24 * 60 * 60 * 1000);

  const today = new Date();
  const totalStakeTime = endDate.getTime() - startDate.getTime();
  const timeServed = today.getTime() - startDate.getTime();
  const percentServed = Math.min((timeServed / totalStakeTime) * 100, 100).toFixed(2);

  const startDateFormatted = startDate.toLocaleDateString();
  const endDateFormatted = endDate.toLocaleDateString();
  const unlockedDayFormatted = unlockedDay ? new Date(unlockedDay).toLocaleDateString() : 'Still Active';

  const formattedShares = formatLargeNumber(parseFloat(stakeShares)); // Format Shares

  return (
    <div className="trading-card">
      <div className="card-header">
        <h3>Hex Stake {stakeId}</h3> {/* Icon removed for simplicity */}
      </div>

      <div className="info-grid">
        <div className="info-box">Start Date: {startDateFormatted}</div>
        <div className="info-box">End Date: {endDateFormatted}</div>
        <div className="info-box">Unlocked: {unlockedDayFormatted}</div>
        <div className="info-box">Days Left: {stakedDaysNum}</div>
        <div className="info-box">Progress: {percentServed}%</div>
        <div className="info-box">Shares: {formattedShares}</div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentServed}%` }}></div>
      </div>

      <div className="card-footer">
        <p>Principal: {(parseInt(stakedHearts) / 1e8).toFixed(2)} HEX</p>
      </div>
    </div>
  );
};

export default StakeCard;

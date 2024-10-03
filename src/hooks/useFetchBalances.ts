import axios from 'axios';

const BASE_URL = 'https://api.scan.pulsechain.com/api';

// Function to fetch balance and handle large numbers
export const fetchBalance = async (address: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        module: 'account',
        action: 'eth_get_balance',
        address: address,
        block: 'latest',
      },
    });

    // Assuming the result is a large integer, we convert it using BigInt to handle the large number
    const balanceInPLS = BigInt(response.data.result).toString(); // Convert balance to string to avoid scientific notation
    
    return balanceInPLS; // Return the balance as a plain string
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};

import { ethers } from 'ethers';
import HEX_ABI from '../utils/HEX.json'; // Ensure the path is correct to the HEX ABI

const HEX_CONTRACT_ADDRESS = '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'; // HEX contract address

export const fetchStakes = async (address: string) => {
  try {
    // Connect to PulseChain RPC provider
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.pulsechain.com'); // PulseChain RPC URL
    const contract = new ethers.Contract(HEX_CONTRACT_ADDRESS, HEX_ABI, provider);

    // Fetch the number of stakes
    const stakeCount = await contract.stakeCount(address);

    // Fetch all stakes
    const stakes = [];
    for (let i = 0; i < stakeCount; i++) {
      const stake = await contract.stakeLists(address, i); // Get each stake from the contract
      stakes.push(stake); // Push the stake into the stakes array
    }

    console.log('Fetched Stakes:', stakes); // Log the stakes to debug the response
    return stakes;
  } catch (error) {
    console.error('Error fetching HEX stakes:', error);
    return [];
  }
};

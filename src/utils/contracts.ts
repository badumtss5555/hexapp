export const HEX_CONTRACT_ADDRESS = '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'; // HEX contract address

export const HEX_ABI = [
  // The relevant ABI methods like stakeLists, etc.
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_index',
        type: 'uint256',
      },
    ],
    name: 'stakeLists',
    outputs: [
      { name: 'stakeId', type: 'uint256' },
      { name: 'stakeShares', type: 'uint256' },
      { name: 'startDate', type: 'uint256' },
      { name: 'stakedHearts', type: 'uint256' },
      { name: 'endDate', type: 'uint256' },
    ],
    type: 'function',
  },
];

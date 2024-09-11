### Visit our Notion page for additional details: 
https://www.notion.so/Battle-of-Olympus-Hackathon-Seekers-Alliance-Mini-Game-92b6c2b5c34443bc8a4f8d86e3493fe6


## 🎮 User Flow

![flowchart](https://drive.google.com/uc?export=view&id=1j217jHC1cI2rWmE1ynEEnru38xuSfynn)

## 💻 Smart Contract

**Address: [0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/nft/get_collection_address?network=testnet)**

| **NAME** | **FUNCTIONS** | **DESCRIPTION** |
| --- | --- | --- |
| **asset** | [burn_from_primary_stores](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/asset/burn_from_primary_stores?network=testnet) | Burns *SA Tokens* when bets are placed |
|  | [mint_to_primary_stores](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/asset/mint_to_primary_stores?network=testnet) | Mints *SA Tokens* for faucet & after game settlement |
|  | [transfer_between_primary_stores](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/asset/transfer_between_primary_stores?network=testnet) | Transfers *SA Tokens* |
|  | [get_balance](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/view/asset/get_balance?network=testnet) | Gets the *SA Token* balance in an address |
| **gameManager** | [claim_reward](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/gameManager/claim_reward?network=testnet) | Calls *mint_to_primary_stores* to mint rewards based on game results |
|  | [create_game](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/gameManager/create_game?network=testnet) | Creates a game object |
|  | [check_game_exists](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/view/gameManager/check_game_exists?network=testnet) | Checks if address is currently in combat (to prevent multiple entries) |
| **market** | [draw_cards](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/market/draw_cards?network=testnet) | Takes *random seed* as input to mint and transfer NFT cards to user’s wallet |
| **NFT** | [burn_all](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/nft/burn_all?network=testnet) | Burns all the *mini-game NFTs* in user’s wallet |
|  | [transfer](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/run/nft/transfer?network=testnet) | Transfer *mini-game NFTs* |
|  | [get_NFT_balance](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/view/nft/get_NFT_balance?network=testnet) | Get all the mini-game NFTs in the given address |
|  | [get_NFT_balance_number](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/view/nft/get_NFT_balance_number?network=testnet) | Gets how many *mini-game NFT*s are in address |
|  | [get_collection_address](https://explorer.movementlabs.xyz/object/0x41283d0be1e6f0a1f8f5939e136f8f5a9442e295ca42812cd256f529dc9e10d7/modules/view/nft/get_collection_address?network=testnet) | Gets the *mini-game NFT*’s collection address |

## ♣️ Mini-Game Logic & Rules

### **💡 Main Concepts**

- 3-zone, 1v1, numbers battle
- larger sum wins; winners gets a token of the specified color in the current Zone
- characters attack once token requirements are met, reducing opponent’s HP
- each player has 3 HP; the first player to reduce opponent HP to zero wins
- game ends after 5 *Turns*; player with higher HP wins

### **🎨 Game Assets**

- Number Cards 1-7, each is an NFT with probability of drawing:
    - 1-3: 20% each
    - 4-5: 13.33% each
    - 6-7: 6.66% each
- 3 types of in-game tokens: red, blue, green
- 6 Characters
    - each with a unique attack
    - an attack requires a specified number of in-game tokens to (auto) launch
- SA Tokens (fungible tokens) for betting

### **📏 Game Rules**

1. Before entering the game, the player must bet a number of SA Token(s). These will be immediately burned. WINNING the game will mint twice the bet to the player's wallet; player gets their bet back if it’s a DRAW; player loses the bet upon a LOSS.
2. When entering game, each player gets 3 random characters in a random order
3. Character attacks & token requirements:
    
    
    | **Character** | **Red** | **Green** | **Blue** | **DMG** | **Attack Name** |
    | --- | --- | --- | --- | --- | --- |
    | Bast |  |  | 1 | 1 | Arrow of the Wind |
    | Shimazu | 1 |  |  | 1 | Aroundight |
    | Bubble Gunner | 1 | 1 |  | 2 | Bubble Tempest |
    | Hawkeye | 1 |  | 1 | 2 | Phantom Snipe |
    | Blade Dancer |  | 1 | 1 | 2 | Blade of Vengeance |
    | The Council | 1 | 1 | 1 | 3 | Cannon of Reckoning |
4. Each player starts with 3 HP. Goal is to win by reducing opponent HP to zero.
5. Each Turn, both players will draw cards until they have 7 cards in hand. Players must use 6 of the 7 cards, 2 in each Zone. The remaining card will be retained for the next Turn.
6. Each Zone has a corresponding in-game token of a random color. The winning player with the larger sum in that Zone receives the token.
    - If both sides have the same sum, a new card is drawn from each player’s deck. The player with the larger card wins. If it’s another draw, then no one wins.
7. Special “VS” (rainbow) Zones: there is a random chance of a “VS Zone” appearing. The winning player of the VS Zone first rolls a random color, then try to take an in-game token of that color from their opponent. (If opponent does not have any token of that color, then nothing happens.)
8. Cards are always revealed from left to right. At the time of receiving the token, if the Attack requirements are met, Attack triggers and the corresponding tokens are deducted from the player's bank.
9. Bets are settled after the game ends. (WINNING the game will mint twice the bet to the player's wallet; player gets their bet back if it’s a DRAW; player loses the bet upon a LOSS.)

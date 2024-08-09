module BattleOfOlympus::gameManager{
    use std::signer;
    use std::signer::address_of;
    use std::string::String;
    use std::vector;
    use std::debug;
    use std::bcs;
    use std::string;
    use std::hash;
    use aptos_std::table;
    use aptos_std::table::Table;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::account::SignerCapability;
    use BattleOfOlympus::asset;

    struct GameInformation has key {
        opponent: address,
        bet_amount: u64,
    }
    struct Games has key {
        games_table: Table<address, GameInformation>,
    }

    /* fun init_module(sender: &signer) {
        let games = Games{
            games_table: Table::new()
        };
        move_to(sender, games);
    }

    public entry fun create_game(sender: &signer, opponent: address, bet_amount: u64) {
        let games = borrow_global_mut::<Games>(@BattleOfOlympus);
        let game_info = GameInformation{
            opponent: opponent,
            bet_amount: bet_amount,
        };
        table::upsert(&mut games.games_table, sender, game_info);
        asset::transfer(sender, opponent, bet_amount);

    } */


}
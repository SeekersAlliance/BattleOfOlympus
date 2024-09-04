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

    const GAME_MISSING: u64 = 1;

    struct GameInformation has key, drop, copy, store {
        opponent: address,
        bet_amount: u64,
    }
    struct Games has key {
        games_table: Table<address, GameInformation>,
    }

    #[event]
    struct GameCreated  has drop, store {
        player: address,
        opponent: address,
        bet_amount: u64,
    }
    #[event]
    struct GameFinished  has drop, store {
        player: address,
        opponent: address,
        bet_amount: u64,
        game_state: u64,
    }

    fun init_module(sender: &signer) {
        let games = Games{
            games_table: table::new()
        };
        move_to(sender, games);
    }

    public entry fun create_game(sender: &signer, bet_amount: u64) acquires Games {
        let opponent = @BattleOfOlympus;
        let games = borrow_global_mut<Games>(@BattleOfOlympus);
        let game_info = GameInformation{
            opponent: opponent,
            bet_amount: bet_amount,
        };
        table::upsert(&mut games.games_table, address_of(sender), game_info);
        asset::burn_from_primary_stores(sender, bet_amount);
        event::emit(GameCreated{
            player: address_of(sender),
            opponent: opponent,
            bet_amount: bet_amount,
        });
    }

    public entry fun claim_reward(sender: &signer, game_state: u64) acquires Games {
        let games = borrow_global_mut<Games>(@BattleOfOlympus);
        let check_player = table::borrow_with_default(&games.games_table, address_of(sender), &GameInformation{
            opponent: @0x0,
            bet_amount: 0,
        });
        assert!(check_player.opponent != @0x0, GAME_MISSING);

        let game_info = table::remove(&mut games.games_table, address_of(sender));
        let bet_amount = game_info.bet_amount;
        if (game_state == 2) {
            asset::mint_to_primary_stores(sender, address_of(sender), bet_amount * 2);
        } else if (game_state == 1) {
            asset::mint_to_primary_stores(sender, address_of(sender), bet_amount);
        };
        event::emit(GameFinished{
            player: address_of(sender),
            opponent: game_info.opponent,
            bet_amount: bet_amount,
            game_state: game_state,
        });
    }

    #[view]
    public fun check_game_exists(player: address): bool acquires Games {
        let games = borrow_global<Games>(@BattleOfOlympus);
        let check_player = table::borrow_with_default(&games.games_table, player, &GameInformation{
            opponent: @0x0,
            bet_amount: 0,
        });
        check_player.opponent != @0x0
    }

    #[test(creator = @BattleOfOlympus, aaron = @0xface)]
    fun test_basic_flow(creator: &signer, aaron: &signer) acquires Games {
        init_module(creator);
        asset::init(creator);
        asset::mint_to_primary_stores(aaron, address_of(aaron), 1000);
        create_game(aaron, 100);
        claim_reward(aaron, 2);
        let balance = asset::get_balance(address_of(aaron));
        debug::print(&balance);
        assert!(balance == 1100, 1);
    }
}
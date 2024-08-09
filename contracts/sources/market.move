module BattleOfOlympus::market {
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
    use BattleOfOlympus::nft;

    const RESOURCECAPSEED : vector<u8> = b"Seekers Alliance";

    
    struct ResourceCap has key {
        cap: SignerCapability
    }

    #[event]
    struct PurchaseEvent has drop, store {
        owner: address,
        ids: vector<u8>
    }


    fun init_module(sender: &signer) {


    }

    public entry fun draw_cards/* <CoinType> */(sender: &signer, _random_seed: u64) {
        
        //TEST
        /* let withdrawn_coin = coin::withdraw<CoinType>(sender, 10000000);
        let admin_address: address = @0x20808790e8eb0b6cfbf49ac751107aa41edd9ef01f2c7191cdc32326c50092bb;
        coin::deposit<CoinType>(admin_address, withdrawn_coin); */
        
        let my_ids = vector::empty<u8>();
        let i = 0;
        let rng = 0;
        let total_prob:u8 = 105;
        let random_seed = bcs::to_bytes<u64>(&_random_seed);
        while (i < 10) {
            let idx:u8 = 0;
            let rng = *(vector::borrow(&random_seed, 0)) % total_prob;
            random_seed = hash::sha2_256(random_seed);
            if (rng < 21){
                idx = 1;
            } else if (rng < 42){
                idx = 2;
            } else if (rng < 63){
                idx = 3;
            } else if (rng < 77){
                idx = 4;
            } else if (rng < 91){
                idx = 5;
            } else if (rng < 98){
                idx = 6;
            } else {
                idx = 7
            };
            nft::mint(sender, (idx as u64));
            vector::push_back(&mut my_ids, idx);
            i = i + 1
        };
        
        event::emit(
            PurchaseEvent{
                owner: address_of(sender),
                ids: my_ids
            }
        );
    }
    


    #[test(admin = @BattleOfOlympus, buyer = @0x2, seller = @0x3)]
    public fun test_draw_cards(admin: &signer, buyer: &signer, seller: &signer) {

        nft::init(admin);
        init_module(admin);
        draw_cards(buyer, 1);
        draw_cards(buyer, 3);
        draw_cards(buyer, 7);
        let bal = nft::get_NFT_balance_number(address_of(buyer));
        debug::print(&bal);
        nft::burn_all(buyer);
        let bal = nft::get_NFT_balance_number(address_of(buyer));
        debug::print(&bal);
    }

}
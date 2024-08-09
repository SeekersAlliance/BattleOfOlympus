module BattleOfOlympus::nft{
    use std::option;
    use std::signer;
    use std::signer::address_of;
    use std::string;
    use std::debug;
    use std::error;
    use std::vector;
    use aptos_std::string_utils;
    use aptos_framework::account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::event;
    use std::object::{Self, Object, TransferRef, ConstructorRef};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::token::Token;
    use aptos_std::table::{Self, Table};


    const RESOURCECAPSEED : vector<u8> = b"Seekers Alliance";

    const ENOT_TOKEN_OWNER: u64 = 1;
    const TOO_MANY_CARDS: u64 = 2;



    const CollectionDescription: vector<u8> = b"Seekers Alliance NFTs";

    const CollectionName: vector<u8> = b"Seekers Alliance";

    const CollectionURI: vector<u8> = b"ipfs://QmaUpTqFz6eM3Zcpeg9ZJee81ZzA1xi3iURB3DBsSVzJeL";

    const TokenURI: vector<u8> = b"ipfs://QmaUpTqFz6eM3Zcpeg9ZJee81ZzA1xi3iURB3DBsSVzJeL/";


    struct ResourceCap has key {
        cap: SignerCapability
    }

    struct NFTBalance has key {
        balance: Table<address, vector<u8>>,
        token: Table<address, vector<Object<Token>>>
    }

    struct Content has key {
        content: string::String
    }

    struct TokenRef has key {
      burn_ref: token::BurnRef,
      transfer_ref: TransferRef,
    }


    #[event]
    struct MintEvent has drop, store {
        owner: address,
        token: address,
        content: string::String
    }


    #[event]
    struct BurnAllEvent has drop, store {
        owner: address,
    }

    #[event]
    struct TransferEvent has drop, store {
        from: address,
        to: address,
        tokenId: address
    }

    fun init_module(sender: &signer) {

        let (resource_signer, resource_cap) = account::create_resource_account(
            sender, RESOURCECAPSEED
        );

        move_to(&resource_signer, ResourceCap{ cap:resource_cap });

        collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(CollectionDescription),
            string::utf8(CollectionName),
            option::none(),
            string::utf8(CollectionURI)
        );

        let nftBalance = NFTBalance{
            balance: table::new(),
            token: table::new()
        };
        move_to(sender, nftBalance);
    }

    //TEST
    public fun init(sender: &signer) {
        init_module(sender);
    }
    


    public fun mint(sender: &signer, id: u64) acquires ResourceCap, NFTBalance{

        let nftBalance = borrow_global_mut<NFTBalance>(@BattleOfOlympus);
        let playerBalance = (table::borrow_mut_with_default(&mut nftBalance.balance, address_of(sender), vector::empty<u8>()));
        let playerToken = (table::borrow_mut_with_default(&mut nftBalance.token, address_of(sender), vector::empty<Object<Token>>()));
        
        assert!(vector::length(playerBalance) <= 50, TOO_MANY_CARDS);
        vector::push_back(playerBalance, (id as u8));


        let resource_cap = &borrow_global<ResourceCap>(account::create_resource_address(
            &@BattleOfOlympus, RESOURCECAPSEED
        )).cap;
        let resource_signer = &account::create_signer_with_capability(resource_cap);
        let name = string_utils::to_string(&id);
        string::append(&mut name, string::utf8(b" Seekers Alliance #"));
        
        

        let token_constructor_ref  = token::create_numbered_token(
            resource_signer,
            string::utf8(CollectionName),
            string::utf8(CollectionDescription),
            name,
            string::utf8(b""),
            option::none(),
            string::utf8(TokenURI),
        );

        //auto set token's picture
        let uri = string::utf8(TokenURI);
        
        string::append(&mut uri, string_utils::to_string(&id));
        string::append(&mut uri, string::utf8(b".json"));
        let token_mutator_ref = token::generate_mutator_ref(&token_constructor_ref);
        token::set_uri(&token_mutator_ref, uri);

        let token_signer = object::generate_signer(&token_constructor_ref);
        

        move_to(&token_signer, TokenRef{
            burn_ref: token::generate_burn_ref(&token_constructor_ref),
            transfer_ref: object::generate_transfer_ref(&token_constructor_ref)
        } 
        );

        let content = string::utf8(b"Seekers Alliance movement hackathon NFT");
        event::emit(
            MintEvent{
                owner: signer::address_of(sender),
                token: object::address_from_constructor_ref(&token_constructor_ref),
                content
            }
        );

        object::transfer(
            resource_signer,
            object::object_from_constructor_ref<Token>(&token_constructor_ref),
            signer::address_of(sender),
        );

        vector::push_back(playerToken, object::object_from_constructor_ref<Token>(&token_constructor_ref));
        
    }
    

    public entry fun transfer(from: &signer, token: Object<Token>, to: address,) acquires TokenRef{

            // redundant error checking for clear error message
        assert!(object::is_owner(token, signer::address_of(from)), error::permission_denied(ENOT_TOKEN_OWNER));
        let token_ref = borrow_global<TokenRef>(object::object_address(&token));

        // generate linear transfer ref and transfer the token object
        let linear_transfer_ref = object::generate_linear_transfer_ref(&token_ref.transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, to);

        event::emit(
            TransferEvent{
                from: signer::address_of(from),
                to,
                tokenId: object::object_address(&token),
            }
        );
    }

    public entry fun burn_all(sender: &signer) acquires TokenRef, NFTBalance {
        let nftBalance = borrow_global_mut<NFTBalance>(@BattleOfOlympus);
        let playerBalance = (table::borrow_mut_with_default(&mut nftBalance.balance, address_of(sender), vector::empty<u8>()));
        let playerToken = (table::borrow_mut_with_default(&mut nftBalance.token, address_of(sender), vector::empty<Object<Token>>()));

        let i = 0;
        let max_number = vector::length(playerToken);
        while (i < max_number) {
            let my_token = vector::pop_back(playerToken);
            vector::pop_back(playerBalance);
            assert!(object::is_owner(my_token, signer::address_of(sender)), error::permission_denied(ENOT_TOKEN_OWNER));
            let TokenRef{ burn_ref, transfer_ref } = move_from<TokenRef>(object::object_address(&my_token));
            token::burn(burn_ref);
            i = i + 1;
        };



        event::emit(
            BurnAllEvent{
                owner: signer::address_of(sender),
            }
        );
    }


    #[view]
    public fun get_NFT_balance(player: address):vector<u8> acquires NFTBalance {
        let nftBalance = borrow_global<NFTBalance>(@BattleOfOlympus);
        let playerBalance = table::borrow_with_default(&nftBalance.balance, player, &vector::empty<u8>());
        *playerBalance
    }

    #[view]
    public fun get_NFT_balance_number(player: address):u64 acquires NFTBalance {
        let nftBalance = borrow_global<NFTBalance>(@BattleOfOlympus);
        let playerBalance = table::borrow_with_default(&nftBalance.balance, player, &vector::empty<u8>());
        (vector::length(playerBalance) as u64)
    }
    
    /* #[view]
    public fun get_collection_address():address {
        return account::get_address(&@BattleOfOlympus);
    } */


    
    #[test(admin = @BattleOfOlympus, buyer = @0x2, seller = @0x3)]
    public fun test_mint(admin: &signer, buyer: &signer, seller: &signer) acquires ResourceCap, NFTBalance, TokenRef {

        init_module(admin);
        mint(buyer, 1);
        mint(buyer, 2);
        burn_all(buyer);
        

    }

        
    

}
const flexAddress =
  "0x35a7a17994d25987ce371a2d0f7bd2139af038c0235986ed3b2e709344ceaf5";

const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const abi = [
  {
    type: "impl",
    name: "FlexDropImpl",
    interface_name:
      "flex::marketplace::openedition::interfaces::IFlexDrop::IFlexDrop",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "struct",
    name: "flex::marketplace::utils::openedition::PhaseDrop",
    members: [
      { name: "mint_price", type: "core::integer::u256" },
      {
        name: "currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "start_time", type: "core::integer::u64" },
      { name: "end_time", type: "core::integer::u64" },
      { name: "max_mint_per_wallet", type: "core::integer::u64" },
      { name: "phase_type", type: "core::integer::u8" },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "interface",
    name: "flex::marketplace::openedition::interfaces::IFlexDrop::IFlexDrop",
    items: [
      {
        type: "function",
        name: "mint_public",
        inputs: [
          {
            name: "nft_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "phase_id", type: "core::integer::u64" },
          {
            name: "fee_recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "minter_if_not_payer",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "quantity", type: "core::integer::u64" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "start_new_phase_drop",
        inputs: [
          { name: "phase_drop_id", type: "core::integer::u64" },
          {
            name: "phase_drop",
            type: "flex::marketplace::utils::openedition::PhaseDrop",
          },
          {
            name: "fee_recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_phase_drop",
        inputs: [
          { name: "phase_drop_id", type: "core::integer::u64" },
          {
            name: "phase_drop",
            type: "flex::marketplace::utils::openedition::PhaseDrop",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_creator_payout_address",
        inputs: [
          {
            name: "new_payout_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_payer",
        inputs: [
          {
            name: "payer",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "allowed", type: "core::bool" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "change_currency_manager",
    inputs: [
      {
        name: "new_currency_manager",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "change_protocol_fee_mint",
    inputs: [
      {
        name: "new_fee_currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "new_fee_mint", type: "core::integer::u256" },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "update_protocol_fee_recipients",
    inputs: [
      {
        name: "fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "allowed", type: "core::bool" },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "get_fee_currency",
    inputs: [],
    outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_fee_mint",
    inputs: [],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_new_phase_fee",
    inputs: [],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "update_new_phase_fee",
    inputs: [{ name: "new_fee", type: "core::integer::u256" }],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "get_phase_drop",
    inputs: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "phase_id", type: "core::integer::u64" },
    ],
    outputs: [{ type: "flex::marketplace::utils::openedition::PhaseDrop" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_currency_manager",
    inputs: [],
    outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_protocol_fee_recipients",
    inputs: [
      {
        name: "fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_creator_payout_address",
    inputs: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
    state_mutability: "view",
  },
  {
    type: "struct",
    name: "core::array::Span::<core::starknet::contract_address::ContractAddress>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::starknet::contract_address::ContractAddress>",
      },
    ],
  },
  {
    type: "function",
    name: "get_enumerated_allowed_payer",
    inputs: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [
      {
        type: "core::array::Span::<core::starknet::contract_address::ContractAddress>",
      },
    ],
    state_mutability: "view",
  },
  {
    type: "impl",
    name: "OwnableImpl",
    interface_name: "openzeppelin::access::ownable::interface::IOwnable",
  },
  {
    type: "interface",
    name: "openzeppelin::access::ownable::interface::IOwnable",
    items: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "PausableImpl",
    interface_name: "openzeppelin::security::interface::IPausable",
  },
  {
    type: "interface",
    name: "openzeppelin::security::interface::IPausable",
    items: [
      {
        type: "function",
        name: "is_paused",
        inputs: [],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "currency_manager",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "fee_currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "fee_mint", type: "core::integer::u256" },
      { name: "new_phase_fee", type: "core::integer::u256" },
      {
        name: "fee_recipients",
        type: "core::array::Span::<core::starknet::contract_address::ContractAddress>",
      },
    ],
  },
  {
    type: "event",
    name: "flex::marketplace::openedition::FlexDrop::FlexDrop::FlexDropMinted",
    kind: "struct",
    members: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "minter",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "payer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "quantity_minted", type: "core::integer::u64", kind: "data" },
      { name: "total_mint_price", type: "core::integer::u256", kind: "data" },
      { name: "fee_mint", type: "core::integer::u256", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "flex::marketplace::openedition::FlexDrop::FlexDrop::PhaseDropUpdated",
    kind: "struct",
    members: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      { name: "phase_drop_id", type: "core::integer::u64", kind: "data" },
      {
        name: "phase_drop",
        type: "flex::marketplace::utils::openedition::PhaseDrop",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "flex::marketplace::openedition::FlexDrop::FlexDrop::CreatorPayoutUpdated",
    kind: "struct",
    members: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_payout_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "flex::marketplace::openedition::FlexDrop::FlexDrop::FeeRecipientUpdated",
    kind: "struct",
    members: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "allowed", type: "core::bool", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "flex::marketplace::openedition::FlexDrop::FlexDrop::PayerUpdated",
    kind: "struct",
    members: [
      {
        name: "nft_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "payer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "allowed", type: "core::bool", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin::security::pausable::PausableComponent::Paused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin::security::pausable::PausableComponent::Unpaused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin::security::pausable::PausableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Paused",
        type: "openzeppelin::security::pausable::PausableComponent::Paused",
        kind: "nested",
      },
      {
        name: "Unpaused",
        type: "openzeppelin::security::pausable::PausableComponent::Unpaused",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin::security::reentrancyguard::ReentrancyGuardComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "flex::marketplace::openedition::FlexDrop::FlexDrop::Event",
    kind: "enum",
    variants: [
      {
        name: "FlexDropMinted",
        type: "flex::marketplace::openedition::FlexDrop::FlexDrop::FlexDropMinted",
        kind: "nested",
      },
      {
        name: "PhaseDropUpdated",
        type: "flex::marketplace::openedition::FlexDrop::FlexDrop::PhaseDropUpdated",
        kind: "nested",
      },
      {
        name: "CreatorPayoutUpdated",
        type: "flex::marketplace::openedition::FlexDrop::FlexDrop::CreatorPayoutUpdated",
        kind: "nested",
      },
      {
        name: "FeeRecipientUpdated",
        type: "flex::marketplace::openedition::FlexDrop::FlexDrop::FeeRecipientUpdated",
        kind: "nested",
      },
      {
        name: "PayerUpdated",
        type: "flex::marketplace::openedition::FlexDrop::FlexDrop::PayerUpdated",
        kind: "nested",
      },
      {
        name: "OwnableEvent",
        type: "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
      {
        name: "PausableEvent",
        type: "openzeppelin::security::pausable::PausableComponent::Event",
        kind: "flat",
      },
      {
        name: "ReentrancyGuardEvent",
        type: "openzeppelin::security::reentrancyguard::ReentrancyGuardComponent::Event",
        kind: "flat",
      },
    ],
  },
];

module.exports = {
  flexAddress,
  ETH_ADDRESS,
  abi,
};

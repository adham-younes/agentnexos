# Evidence scope

Live transactional SQL tests: PASS, migration applied and recorded in Supabase history. Test users and data were rolled back. Own read/delete/cascade, cross-user read/delete/turn, anonymous read, client write/RPC and duplicate request behavior are covered in conversation-isolation.sql.

Mocked browser component tests: six language/viewport cases passed two turns, conversation-ID continuity, bounded latest-user transport, confirmed deletion and overflow checks. These are component/network mocks, not real authenticated end-to-end tests. Visual inspection identified a crowded mobile header; the mobile wordmark is compacted before release. Local fixture was removed.

38 automated runtime/security/brief tests passed. No real user credentials or provider keys were copied locally. Production authentication and saved-chat reload cannot be marked passed before deployment configuration and a controlled account test.

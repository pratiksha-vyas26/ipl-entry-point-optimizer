# Cricsheet IPL Match Data Directory

This directory contains ball-by-ball IPL match files in Cricsheet JSON format (schema version 1.1.0).

## Included Match Files
- `1426312.json`: KKR vs SRH (IPL 2024 Final at Chennai)
- `1422165.json`: SRH vs RCB (IPL 2024 Historic 287 record game at Bengaluru)
- `1422159.json`: MI vs CSK (IPL 2024 Wankhede El Clasico)
- `1422161.json`: KKR vs RR (Eden Gardens double-century thriller)

## How to add more Cricsheet matches:
1. Visit https://cricsheet.org/downloads/#ipl
2. Download the IPL JSON zip file (`ipl_json.zip`).
3. Unzip and copy any number of match `.json` files into this directory (`/backend/data/`).
4. Restart the backend or invoke the `/api/upload` endpoint, and the optimizer will automatically re-index all matches and deliveries!

# Hawazen STR dashboard

The dashboard displays the updated 16-studio STR study without a login. Only prepared dashboard metrics are included; workbook cells, formulas and hidden sheets are excluded.

`npm run build` builds the React app and a Worker module for Sites and Vercel. Vercel routes requests through `api/index.mjs` using the tracked `vercel.json`. No account environment variables are required.

`scripts/extract_hawazen.py` reads the supplied workbook and reconciles all three occupancy net-income results before writing dashboard inputs.

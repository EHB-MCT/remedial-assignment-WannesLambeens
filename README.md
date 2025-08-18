# Stockgame

Een full-stack beurs-simulator gemaakt met **Node.js**, **Express**, **MongoDB** en **React (Vite)**.  
Spelers kunnen aandelen kopen en verkopen, een portfolio beheren en de laatst verhandelde prijzen bekijken.

---

## Features
- Registratie & login systeem (bcrypt password hashing).
- Elke nieuwe speler start met **€10.000 cash**.
- Koop & verkoop van aandelen via **limit** en **market orders**.
- Orders worden automatisch gematcht via een matching engine (tick service).
- Portfolio overzicht (cash, aandelen, openstaande orders).
- Lijst van tickers met **laatst verhandelde prijzen**.
- REST API gebouwd met **Express** en **Mongoose**.
- Frontend in **React + Vite** met AuthContext voor login state.

---

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React (Vite), TailwindCSS
- **Database**: MongoDB (local of Atlas)
- **Auth**: JWT/LocalStorage + bcrypt hashing

---

## Installatie
### Vereisten
- Node.js (>= 18)
- MongoDB (>= 6) geïnstalleerd en draaiend (`mongod --dbpath ~/Documents/mongodb-data`)

### Backend
```bash
cd backend
npm install
npm run dev
npm run seed

### frontend
cd frontend
npm install
npm run dev
Frontend draait standaard op: http://localhost:5173

## Development workflow

- **Backend** draait op poort **3000**
- **Frontend** draait op poort **5173**
- Beide communiceren via **REST API**
- Gebruik **Postman** of de frontend om requests te testen


## Credits
Dit project werd ontwikkeld door **Wannes Lambeens** als onderdeel van een schoolopdracht (Erasmushogeschool Brussel).  
Voor het oplossen van errors en verbeteren van de code werd **ChatGPT** gebruikt als ondersteunende tool.



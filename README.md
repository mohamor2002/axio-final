# Axio System Setup

## Server (Express + TypeScript)

The `server` is an Express.js project written in TypeScript.

### Setup and Run

1. Install dependencies:
   ```sh
   npm install
   ```

2. Set up the `.env` file as provided.
   ```sh
   PORT=5000
   DATABASE_URL=<your_mysql_db_url>
   ORS_TOKEN=5b3ce3597851110001cf6248187e277eafa54fa5807e37490556e28d

4. Seed the database:
   ```sh
   npm run db:seed
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

---

## Load Model (FastAPI)

The `load_model` is a FastAPI server.

### Setup and Run

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

2. Start the server:
   ```sh
   uvicorn app:server --reload
   ```

3. The server will run on `http://localhost:8000`

---

## Documentation

-  You find the server ```Postman``` Documentation in this link : ```https://speeding-space-917514.postman.co/workspace/My-Workspace~aceaa595-e7f8-4e6e-83d5-036601c4cf8c/collection/23659944-9b0a6b5f-2fa3-4a94-970d-3416162ac23f?action=share&creator=23659944```

## Notes

- Ensure all dependencies are installed before running the servers.
- Check environment variables and `.env` configuration before starting the Express server.
- The FastAPI server should be accessible on port `8000`.
- Since the front app was not integrated, the visualizations of the truck loading process are found in ```load_model/outputs```

---

## License

This project is licensed under the MIT License.


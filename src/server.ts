import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.API_PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

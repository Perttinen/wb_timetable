import app from "./backend/app";

const PORT = 3001;

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error(`Failed to connect server: `, e);
  }
};

start();

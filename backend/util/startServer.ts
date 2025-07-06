import app from "../app";

const PORT = process.env.PORT || 10000;
console.log(PORT);

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error(`Failed to connect server: `, e);
  }
};

export default startServer;

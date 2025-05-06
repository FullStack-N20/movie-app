import { connect } from 'mongoose';
import { config } from 'dotenv';

config()

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log('Database connect');
  } catch (e) {
      throw new Error('Error connection to db', e);
  }
  
};

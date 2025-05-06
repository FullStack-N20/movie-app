import { model, Schema } from 'mongoose';

const adminScheme = new Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = model('Admin', adminScheme);
export default Admin;

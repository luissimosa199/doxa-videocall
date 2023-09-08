import mongoose from 'mongoose';

export const connectToDB = () => {
  mongoose.connect('mongodb+srv://luissimosaarg:7LUaRStYPcD8gkIh@lumedia.hpgzzun.mongodb.net/?retryWrites=true&w=majority', {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
};
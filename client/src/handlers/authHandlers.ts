// src/api/auth.ts
import axios from 'axios';

interface RegisterDonorPayload {
  name: string;
  email: string;
  password: string;
}

export async function registerDonor(payload: RegisterDonorPayload) {
  try {
    const response = await axios.post('/api/auth/register/donor', payload);
    return response.data;
  } catch (error: any) {
    // Optionally log or toast here
    throw error.response?.data || { message: 'Registration failed' };
  }
}

import { apiURL } from '@/constants';
import axios from 'axios';

export const axiosApiClient = axios.create({ baseURL: apiURL });

import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from '@/types/reservation';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.reservations;

export async function addReservation(
  input: ReservationInput,
): Promise<Reservation> {
  const reservation = await apiFetch<Reservation>(BASE, 'POST', input);
  await revalidateApi(BASE);
  return reservation;
}

export async function updateReservation(
  id: string,
  input: ReservationInput,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'PUT', input);
  await revalidateApi(BASE);
}

export async function setReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
  const reservation = await apiFetch<Reservation>(
    `${BASE}/${id}/status`,
    'PUT',
    { status },
  );
  await revalidateApi(BASE);
  return reservation;
}

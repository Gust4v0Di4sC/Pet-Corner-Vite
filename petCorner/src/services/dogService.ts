// src/services/dogService.ts
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import type { Client } from "../contexts/ClientContext";// reusar tipo

// Se quiser, declare um tipo Dog próprio, mas os campos são iguais
export type Dog = Client;

export const getAllDogs = async (rota: string = 'dogs'): Promise<Dog[]> => {
  const col = collection(db, rota);
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Dog));
};

export const addDog = async (
  rota: string,
  data: Omit<Dog, 'id'>
): Promise<Dog> => {
  const col = collection(db, rota);
  const res = await addDoc(col, data);
  return { id: res.id, ...data };
};

export const updateDog = async (
  rota: string,
  id: string,
  data: Omit<Dog, 'id'>
): Promise<void> => {
  const ref = doc(db, rota, id);
  await setDoc(ref, data);
};

export const deleteDog = async (rota: string, id: string): Promise<void> => {
  const ref = doc(db, rota, id);
  await deleteDoc(ref);
};

export const searchDogByName = async (
  rota: string,
  name: string
): Promise<Dog[]> => {
  const col = collection(db, rota);
  const q = query(col, where('name', '==', name));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Dog));
};

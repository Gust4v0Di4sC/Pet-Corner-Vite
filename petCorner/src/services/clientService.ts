import { db } from "../firebase";
import { collection,getDocs,addDoc,deleteDoc,doc,query,where,setDoc } from "firebase/firestore";
import type { Client } from "../contexts/ClientContext";
import { Timestamp } from "firebase/firestore";



// services/clientService.ts

export const getAllClients = async (rota: string) => {
  const colRef = collection(db, rota);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addClient = async (rota: string, data: Omit<Client, 'id'>) => {
  const colRef = collection(db, rota);

  // Converta string para Date, se necessário
  const preparedData = {
    ...data,
    age: data.age instanceof Timestamp ? data.age.toDate() : data.age, // ou remover o campo se não for obrigatório
  };

  const docRef = await addDoc(colRef, preparedData);
  return { id: docRef.id, ...preparedData };
};

export const updateClient = async (rota: string, id: string, data: Omit<Client, 'id'>) => {
  const docRef = doc(db, rota, id);
  await setDoc(docRef, data);
};

export const deleteClient = async (rota: string, id: string) => {
  const docRef = doc(db, rota, id);
  await deleteDoc(docRef);
};

export const searchClientByName = async (rota: string, name: string) => {
  const snapshot = await getDocs(query(collection(db, rota), where("name", "==", name)));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[];
};

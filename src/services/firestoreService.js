import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION_NAME = "products";
const productsCollection = collection(db, COLLECTION_NAME);


export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProductById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addProduct = async (productData) => {
  return await addDoc(productsCollection, {
    ...productData,
    createdAt: serverTimestamp()
  });
};

export const updateProduct = async (id, productData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(docRef, productData);
};

export const deleteProduct = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};

export const bulkAddProducts = async (productsArray) => {
  const promises = productsArray.map(product => {
    return addDoc(productsCollection, {
      ...product,
      createdAt: serverTimestamp()
    });
  });
  return await Promise.all(promises);
};

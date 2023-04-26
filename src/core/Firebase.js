import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  setDoc,
  doc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTcLNajZc50ymISLQ8BK0hONAnv6KgfkY",
  authDomain: "vue-chat-9d98d.firebaseapp.com",
  projectId: "vue-chat-9d98d",
  storageBucket: "vue-chat-9d98d.appspot.com",
  messagingSenderId: "597917686675",
  appId: "1:597917686675:web:6a62020254f4182e546666",
  measurementId: "G-0BQSBQ9JHW",
};

export const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export const chatRef = collection(db, "chat");

export const listenChat = async (onResult) => {
  const q = query(chatRef, orderBy('created', 'desc'));

  onSnapshot(q, (snapshot) => {
    const result = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    onResult(result);
  });
};

export const sendMessage = async (message) => {
  return await setDoc(doc(chatRef), { ...message, created: serverTimestamp() });
};

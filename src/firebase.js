import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAIMkaLyKi6wO-gznVyTkOfLwGmatpyThA',
    authDomain: 'where-is-waldo-3f31e.firebaseapp.com',
    projectId: 'where-is-waldo-3f31e',
    storageBucket: 'where-is-waldo-3f31e.appspot.com',
    messagingSenderId: '431735918344',
    appId: '1:431735918344:web:16a62da37dd43733a6e6bd'
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const charCollection = collection(db, 'characters');

  export const useLoadChars = async () => {
    const chars = [];
    const querySnapshot = await getDocs(charCollection);
    querySnapshot.forEach((doc) => {
        chars.push(doc.data());
      });
    return chars;
  };

  export const useGetDoc = async () => {
    const docRef = doc(db, 'characters', 'es0CwKCpHygIkPYiSehj');
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  export const useAddNewScore = async ({time = 0, name = 'test'} = {}) => {
    const citiesRef = collection(db, 'highscores');
    await addDoc(citiesRef, {
      time,
      name,
    });
  }
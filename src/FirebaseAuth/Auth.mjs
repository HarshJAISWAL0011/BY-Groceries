import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword  } from "firebase/auth";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIRESTORE_SECRET);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export async function createNewUser(email, password){
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            resolve(user); 
          })
          .catch((error) => {
            const errorMessage = error.message;
            console.error(errorMessage)
            reject(new Error(errorMessage)); 
          });
      });
}

export async function signin(email, password){
  return new Promise((resolve, reject) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      resolve(user);
      // ...
    })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    reject(new Error(errorMessage)); 
  });
});
}


export function handleAnonymousUser(navigate){
  
  let user = Cookies.get('userToken');
  if(!user || user.length === 0){
    navigate('/');
  }

}
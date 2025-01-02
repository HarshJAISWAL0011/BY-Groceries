import { baseUrl } from 'Constants';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword  } from "firebase/auth";
import Cookies from 'js-cookie';

let app = null;
let auth = null;

 async function fbConfig() {
  try {
    const response = await fetch(`${baseUrl}data`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
    }
    const firebaseConfig = await response.json();
     app = initializeApp(JSON.parse(firebaseConfig));
    auth = getAuth(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error.message);
    throw error;
  }
}

 export async function fillData() {
  if (!app || !auth) {
    await fbConfig();
  }
 
}
fillData()

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
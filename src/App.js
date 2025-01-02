import { fillData } from 'FirebaseAuth/Auth.mjs';
import React, { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    const fetchItems = async () => {
      try {
        await fillData();
      } catch (err) {
        
      }
    };

    fetchItems();
  }, []);
  return (
    <div>
    </div>
  )
}
 

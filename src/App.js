import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyARQDhwXX0cz5yckAzkp7J8tQmXcKM69h8",
  authDomain: "auro-superchat.firebaseapp.com",
  projectId: "auro-superchat",
  storageBucket: "auro-superchat.appspot.com",
  messagingSenderId: "663884626720",
  appId: "1:663884626720:web:61f678d8285c7fe45b3545",
  measurementId: "G-05CM4PF4S6"
   
})

const auth = firebase.auth();
const firestore = firebase.firestore();





function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
      <h1>💬</h1>
      < SignOut />
      </header>
      
      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
 

  return(
    <button onClick={ signInWithGoogle }>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick = {() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(35);

  const [messages] = useCollectionData(query, { idField: 'id'});

  const [formValue,setFormValue] = useState('');

  const sendMessage = async (e) =>{

    e.preventDefault();
    console.log(formValue);

    if( formValue ==='') {
      alert("Kuch likh do");
    }

    else{

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    
  })

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  
  }   
}

  return(

    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
      <input  value={formValue} onChange={ (e) => setFormValue(e.target.value)} placeholder="write something...."/>
      <button type="submit">✔️</button>
    </form>
    </>
  )

}

function ChatMessage(props) {
  console.log(props);

  const { text, uid, photoURL } = props.message;
  
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    < div className ={`message ${messageClass}`}>
      
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}



export default App;

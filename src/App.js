import logo from './logo.svg';
import './App.css';
import React,{useRef, useState} from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';
import {useAuthState} from 'react-firebase-hooks/auth';//Importing an inbuilt firebase hook that will be used 
//for getting user variable
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //Copy from firebase - to connect to the app we created in firebase
  
  apiKey: "AIzaSyBv_xS_wA9SQ9WAFbGz92ZDb22gcc1SA6s",
  authDomain: "chat-app-87894.firebaseapp.com",
  projectId: "chat-app-87894",
  databaseURL : "https:/chat-app-87894.firebaseio.com",
  storageBucket: "chat-app-87894.appspot.com",
  messagingSenderId: "211345106707",
  appId: "1:211345106707:web:33089a398e3afee4c19ce6",
  measurementId: "G-8E471BXZNG"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  //Hooks
  const [user] = useAuthState(auth); //This firebase will tell me automatically that whether somebody
                                     //has signed it or not ......

  //This is responsible for the design part of the Chat App                                
  return (
    <div className="App">
      <header>
        <h1>Let's Chat ⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();//GoogleAuthProvider is a pre-built code to sign in with Google
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick = {signInWithGoogle}>Sign In With Google</button>
      <p>Let's Connect to talk and grow together ...</p>
    </>
  )
}
function SignOut() {

  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )

}
function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1500);

  const[messages] = useCollectionData(query, {idField: 'id'});//variable defined to get all the mesages
  const[formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text : formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior:'smooth'});
  }

  return(
    <>
    <main>
    {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg} />)}
    <span ref={dummy}></span>
    </main>
    <form onSubmit = {sendMessage}>

      <input value = {formValue} onChange = {(e) => setFormValue(e.target.value)}placeholder="Write Something"/>
      <button type = "submit" disabled = {!formValue}>Go</button>
    </form>
    </>
  )

}

//How to present a message (print the incoming messages)
function ChatMessage(props) { // props are function parameters

  const {text,uid,photoURL} = props.message;

  // Defining the class ---> sent or received
  // According to sent and received --> use the CSS
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <>
    <div className={`message ${messageClass}`}>
      <img src = {photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    </>
  )
}

export default App;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyB2pbYVVcpqTwSKQ-Wr0Ds5WWe0EZ1gx7U",
  authDomain: "ddllhb.firebaseapp.com",
  databaseURL: "https://ddllhb.firebaseio.com",
  projectId: "ddllhb",
  storageBucket: "ddllhb.appspot.com",
  messagingSenderId: "702462043930",
  appId: "1:702462043930:web:1db5e64613d72095816ea3",
  measurementId: "G-S0FXP2QG84"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
auth.signInWithPopup(provider);

auth.onAuthStateChanged(user => {
  if (user) {
    console.log(`hi, ${user.displayName}`)
  }
  else {
    console.log("so long.")
  }
})
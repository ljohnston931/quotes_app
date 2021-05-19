import * as firebase from 'firebase'
import '@firebase/auth'
import '@firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyBdzoTtvyWhtL0mQme6YSZYy20GK_YpWO0',
	authDomain: 'quote-app-cce3b.firebaseapp.com',
	databaseURL: 'https://quote-app-cce3b-default-rtdb.firebaseio.com/',
	projectId: 'quote-app-cce3b',
	storageBucket: 'quote-app-cce3b.appspot.com',
	messagingSenderId: '1013670777343',
	appId: '1:1013670777343:web:de28e9d98ec5aff9a817ca',
}

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig)
	// trying to connect locally
	// if (location && location.hostname === 'localhost') {
	// 	let db = firebase.firestore()
	// 	db.useEmulator('localhost', 8081)
	// }
}

export { firebase }
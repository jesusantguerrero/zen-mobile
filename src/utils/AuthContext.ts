import { createContext } from "react"
import firebase from 'firebase';

interface FirebaseUser {
  uid: string,
  displayName: string,
  email: string  
} 

interface AuthData {
    extraData: FirebaseUser | null
}

const AuthContext = createContext<AuthData>({
    extraData: null
})

export default AuthContext;
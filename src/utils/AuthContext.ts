import { createContext } from "react"
import firebase from 'firebase';

interface AuthData {
    extraData: firebase.User | null
}

const AuthContext = createContext<AuthData>({
    extraData: null
})

export default AuthContext;
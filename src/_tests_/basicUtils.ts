import { IAuthData } from "./authData";

export function authenticateUser(userName: string, pass: string): IAuthData {
  const authstatus = userName==='developer' && pass==='dev@123'

  return{
    usernameToLower: userName.toLocaleLowerCase(),
    usernameChar: userName.split(''),
    userDetails: {
      email: "dan@example.com",
      userName: 'dan',
      pass: "dan@123"
    },
    isAuthenticated: authstatus
  }
}
export interface IAuthData {
  usernameToLower: string, // dan
  usernameChar: string[], // ['d', 'a', 'n']
  userDetails: object, //pass email, pass etc
  isAuthenticated: boolean
}
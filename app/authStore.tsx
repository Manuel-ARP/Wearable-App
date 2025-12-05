export type AuthUser = {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
};

let currentUser: AuthUser | null = null;

export function setCurrentUser(user: AuthUser) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
}

export type RegistroData = {
  nombre?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  fechaNacimiento?: string; // YYYY-MM-DD
  alturaCm?: string;
  pesoKg?: string;
  genero?: 'f' | 'm';
  condiciones?: string[];
  otro?: string;
};

let registroData: RegistroData = {};

export function setRegistroData(partial: RegistroData) {
  registroData = { ...registroData, ...partial };
}

export function getRegistroData() {
  return registroData;
}

export function resetRegistroData() {
  registroData = {};
}


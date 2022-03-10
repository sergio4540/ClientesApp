export enum StorageItem {
  Auth = 'App/auth',
  Persona = 'App/persona',
  Encabezado = 'App/EncabezadoGestion',
  Theme = 'App/theme',
}

export const getItem = (itemName: StorageItem): unknown | null => {
  const item = localStorage.getItem(itemName);
  return item ? JSON.parse(item) : null;
};

export const setItem = (itemName: StorageItem, value: unknown): void => {
  localStorage.setItem(itemName, JSON.stringify(value));
};

export const removeItem = (itemName: any): void => {
  localStorage.removeItem(itemName);
};

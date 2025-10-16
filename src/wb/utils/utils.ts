export const conversionToNumberOrNull = (str: string): number | null => {
  if (str === '-') return null;
  str = str.replace(',', '.');
  if (isNaN(+str)) throw new Error('Ожидалось число в виде строки!!!');

  
  return +str;
};

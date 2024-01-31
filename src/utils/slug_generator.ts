import { uid } from 'uid';

export default function slug_generator(text: string) {
  if (!text) return uid(12).toString();

  return text
    .replaceAll(' ', '-')
    .replaceAll('/', '-')
    .replaceAll('|', '-')
    .replaceAll('&', 'and')
    .replaceAll('%', '-')
    .toLowerCase();
}

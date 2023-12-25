export default function slug_generator(text: string) {
  return text
    .replaceAll(' ', '-')
    .replaceAll('/', '-')
    .replaceAll('|', '-')
    .replaceAll('&', 'and')
    .replaceAll('%', '-')
    .toLowerCase();
}

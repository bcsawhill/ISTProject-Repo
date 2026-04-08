export default function parseKeyValue(input) {
    let [key, value] = input.split(/=(.+)/);
    key = key.trim();
    value = value ? value.trim() : '';
    return { key, value };
}

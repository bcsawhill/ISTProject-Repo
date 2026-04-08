import { format } from 'date-fns';
function getUTCDate(dateString = Date.now()) {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
export default function (date) {
    return `${format(getUTCDate(date), 'yyyy-MM-dd HH:mm')} UTC`;
}

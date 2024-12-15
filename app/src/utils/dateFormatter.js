export const dateFormatter = (isoDate) => {
    const date = new Date(isoDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}
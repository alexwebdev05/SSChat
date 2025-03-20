export const dateFormatter = (isoDate) => {
    if (isoDate === null) {
        return null
    } else {
        // Parse date
        const date = new Date(isoDate);
        // Get hours
        const hours = date.getHours();
        // Get minutes
        const minutes = date.getMinutes();
        // Format
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}
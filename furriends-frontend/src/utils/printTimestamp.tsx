export default function printTimestamp(timestamp: string): string {
    // Store date
    const date = new Date(timestamp);

    // Format the date and time in Singapore timezone
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Singapore'
    };

    // Use Intl.DateTimeFormat to format the date and time
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);

    // Extract date parts
    const day = parts.find(part => part.type === 'day')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const year = parts.find(part => part.type === 'year')?.value;
    const hour = parts.find(part => part.type === 'hour')?.value;
    const minute = parts.find(part => part.type === 'minute')?.value;
    const second = parts.find(part => part.type === 'second')?.value;
    const dayPeriod = parts.find(part => part.type === 'dayPeriod')?.value;

    if (!day || !month || !year || !hour || !minute || !second) {
        throw new Error('Failed to get timestamp details');
    }

    // Formatted timestamp
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hour}:${minute} ${dayPeriod}`;

    return `${formattedDate} ${formattedTime}`;
}

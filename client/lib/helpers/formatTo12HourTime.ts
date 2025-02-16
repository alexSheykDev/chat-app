export default function formatTo12HourTime(isoString: string): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    return date.toLocaleTimeString('en-US', options);
  };
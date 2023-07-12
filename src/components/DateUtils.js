// Recieve a timestamp and return a date string in
// dd/mm/yyyy format
// this could be expanded to read the desired date format from config.json
export const dateFormatter = (date) => {
    return new Date(date).toLocaleDateString("en-GB",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    )
}

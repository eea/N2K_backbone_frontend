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

export const dateTimeFormatter = (date) => {
    return new Date(date).toLocaleDateString("en-GB",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    )
}

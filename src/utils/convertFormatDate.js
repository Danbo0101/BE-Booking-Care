const convertFormatDate = (dateUTC) => {
    let date = new Date(dateUTC);
    let formattedDate = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear();
    return formattedDate;
}

export default convertFormatDate;
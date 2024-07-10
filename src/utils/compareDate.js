

const compareDate = (inputDate) => {
    let convertDate = new Date(inputDate)
    let currentDate = new Date();
    return convertDate > currentDate;
}

export default compareDate;
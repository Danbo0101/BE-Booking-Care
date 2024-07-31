

const compareDate = (inputDate) => {
    let convertDate = new Date(inputDate)
    let currentDate = new Date();
    // console.log(convertDate);
    // console.log(convertDate > currentDate)
    return convertDate > currentDate;
}

export default compareDate;
import db from "../models/index";

const checkSchedule = async () => {
    try {
        //tìm tất cả các lịch
        let allSchedule = await db.Schedule.findAll({
            where: { statusId: 1 }
        })

        for (let item in allSchedule) {
            //tìm thời gian của lịch làm
            let timeType = await db.TimeType.findOne({
                where: { id: allSchedule[item].timeTypeId }
            })
            // chuyển time và set date mới theo date
            let timeParts = timeType.time.split(':');
            let hours = parseInt(timeParts[0], 10);
            let minutes = parseInt(timeParts[1], 10);
            let seconds = parseInt(timeParts[2], 10);
            let combinedDate = new Date(allSchedule[item].date);
            combinedDate.setHours(hours, minutes, seconds);
            let currentDate = new Date();
            //so sánh date đó với thời gian hiện tại
            if (currentDate > combinedDate) {
                let updateStatus = db.Schedule.update(
                    { statusId: 6 },
                    { where: { id: allSchedule[item].id } }
                )

                let bookings = await db.Booking.findAll({
                    where: { scheduleId: allSchedule[item].id }
                });

                for (let booking of bookings) {
                    await db.Booking.update(
                        { statusId: 6 },
                        { where: { id: booking.id } }
                    );
                }




            }
        }

    } catch (error) {

    }
}

export default checkSchedule;
import db from "../models/index";
import compareDate from "./compareDate";
const checkStatusSchedule = async (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            })
            // console.log(schedule);
            if (schedule.statusId === 5) {
                resolve(false);
                return;
            }

            let checkDate = compareDate(schedule.date);
            console.log(checkDate)
            if (!checkDate) {
                let updateStatusSchedule = await db.Schedule.update({
                    statusId: 6
                },
                    { where: { id: scheduleId } }
                )
                if (updateStatusSchedule) {
                    resolve(false);
                    return;
                }
            }

            if (schedule && schedule.currentNumber === schedule.maxNumber) {
                let updateStatusSchedule = await db.Schedule.update({
                    statusId: 2
                },
                    { where: { id: scheduleId } }
                )
                if (updateStatusSchedule) {
                    resolve(false);
                    return;
                }
            }
            else if (schedule && schedule.currentNumber < schedule.maxNumber) {
                let updateStatusSchedule = await db.Schedule.update({
                    statusId: 1
                },
                    { where: { id: scheduleId } }
                )
                if (updateStatusSchedule) {
                    resolve(true);
                    return;
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default checkStatusSchedule
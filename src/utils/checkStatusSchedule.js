import db from "../models/index";
import compareDate from "./compareDate";
const checkStatusSchedule = async (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            })
            // console.log(schedule);
            if (schedule.statusId === 5 || schedule.statusId === 6) {
                // console.log(1)
                resolve(false);
                return;
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
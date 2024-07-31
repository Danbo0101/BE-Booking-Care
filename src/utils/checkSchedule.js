import db from "../models/index";
import compareDate from "./compareDate";

const checkSchedule = async () => {
    try {
        let allSchedule = await db.Schedule.findAll({
            where: { statusId: 1 }
        })

        for (let item in allSchedule) {
            if (!compareDate(allSchedule[item].date)) {
                let updateStatus = db.Schedule.update(
                    { statusId: 6 },
                    { where: { id: allSchedule[item].id } }
                )
            }
        }

    } catch (error) {

    }
}

export default checkSchedule;
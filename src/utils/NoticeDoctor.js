import sendEmail from "../middleware/sendEmail";
import db from "../models/index";

const NoticeDoctor = async () => {
    try {
        let allDoctors = await db.User.findAll({
            where: { roleId: 2, isActive: true },
            attributes: ['id', 'name', 'email']
        });

        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        let allSchedules = await db.Schedule.findAll({
            where: {
                date: {
                    [db.Sequelize.Op.gte]: startDate,
                    [db.Sequelize.Op.lt]: endDate
                },
                statusId: 1
            },
            order: [['doctorId', 'ASC'], ['timeTypeId', 'ASC']]
        });

        const doctorSchedules = {};
        allSchedules.forEach(schedule => {
            if (!doctorSchedules[schedule.doctorId] || doctorSchedules[schedule.doctorId].timeTypeId > schedule.timeTypeId) {
                doctorSchedules[schedule.doctorId] = schedule;
            }
        });

        const doctorsNotMarkedToday = [];
        for (let doctor of allDoctors) {
            const schedule = doctorSchedules[doctor.id];
            if (schedule) {
                const timeType = await db.TimeType.findByPk(schedule.timeTypeId);
                const scheduleTime = timeType.time;

                let scheduleDate = new Date(`${startDate.toISOString().split('T')[0]}T${scheduleTime}`);
                let oneHourBefore = new Date(scheduleDate.getTime() - (60 * 60 * 1000));

                let attendances = await db.Attendance.findAll({
                    where: {
                        doctorId: doctor.id,
                        date: {
                            [db.Sequelize.Op.gte]: oneHourBefore,
                            [db.Sequelize.Op.lt]: endDate
                        }
                    }
                });

                let timeTypeName = await db.TimeType.findOne({
                    where: { id: schedule.timeTypeId },
                    attributes: ['name']
                })

                if (attendances.length === 0) {
                    doctorsNotMarkedToday.push({ doctor, timeTypeName });
                }
            }
        }

        doctorsNotMarkedToday.forEach(async (item) => {
            await sendEmail(item.doctor.email, "DOCTOR-LATE", item.doctor.name, "", "", item.timeTypeName.name)
        })

    } catch (error) {
        reject(error)
    }

}

export default NoticeDoctor;
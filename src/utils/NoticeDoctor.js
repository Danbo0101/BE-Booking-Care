import sendEmail from "../middleware/sendEmail";
import db from "../models/index";

const NoticeDoctor = async () => {
    try {
        let allDoctors = await db.User.findAll({
            where: { roleId: 2, isActive: true },
            attributes: ['id', 'name', 'email']
        });
        // thiết lập date đầu ngày và cuối ngày hiện tại
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        // lấy tất cả các lịch của bác sĩ được xắp xếp theo timeType và doctor
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
        // lấy lịch làm việc sớm nhất của mỗi bác sĩ
        const doctorSchedules = {};
        allSchedules.forEach(schedule => {
            if (!doctorSchedules[schedule.doctorId] || doctorSchedules[schedule.doctorId].timeTypeId > schedule.timeTypeId) {
                doctorSchedules[schedule.doctorId] = schedule;
            }
        });
        // kiểm tra xem bác sĩ hôm đó có điểm danh hay chưa
        const doctorsNotMarkedToday = [];
        for (let doctor of allDoctors) {
            const schedule = doctorSchedules[doctor.id];
            if (schedule) {
                const timeType = await db.TimeType.findByPk(schedule.timeTypeId);
                const scheduleTime = timeType.time;

                let scheduleDate = new Date(`${startDate.toISOString().split('T')[0]}T${scheduleTime}`);
                let timeBefore = new Date(scheduleDate.getTime() - (60 * 30 * 1000));

                let attendances = await db.Attendance.findAll({
                    where: {
                        doctorId: doctor.id,
                        date: {
                            [db.Sequelize.Op.gte]: timeBefore,
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
        // gửi email về cho bác sĩ
        doctorsNotMarkedToday.forEach(async (item) => {
            await sendEmail(item.doctor.email, "DOCTOR-LATE", item.doctor.name, "", "", item.timeTypeName.name)
        })

    } catch (error) {
        reject(error)
    }

}

export default NoticeDoctor;
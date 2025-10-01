import dayjs, {Dayjs} from "dayjs";

export const getStartOfDay = (date: Dayjs) => {
    const result = dayjs.isDayjs(date) ? date : dayjs(date);
    return result.hour(0).minute(0).second(0).millisecond(0);
};
import {Dayjs} from "dayjs";

export const getEndOfDay = (date: Dayjs) => {
    return date.hour(23).minute(59).second(59).millisecond(0);
};
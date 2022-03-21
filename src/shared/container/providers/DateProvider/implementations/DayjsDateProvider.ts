import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  dateNow(): Date {
    return dayjs().toDate();
  }
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
  compareInHours(firstDate: Date, secondDate: Date): number {
    const firstDateUTC = this.convertToUTC(firstDate);
    const secondDateUTC = this.convertToUTC(secondDate);

    return dayjs(firstDateUTC).diff(secondDateUTC, 'hours');
  }
  compareInDays(firstDate: Date, secondDate: Date): number {
    const firstDateUTC = this.convertToUTC(firstDate);
    const secondDateUTC = this.convertToUTC(secondDate);

    return dayjs(firstDateUTC).diff(secondDateUTC, 'days');
  }
  addDays(days: number): Date {
    return dayjs().add(days, 'day').toDate();
  }
  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate();
  }
}

export { DayjsDateProvider };

interface IDateProvider {
  compareInHours(firstDate: Date, secondDate: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  compareInDays(firstDate: Date, secondDate: Date): number;
}

export { IDateProvider };

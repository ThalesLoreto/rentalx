interface IDateProvider {
  compareInHours(firstDate: Date, secondDate: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
}

export { IDateProvider };

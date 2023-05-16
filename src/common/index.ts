
export class apiResponse {
    private status: number | null
    private message: string | null
    private data: any | null
    private error: any | null
    constructor(status: number, message: string, data: any, error: any) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}

export const userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload"
}

export const standardClass = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
]

export const file_path = ['profile', 'document']


export const generateUserId = (prefix)=> {
    const randomInt = Math.floor(Math.random() * 100000); // Generate a random integer between 0 and 99999
    const userId = `${prefix}${randomInt.toString().padStart(5, '0')}`; // Combine the random integer with the prefix "u-" and pad with leading zeros
    return userId;
  }

 export const  generatePassword =() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Define the possible characters for the password
    let password = '';
    for (let i = 0; i < 5; i++) { // Generate a random password of length 5
      const randomIndex = Math.floor(Math.random() * characters.length); // Generate a random index within the range of the characters array
      password += characters[randomIndex]; // Add a random character from the characters array to the password
    }
    return password;
  }

  export const   get_next_Date = (date , day) =>{
    const nextDate  = new Date(date); // The Date object returns today's timestamp
    nextDate.setDate(nextDate.getDate() + day);
    return nextDate;
}



export const  getMonthEndDate = (monthSDate)=> {
  // Get the year and month of the input date
  const year = monthSDate.getFullYear();
  const month = monthSDate.getMonth();

  // Create a new date object for the first day of the next month
  const nextMonth = new Date(year, month + 1, 1);

  // Subtract one millisecond from the next month's first day to get the last millisecond of the current month
  const lastDay = new Date(nextMonth.getTime() - 1);

  // Set the time to 11:59:00 PM
  lastDay.setHours(23, 59, 0);

  // Return the last day of the month with the last time (11:59:00 PM)
  return lastDay;
}

export const getDayOfWeek = (dateString) =>{
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const date = new Date(dateString);
  const dayOfWeek = daysOfWeek[date.getUTCDay()];
  return dayOfWeek;
}
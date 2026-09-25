export const MARKET_CONFIG = [
  {
    id: 'laksh-morning',
    title: 'LAKSH MORNING',
    active: true,
    sortOrder: 1,

    schedule: {
      timezone: 'Asia/Kolkata',
      openStartTime: '06:00',
      openEndTime: '10:00',
      closeEndTime: '11:00',
      closedWeekdays: [0],
      overrides: {},
    },

    result: {
      openPanna: '',
      openAnk: '',
      closeAnk: '',
      closePanna: '',
    },
  },

  /* 
   * Yahan se doosra market start hota hai 
   */
  {
    id: 'laksh-day', // Naya aur unique ID
    title: 'LAKSH DAY', // Market ka naam
    active: true,
    sortOrder: 2, // Agla number (sequence ke liye)

    schedule: {
      timezone: 'Asia/Kolkata',
      openStartTime: '12:00', // Apne hisab se timing change karein
      openEndTime: '02:00',
      closeEndTime: '03:00',
      closedWeekdays: [0],
      overrides: {},
    },

    result: {
      openPanna: '',
      openAnk: '',
      closeAnk: '',
      closePanna: '',
    },
  },
];

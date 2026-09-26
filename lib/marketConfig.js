export const MARKET_CONFIG = [
  {
    id: 'laksh-morning',
    title: 'LAKSH MORNING',
    active: true,
    sortOrder: 1,

    schedule: {
      timezone: 'Asia/Kolkata',
      openStartTime: '06:00', // 06:00 AM
      openEndTime: '10:00',   // 10:00 AM
      closeEndTime: '11:00',  // 11:00 AM
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

  {
    id: 'laksh-day',
    title: 'LAKSH DAY',
    active: true,
    sortOrder: 2,

    schedule: {
      timezone: 'Asia/Kolkata',
      openStartTime: '12:00', // 12:00 PM (Dopahar)
      openEndTime: '14:00',   // 02:00 PM (24-hour format mein 14:00)
      closeEndTime: '15:00',  // 03:00 PM (24-hour format mein 15:00)
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

  {
    id: 'kalyan',
    title: 'KALYAN',
    active: true,
    sortOrder: 3,

    schedule: {
      timezone: 'Asia/Kolkata',
      openStartTime: '06:00', // 12:00 PM (Dopahar)
      openEndTime: '16:30',   // 02:00 PM (24-hour format mein 14:00)
      closeEndTime: '18:30',  // 03:00 PM (24-hour format mein 15:00)
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

  {
    id: 'milan-day',
    title: 'MILAN DAY',
    active: true,
    sortOrder: 4,

    schedule: {
      timezone: 'Asia/Kolkata',
      openStartTime: '06:00', // 12:00 PM (Dopahar)
      openEndTime: '16:30',   // 02:00 PM (24-hour format mein 14:00)
      closeEndTime: '18:30',  // 03:00 PM (24-hour format mein 15:00)
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

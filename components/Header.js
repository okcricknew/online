import { toggleNotifications } from '@/app/actions/auth';

export default function Header({ session }) {
  const isNotificationsOn =
    session?.notificationsEnabled ?? true;

  return (
    <div className="sticky top-0 z-50 bg-gray-100 pb-1">

      <div className="bg-[#18a4e0] text-white shadow-md rounded-b-[30px] pb-5">

        <div className="flex justify-between items-center px-4 pt-2.5 pb-1">

          <div className="flex items-center gap-2.5">

            <span className="text-2xl">
              ☰
            </span>

            <h1 className="text-3xl font-black">
              Laksh
              <span className="text-gray-200">
                365
              </span>
            </h1>

          </div>

          <div className="flex items-center gap-2">

            <div className="bg-black rounded-full px-3 py-1.5 text-lg font-bold flex items-center gap-1.5 shadow-inner">
              <span className="text-sm">
                👛
              </span>

              ₹500000
            </div>

            <form action={toggleNotifications}>

              <button
                type="submit"
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-inner text-sm ${
                  isNotificationsOn
                    ? 'bg-black text-white'
                    : 'bg-gray-800 text-gray-400 opacity-80'
                }`}
              >
                {isNotificationsOn
                  ? '🔔'
                  : '🔕'}
              </button>

            </form>

          </div>

        </div>

        <div className="px-3 py-0.5 overflow-hidden whitespace-nowrap font-bold text-xs">
          WELCOME TO LAKSH365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED
        </div>

        <div className="grid grid-cols-2 gap-2.5 px-4 pt-2 pb-1">

          <button
            type="button"
            className="bg-white text-black border-2 border-black rounded-[20px] py-2 font-black text-lg shadow-md"
          >
            ▶ STARLINE
          </button>

          <button
            type="button"
            className="bg-white text-black border-2 border-black rounded-[20px] py-2 font-black text-lg shadow-md"
          >
            ▶ JACKPOT
          </button>

        </div>

      </div>

      <ActionButtons />

    </div>
  );
}


function Item({ icon, title }) {
  return (
    <div className="flex flex-col items-center">

      <div className="w-11 h-11 rounded-full border-2 border-black bg-white flex items-center justify-center text-xl shadow-sm">
        {icon}
      </div>

      <span className="font-bold mt-0.5 text-[11px] text-black">
        {title}
      </span>

    </div>
  );
}


export function ActionButtons() {
  return (
    <div className="px-4 -mt-2 relative z-10">

      <div className="bg-white border-2 border-black rounded-[20px] py-2.5 px-2 flex justify-around">

        <Item
          icon="💰"
          title="DEPOSIT"
        />

        <Item
          icon="🏧"
          title="WITHDRAW"
        />

        <Item
          icon="🟢"
          title="WHATSAPP"
        />

        <Item
          icon="📺"
          title="LIVE CHAT"
        />

      </div>

    </div>
  );
    }

import { Dispatch, SetStateAction, createContext, useState } from 'react';

const initialTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const initialTimezone = 'UTC';

export const TimezoneContext = createContext<
  [state: string, dispatch: Dispatch<SetStateAction<string>>]
>([initialTimezone, () => null]);

function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState(initialTimezone);

  return (
    <TimezoneContext.Provider value={[timezone, setTimezone]}>
      {children}
    </TimezoneContext.Provider>
  );
}

export default TimezoneProvider;

import { createContext, useContext } from 'react';
import { UserT } from '../../data';
import useObject from '../../hooks/state/useObject';
import POSContextType, { POSProductT } from './POSContext';
import useArray from '../../hooks/state/useArray';

const POSContext = createContext({} as POSContextType);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const customer = useObject<UserT>({} as UserT);
  const products = useArray<POSProductT>([]);

  return (
    <POSContext.Provider
      value={{
        customer,
        products,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  return useContext(POSContext);
}

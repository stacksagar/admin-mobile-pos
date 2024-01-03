import { createContext, useContext, useState } from 'react';
import useBoolean, { UseBoolean } from '../hooks/state/useBoolean';
import { UserT } from '../data';

interface GlobalState {}

interface Context {
  showCustomerFormModal: UseBoolean;
  showUserFormModal: UseBoolean;
  selectedUser: UserT;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserT>>;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

const GlobalContext = createContext<Context>({} as Context);

export function GlobalStateProvider({ children }: any) {
  const [globalState, setGlobalState] = useState<GlobalState>({});
  const [selectedUser, setSelectedUser] = useState({} as UserT);
  const showCustomerFormModal = useBoolean();
  const showUserFormModal = useBoolean();

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        setGlobalState,
        showCustomerFormModal,
        showUserFormModal,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalContext);
}

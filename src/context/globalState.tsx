import { createContext, useContext, useState } from 'react';
import useBoolean, { UseBoolean } from '../hooks/state/useBoolean';
import { UserT } from '../data';

interface GlobalState {}

interface Context {
  isShow: UseBoolean;
  isShow2: UseBoolean;
  showCustomerFormModal: UseBoolean;
  showUserFormModal: UseBoolean;
  selectedUser: UserT;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserT>>;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  selectedID: any;
  setSelectedID: React.Dispatch<React.SetStateAction<any>>;
  selectedItem: any;
  setSelectedItem: React.Dispatch<any>;
}

const GlobalContext = createContext<Context>({} as Context);

export function GlobalStateProvider({ children }: any) {
  const [globalState, setGlobalState] = useState<GlobalState>({});
  const [selectedUser, setSelectedUser] = useState({} as UserT);
  const showCustomerFormModal = useBoolean();
  const showUserFormModal = useBoolean();

  // use for any
  const isShow = useBoolean();
  const isShow2 = useBoolean();
  const [selectedID, setSelectedID] = useState<any>();
  const [selectedItem, setSelectedItem] = useState({} as any);

  return (
    <GlobalContext.Provider
      value={{
        isShow,
        isShow2,

        selectedItem,
        setSelectedItem,

        globalState,
        setGlobalState,
        showCustomerFormModal,
        showUserFormModal,
        selectedUser,
        setSelectedUser,

        selectedID,
        setSelectedID,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalContext);
}

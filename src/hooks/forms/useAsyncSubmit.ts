import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
type Props = {
  tryFunc?: () => void;
  finallyFunc?: () => void;
  errorFunc?: (errorMessage: string, errorOptions: any) => void;
};
export default function useAsyncSubmit() {
  return async ({ tryFunc, errorFunc, finallyFunc }: Props) => {
    try {
      tryFunc && tryFunc();
    } catch (error) {
      toast({
        message: error_message(error),
        type: 'error',
      });
      errorFunc && errorFunc(error_message(error), error);
    } finally {
      finallyFunc && finallyFunc();
    }
  };
}

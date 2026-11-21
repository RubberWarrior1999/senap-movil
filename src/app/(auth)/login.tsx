import { LoginView } from '../../components/auth/LoginView';
import { useLogin } from '../../hooks/useLogin';

export default function LoginPage() {
  const view = useLogin();
  return <LoginView {...view} />;
}

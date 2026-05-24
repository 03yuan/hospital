import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Result } from 'antd';

interface Props {
  children: ReactNode;
  roles: string[];
}

export function RoleGuard({ children, roles }: Props) {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
      />
    );
  }

  return <>{children}</>;
}

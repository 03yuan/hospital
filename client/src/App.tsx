import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import theme from './theme';
import { router } from './router';
import { useAuthStore } from './store/authStore';

function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;

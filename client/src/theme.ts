import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1a1a1a',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#d9d9d9',
    colorText: '#1a1a1a',
    colorTextSecondary: '#8c8c8c',
    borderRadius: 6,
  },
  components: {
    Layout: {
      headerBg: '#1a1a1a',
      siderBg: '#1a1a1a',
      bodyBg: '#f5f5f5',
    },
    Menu: {
      darkItemBg: '#1a1a1a',
      darkItemSelectedBg: '#333333',
      darkItemColor: '#cccccc',
      darkItemSelectedColor: '#ffffff',
    },
    Button: {
      primaryColor: '#ffffff',
      defaultBorderColor: '#d9d9d9',
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#1a1a1a',
      borderColor: '#e8e8e8',
    },
    Tag: {
      defaultBg: '#ffffff',
      defaultColor: '#1a1a1a',
    },
    Card: {
      colorBorderSecondary: '#e8e8e8',
    },
    Modal: {
      headerBg: '#fafafa',
      contentBg: '#ffffff',
    },
    Tabs: {
      inkBarColor: '#1a1a1a',
      itemSelectedColor: '#1a1a1a',
    },
    Switch: {
      colorPrimary: '#1a1a1a',
    },
    Progress: {
      defaultColor: '#1a1a1a',
    },
  },
};

export default theme;

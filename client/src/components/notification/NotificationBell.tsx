import { useEffect, useState, useRef } from 'react';
import { Badge, Popover, List, Button, Empty, Typography, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { getNotifications, getUnreadCount, markRead, markAllRead } from '../../api/notifications';
import type { NotificationItem } from '../../types';
import { useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [list, setList] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchUnread = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnread();
    const timer = setInterval(fetchUnread, 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await getNotifications({ pageSize: 10 });
      setList(data.list);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleOpenChange = (visible: boolean) => {
    setOpen(visible);
    if (visible) {
      fetchList();
      hasFetched.current = true;
    }
  };

  const handleMarkRead = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markRead(item.id);
      setList((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (item.relatedUrl) {
      setOpen(false);
      navigate(item.relatedUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const content = (
    <div style={{ width: 360, maxHeight: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong>通知</Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllRead}>
            全部已读
          </Button>
        )}
      </div>
      <Spin spinning={loading}>
        {list.length === 0 ? (
          <Empty description="暂无通知" />
        ) : (
          <List
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleMarkRead(item)}
                style={{
                  cursor: 'pointer',
                  background: item.isRead ? '#fff' : '#f5f5f5',
                  padding: '8px 12px',
                  borderRadius: 4,
                  marginBottom: 4,
                }}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong={!item.isRead} style={{ fontSize: 13 }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ margin: 0, fontSize: 12, color: '#666' }}
                  >
                    {item.content}
                  </Paragraph>
                </div>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
}

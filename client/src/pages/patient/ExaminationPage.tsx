import { useEffect, useState } from 'react';
import { Table, Tag, Modal, Typography, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { getExaminationOrders, getExaminationOrderDetail } from '../../api/examinations';
import { ExaminationOrder } from '../../types';

export default function PatientExaminationPage() {
  const [orders, setOrders] = useState<ExaminationOrder[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ExaminationOrder | null>(null);

  useEffect(() => {
    getExaminationOrders().then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const openDetail = async (id: number) => {
    try {
      const res = await getExaminationOrderDetail(id);
      setSelectedOrder(res.data);
      setDetailModalOpen(true);
    } catch { /* ignore */ }
  };

  const handlePrint = (order: ExaminationOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>检查报告</title>
      <style>
        body { font-family: SimSun, serif; padding: 40px; }
        h2 { text-align: center; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 14px; }
        th { background: #f0f0f0; }
        .info { margin-bottom: 8px; font-size: 14px; }
        .footer { margin-top: 48px; text-align: right; font-size: 14px; }
      </style></head><body>
      <h2>医院门诊检查报告单</h2>
      <div class="info"><strong>编号：</strong>${order.id}</div>
      <div class="info"><strong>临床诊断：</strong>${order.clinicalDiag || '（未填写）'}</div>
      <table><tr><th>项目名称</th><th>类别</th><th>结果</th><th>参考范围</th><th>单位</th></tr>
      ${order.items.map(i =>
        `<tr><td>${i.itemName}</td><td>${i.category}</td><td>${i.result || '待录入'}</td><td>${i.refRange || '-'}</td><td>${i.unit || '-'}</td></tr>`
      ).join('')}
      </table>
      ${order.report ? `<p style="margin-top:16px"><strong>报告意见：</strong>${order.report.content || '无'}</p>` : ''}
      <div class="footer">打印时间：${dayjs().format('YYYY年MM月DD日 HH:mm')}</div>
      <script>window.onload=function(){window.print();window.close()}</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const statusMap: Record<string, string> = {
    PENDING: '待缴费',
    PAID: '已缴费',
    IN_PROGRESS: '执行中',
    COMPLETED: '已完成',
  };

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag>{statusMap[s] || s}</Tag>,
    },
    { title: '临床诊断', dataIndex: 'clinicalDiag', key: 'clinicalDiag', render: (v: string) => v || '-' },
    {
      title: '项目数', key: 'count',
      render: (_: any, r: ExaminationOrder) => r.items.length,
    },
    { title: '开单时间', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => v.slice(0, 16) },
    {
      title: '操作', key: 'action',
      render: (_: any, r: ExaminationOrder) => (
        <Space>
          <a onClick={() => openDetail(r.id)}>查看详情</a>
          <a onClick={() => handlePrint(r)}>打印</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>我的检查检验</h2>
      <Table dataSource={orders} columns={columns} rowKey="id" pagination={false} locale={{ emptyText: '暂无检查记录，医生开具检查单后将显示在此' }} />

      <Modal
        title="检查报告详情"
        open={detailModalOpen}
        footer={null}
        onCancel={() => setDetailModalOpen(false)}
        width={600}
      >
        {selectedOrder && (
          <div>
            <p><strong>状态：</strong>{statusMap[selectedOrder.status]}</p>
            {selectedOrder.clinicalDiag && <p><strong>临床诊断：</strong>{selectedOrder.clinicalDiag}</p>}
            <h4>检查项目</h4>
            <Table
              dataSource={selectedOrder.items}
              columns={[
                { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
                { title: '类别', dataIndex: 'category', key: 'category' },
                { title: '参考范围', dataIndex: 'refRange', key: 'refRange', render: (v: string) => v || '-' },
                { title: '单位', dataIndex: 'unit', key: 'unit', render: (v: string) => v || '-' },
                { title: '结果', dataIndex: 'result', key: 'result', render: (v: string) => v || '待录入' },
              ]}
              rowKey="id"
              pagination={false}
            />
            {selectedOrder.report && (
              <div style={{ marginTop: 16 }}>
                <h4>报告意见</h4>
                <Typography.Paragraph>{selectedOrder.report.content || '无'}</Typography.Paragraph>
                <p style={{ color: '#999', fontSize: 12 }}>报告时间：{selectedOrder.report.createdAt.slice(0, 16)}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { phone: '13800000000' },
    update: { password: adminPassword },
    create: {
      phone: '13800000000',
      password: adminPassword,
      name: '系统管理员',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('管理员账号: 13800000000 / admin123');

  const depts = [
    { name: '内科', description: '内科疾病诊疗' },
    { name: '外科', description: '外科手术与治疗' },
    { name: '儿科', description: '儿童疾病诊疗' },
    { name: '妇科', description: '妇科疾病诊疗' },
    { name: '眼科', description: '眼部疾病诊疗' },
    { name: '耳鼻喉科', description: '耳鼻喉疾病诊疗' },
    { name: '口腔科', description: '口腔疾病诊疗' },
    { name: '皮肤科', description: '皮肤疾病诊疗' },
  ];

  for (const dept of depts) {
    await prisma.department.upsert({
      where: { id: depts.indexOf(dept) + 1 },
      update: {},
      create: { name: dept.name, description: dept.description },
    });
  }
  console.log(`已创建 ${depts.length} 个科室`);

  const doctorPassword = await bcrypt.hash('123456', 10);
  const doctorUsers = [
    { phone: '13900000001', name: '李文', title: '主任医师', deptId: 1 },
    { phone: '13900000002', name: '王芳', title: '副主任医师', deptId: 1 },
    { phone: '13900000003', name: '张强', title: '主治医师', deptId: 2 },
    { phone: '13900000004', name: '刘洋', title: '主任医师', deptId: 3 },
    { phone: '13900000005', name: '陈静', title: '副主任医师', deptId: 4 },
  ];

  for (const doc of doctorUsers) {
    const user = await prisma.user.upsert({
      where: { phone: doc.phone },
      update: { password: doctorPassword },
      create: {
        phone: doc.phone,
        password: doctorPassword,
        name: doc.name,
        role: 'DOCTOR',
        status: 'ACTIVE',
      },
    });

    await prisma.doctor.upsert({
      where: { id: doctorUsers.indexOf(doc) + 1 },
      update: { title: doc.title, description: `${doc.name}，${doc.title}，擅长相关疾病诊疗。` },
      create: {
        id: doctorUsers.indexOf(doc) + 1,
        userId: user.id,
        departmentId: doc.deptId,
        title: doc.title,
        description: `${doc.name}，${doc.title}，擅长相关疾病诊疗。`,
      },
    });
  }
  console.log(`已创建 ${doctorUsers.length} 名医生`);

  // 创建示例患者
  const patientPassword = await bcrypt.hash('123456', 10);
  const patients = [
    { phone: '13700000001', name: '赵明' },
    { phone: '13700000002', name: '孙丽' },
    { phone: '13700000003', name: '周伟' },
    { phone: '13700000004', name: '吴婷' },
    { phone: '13700000005', name: '郑刚' },
  ];
  for (const p of patients) {
    await prisma.user.upsert({
      where: { phone: p.phone },
      update: { password: patientPassword },
      create: { phone: p.phone, password: patientPassword, name: p.name, role: 'PATIENT', status: 'ACTIVE' },
    });
  }
  console.log(`已创建 ${patients.length} 名示例患者`);

  // 生成未来7天的排班
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let scheduleCount = 0;

  // 清除已有排班重新生成
  await prisma.prescription.deleteMany();
  await prisma.examinationOrderItem.deleteMany();
  await prisma.examinationReport.deleteMany();
  await prisma.examinationOrder.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    // 跳过周末
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    const records: { doctorId: number; date: Date; hour: number }[] = [];
    for (let doctorId = 1; doctorId <= doctorUsers.length; doctorId++) {
      for (let h = 8; h < 12; h++) records.push({ doctorId, date, hour: h });
      for (let h = 14; h < 17; h++) records.push({ doctorId, date, hour: h });
    }
    const result = await prisma.schedule.createMany({ data: records, skipDuplicates: true });
    scheduleCount += result.count;
  }
  console.log(`已生成 ${scheduleCount} 条排班记录（未来7个工作日）`);

  // 药品分类与药品
  const categories = [
    '抗生素类', '感冒用药类', '解热镇痛类', '消化系统类',
    '心血管类', '呼吸系统类', '抗过敏类', '中成药类', '外用药类', '维生素与营养类',
  ];

  const medicinesByCategory: { name: string; commonDosage: string; commonMethod: string }[][] = [
    // 抗生素类
    [
      { name: '阿莫西林胶囊', commonDosage: '每次1粒', commonMethod: '每日3次' },
      { name: '头孢克肟分散片', commonDosage: '每次1片', commonMethod: '每日2次' },
      { name: '阿奇霉素片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '左氧氟沙星片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '甲硝唑片', commonDosage: '每次2片', commonMethod: '每日3次' },
    ],
    // 感冒用药类
    [
      { name: '感冒灵颗粒', commonDosage: '每次1袋', commonMethod: '每日3次' },
      { name: '板蓝根颗粒', commonDosage: '每次1袋', commonMethod: '每日3次' },
      { name: '连花清瘟胶囊', commonDosage: '每次4粒', commonMethod: '每日3次' },
      { name: '复方氨酚烷胺片', commonDosage: '每次1片', commonMethod: '每日2次' },
      { name: '维C银翘片', commonDosage: '每次2片', commonMethod: '每日3次' },
    ],
    // 解热镇痛类
    [
      { name: '布洛芬缓释胶囊', commonDosage: '每次1粒', commonMethod: '每日2次' },
      { name: '对乙酰氨基酚片', commonDosage: '每次1片', commonMethod: '每日3次' },
      { name: '双氯芬酸钠缓释片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '吲哚美辛栓', commonDosage: '每次1粒', commonMethod: '每日1次' },
    ],
    // 消化系统类
    [
      { name: '奥美拉唑肠溶胶囊', commonDosage: '每次1粒', commonMethod: '每日1次' },
      { name: '多潘立酮片', commonDosage: '每次1片', commonMethod: '每日3次' },
      { name: '铝碳酸镁咀嚼片', commonDosage: '每次2片', commonMethod: '每日3次' },
      { name: '蒙脱石散', commonDosage: '每次1袋', commonMethod: '每日3次' },
      { name: '双歧杆菌四联活菌片', commonDosage: '每次3片', commonMethod: '每日3次' },
    ],
    // 心血管类
    [
      { name: '阿司匹林肠溶片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '硝苯地平控释片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '厄贝沙坦片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '美托洛尔缓释片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '氨氯地平片', commonDosage: '每次1片', commonMethod: '每日1次' },
    ],
    // 呼吸系统类
    [
      { name: '氨溴索片', commonDosage: '每次1片', commonMethod: '每日3次' },
      { name: '茶碱缓释片', commonDosage: '每次1片', commonMethod: '每日2次' },
      { name: '孟鲁司特钠片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '沙丁胺醇气雾剂', commonDosage: '每次1喷', commonMethod: '每日3次' },
      { name: '复方甘草片', commonDosage: '每次3片', commonMethod: '每日3次' },
    ],
    // 抗过敏类
    [
      { name: '氯雷他定片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '西替利嗪片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '扑尔敏片', commonDosage: '每次1片', commonMethod: '每日3次' },
    ],
    // 中成药类
    [
      { name: '六味地黄丸', commonDosage: '每次8粒', commonMethod: '每日3次' },
      { name: '逍遥丸', commonDosage: '每次8粒', commonMethod: '每日3次' },
      { name: '牛黄解毒片', commonDosage: '每次3片', commonMethod: '每日3次' },
      { name: '复方丹参滴丸', commonDosage: '每次10粒', commonMethod: '每日3次' },
      { name: '速效救心丸', commonDosage: '每次4粒', commonMethod: '每日3次' },
    ],
    // 外用药类
    [
      { name: '红霉素软膏', commonDosage: '适量', commonMethod: '每日2次' },
      { name: '莫匹罗星软膏', commonDosage: '适量', commonMethod: '每日3次' },
      { name: '酮康唑乳膏', commonDosage: '适量', commonMethod: '每日1次' },
      { name: '复方醋酸地塞米松乳膏', commonDosage: '适量', commonMethod: '每日2次' },
    ],
    // 维生素与营养类
    [
      { name: '维生素C片', commonDosage: '每次1片', commonMethod: '每日3次' },
      { name: '维生素D滴剂', commonDosage: '每次1粒', commonMethod: '每日1次' },
      { name: '钙尔奇D片', commonDosage: '每次1片', commonMethod: '每日1次' },
      { name: '复合维生素B片', commonDosage: '每次2片', commonMethod: '每日3次' },
    ],
  ];

  for (let i = 0; i < categories.length; i++) {
    const cat = await prisma.medicineCategory.upsert({
      where: { id: i + 1 },
      update: { name: categories[i] },
      create: { name: categories[i] },
    });

    const medicines = medicinesByCategory[i];
    for (let j = 0; j < medicines.length; j++) {
      const med = medicines[j];
      await prisma.medicine.upsert({
        where: { categoryId_name: { categoryId: cat.id, name: med.name } },
        update: {},
        create: {
          categoryId: cat.id,
          name: med.name,
          commonDosage: med.commonDosage,
          commonMethod: med.commonMethod,
        },
      });
    }
  }
  console.log(`已创建 ${categories.length} 个药品分类和 ${medicinesByCategory.flat().length} 种药品`);

  // 检查项目
  const examItems = [
    { name: '血常规', category: '检验', deptId: 1, price: 20, refRange: 'WBC 4-10×10⁹/L', unit: '' },
    { name: '尿常规', category: '检验', deptId: 1, price: 15, refRange: '', unit: '' },
    { name: '肝功能', category: '检验', deptId: 1, price: 60, refRange: 'ALT < 40U/L', unit: '' },
    { name: '肾功能', category: '检验', deptId: 1, price: 50, refRange: 'Cr 44-133μmol/L', unit: '' },
    { name: '血糖', category: '检验', deptId: 1, price: 10, refRange: '3.9-6.1mmol/L', unit: 'mmol/L' },
    { name: '血脂', category: '检验', deptId: 1, price: 45, refRange: 'TC < 5.2mmol/L', unit: 'mmol/L' },
    { name: '甲状腺功能', category: '检验', deptId: 1, price: 120, refRange: 'TSH 0.35-4.94mIU/L', unit: '' },
    { name: '凝血功能', category: '检验', deptId: 2, price: 80, refRange: 'PT 11-14s', unit: 's' },
    { name: '胸部X光', category: '影像', deptId: 1, price: 80, refRange: '', unit: '' },
    { name: '腹部B超', category: '影像', deptId: 2, price: 150, refRange: '', unit: '' },
    { name: '心电图', category: '影像', deptId: 1, price: 30, refRange: '', unit: '' },
    { name: 'CT（头部）', category: '影像', deptId: 1, price: 300, refRange: '', unit: '' },
    { name: 'CT（胸部）', category: '影像', deptId: 1, price: 350, refRange: '', unit: '' },
    { name: 'MRI（核磁共振）', category: '影像', deptId: 2, price: 600, refRange: '', unit: '' },
  ];

  for (const item of examItems) {
    await prisma.examinationItem.upsert({
      where: { id: examItems.indexOf(item) + 1 },
      update: {},
      create: {
        name: item.name,
        category: item.category,
        departmentId: item.deptId,
        price: item.price,
        refRange: item.refRange || null,
        unit: item.unit || null,
      },
    });
  }
  console.log(`已创建 ${examItems.length} 个检查项目`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

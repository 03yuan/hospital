import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { phone: '13800000000' },
    update: {},
    create: {
      phone: '13800000000',
      password: 'admin123',
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
      update: {},
      create: {
        phone: doc.phone,
        password: '123456',
        name: doc.name,
        role: 'DOCTOR',
        status: 'ACTIVE',
      },
    });

    await prisma.doctor.upsert({
      where: { id: doctorUsers.indexOf(doc) + 1 },
      update: {},
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

  // 生成未来7天的排班
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let scheduleCount = 0;

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    // 跳过周末
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    for (let doctorId = 1; doctorId <= doctorUsers.length; doctorId++) {
      // 上午 8:00-12:00
      for (let h = 8; h < 12; h++) {
        await prisma.schedule.upsert({
          where: { doctorId_date_hour: { doctorId, date, hour: h } },
          update: {},
          create: { doctorId, date, hour: h },
        });
        scheduleCount++;
      }
      // 下午 14:00-17:00
      for (let h = 14; h < 17; h++) {
        await prisma.schedule.upsert({
          where: { doctorId_date_hour: { doctorId, date, hour: h } },
          update: {},
          create: { doctorId, date, hour: h },
        });
        scheduleCount++;
      }
    }
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

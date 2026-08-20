import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إضافة البيانات التجريبية...");

  // ------------------------------------------------------------
  // Admin account
  // ------------------------------------------------------------
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "Admin@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@platform.com" },
    update: {},
    create: {
      name: process.env.ADMIN_NAME ?? "Admin",
      email: process.env.ADMIN_EMAIL ?? "admin@platform.com",
      phone: process.env.ADMIN_PHONE ?? "01000000000",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ تم إنشاء حساب الأدمن: ${admin.email}`);

  // ------------------------------------------------------------
  // Teams (الفرق)
  // ------------------------------------------------------------
  const teamsData = [
    { name: "الفرقة الأولى", description: "الفرقة الدراسية الأولى", order: 1 },
    { name: "الفرقة الثانية", description: "الفرقة الدراسية الثانية", order: 2 },
    { name: "الفرقة الثالثة", description: "الفرقة الدراسية الثالثة", order: 3 },
    { name: "الفرقة الرابعة", description: "الفرقة الدراسية الرابعة", order: 4 },
  ];

  const teams = [];
  for (const t of teamsData) {
    const team = await prisma.team.upsert({
      where: { id: `seed-${t.order}` },
      update: {},
      create: { ...t, id: `seed-${t.order}` },
    });
    teams.push(team);
  }
  console.log(`✅ تم إنشاء ${teams.length} فرق دراسية`);

  // ------------------------------------------------------------
  // Sample Student
  // ------------------------------------------------------------
  const studentPasswordHash = await bcrypt.hash("Student@123", 10);
  const student = await prisma.user.upsert({
    where: { email: "student@platform.com" },
    update: {},
    create: {
      name: "طالب تجريبي",
      email: "student@platform.com",
      phone: "01100000000",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      teamId: teams[1].id, // الفرقة الثانية
    },
  });
  console.log(`✅ تم إنشاء حساب طالب تجريبي: ${student.email}`);

  // ------------------------------------------------------------
  // Subjects (المواد) - added to the second team as an example
  // ------------------------------------------------------------
  const subjectsData = [
    { name: "المحاسبة", description: "أساسيات ومبادئ المحاسبة", order: 1 },
    { name: "إدارة الأعمال", description: "مبادئ الإدارة والتنظيم", order: 2 },
    { name: "الاقتصاد", description: "الاقتصاد الجزئي والكلي", order: 3 },
    { name: "القانون", description: "القانون التجاري والمدني", order: 4 },
    { name: "الإحصاء", description: "الإحصاء التطبيقي وتحليل البيانات", order: 5 },
  ];

  const subjects = [];
  for (const s of subjectsData) {
    const subject = await prisma.subject.upsert({
      where: { id: `seed-subject-${s.order}` },
      update: {},
      create: { ...s, id: `seed-subject-${s.order}`, teamId: teams[1].id },
    });
    subjects.push(subject);
  }
  console.log(`✅ تم إنشاء ${subjects.length} مواد دراسية`);

  // ------------------------------------------------------------
  // Lectures (محاضرات تجريبية لأول مادتين)
  // ------------------------------------------------------------
  for (const subject of subjects.slice(0, 2)) {
    for (let i = 1; i <= 4; i++) {
      await prisma.lecture.upsert({
        where: { id: `seed-lecture-${subject.id}-${i}` },
        update: {},
        create: {
          id: `seed-lecture-${subject.id}-${i}`,
          subjectId: subject.id,
          title: `محاضرة ${i} - ${subject.name}`,
          description: `شرح تفصيلي للمحاضرة رقم ${i} في مادة ${subject.name}`,
          order: i,
          // pdfUrl / audioUrl تُترك فارغة في السييد؛ يتم رفعها من Admin Dashboard
        },
      });
    }
  }
  console.log("✅ تم إنشاء محاضرات تجريبية");

  // ------------------------------------------------------------
  // Banners
  // ------------------------------------------------------------
  await prisma.banner.upsert({
    where: { id: "seed-banner-1" },
    update: {},
    create: {
      id: "seed-banner-1",
      title: "أهلاً بك في منصتك التعليمية",
      description: "تابع محاضراتك ومذاكرتك بسهولة في مكان واحد",
      imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600",
      buttonText: "ابدأ الآن",
      link: "/teams",
      order: 1,
    },
  });
  console.log("✅ تم إنشاء بانر تجريبي");

  console.log("🎉 تم الانتهاء من إضافة كل البيانات التجريبية بنجاح");
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء تنفيذ السييد:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default motivational quotes
const DEFAULT_QUOTES = [
  { text: "خسته نباشی قهرمان! هر یک دقیقه‌ای که برای هدفت وقت می‌ذاری، یه قدم به رویاهات نزدیک‌تر می‌شی.", author: "درس‌خون" },
  { text: "تلاش امروز تو، پیروزی شیرین فردای توست. به مسیرت افتخار کن!", author: "درس‌خون" },
  { text: "موفقیت مجموعه‌ای از تلاش‌های کوچک روزانه است که بارها تکرار می‌شوند.", author: "رابرت کالیر" },
  { text: "آفرین به اراده‌ات! امروز فوق‌العاده عمل کردی، استراحت کن و با قدرت برگرد.", author: "درس‌خون" },
  { text: "فرق یک فرد موفق با دیگران کمبود قدرت یا دانش نیست، بلکه کمبود اراده است؛ و تو اراده‌اش رو داری!", author: "وینس لومباردی" },
  { text: "به خودت ایمان داشته باش. تو قوی‌تر از سختی‌های درسی هستی.", author: "کریستین لارسون" },
  { text: "هر صفحه که می‌خوانی، یک پنجره جدید به سوی آینده درخشانت باز می‌کنی.", author: "درس‌خون" },
  { text: "رویاهات منتظرت هستن، تو داری پایه‌های آینده‌ت رو آجر به آجر محکم می‌سازی!", author: "درس‌خون" },
  { text: "سخت‌کوشی شاید الان تلخ باشه، ولی میوه‌اش شیرین‌ترین تجربه زندگیت خواهد بود.", author: "ارسطو" },
  { text: "دمت گرم! امروز یک قدم واقعی برای رسیدن به دانشگاه و رتبه دلخواهت برداشتی.", author: "درس‌خون" },
  { text: "تسلیم نشو! نقطه‌ای که فکر می‌کنی دیگه نمی‌تونی، دقیقا همونجاست که معجزه شروع می‌شه.", author: "درس‌خون" },
  { text: "تمرکز و استمرار، دو بال پرواز تو به سوی فتح قله‌ها هستند. تبریک بابت این پارت درسی!", author: "درس‌خون" }
];

// Initial default database state
const INITIAL_DATA = {
  users: [
    {
      id: "user-1",
      name: "سارا محمدی",
      avatar: "👩‍🎓",
      grade: "کنکور تجربی",
      bio: "هدف: پزشکی دانشگاه تهران 🩺💪",
      dailyTargetHours: 8,
      telegramConfig: {
        botToken: "",
        chatId: "",
        autoSend: false
      },
      createdAt: new Date().toISOString()
    },
    {
      id: "user-2",
      name: "امیررضا علیزاده",
      avatar: "👨‍💻",
      grade: "کنکور ریاضی",
      bio: "عاشق کامپیوتر و هوش مصنوعی شریف ⚡",
      dailyTargetHours: 7,
      telegramConfig: {
        botToken: "",
        chatId: "",
        autoSend: false
      },
      createdAt: new Date().toISOString()
    },
    {
      id: "user-3",
      name: "فاطمه حسینی",
      avatar: "📚",
      grade: "کنکور انسانی",
      bio: "حقوق دانشگاه تهران، هیچ مانعی جلودارم نیست!",
      dailyTargetHours: 6,
      telegramConfig: {
        botToken: "",
        chatId: "",
        autoSend: false
      },
      createdAt: new Date().toISOString()
    }
  ],
  subjects: [
    // Subjects for user-1
    { id: "sub-1", userId: "user-1", name: "زیست‌شناسی", color: "#10b981", weeklyTargetHours: 15, icon: "🧬" },
    { id: "sub-2", userId: "user-1", name: "شیمی", color: "#3b82f6", weeklyTargetHours: 10, icon: "⚗️" },
    { id: "sub-3", userId: "user-1", name: "فیزیک", color: "#8b5cf6", weeklyTargetHours: 8, icon: "⚡" },
    { id: "sub-4", userId: "user-1", name: "ریاضیات", color: "#f59e0b", weeklyTargetHours: 8, icon: "📐" },
    // Subjects for user-2
    { id: "sub-5", userId: "user-2", name: "حسابان و دیفرانسیل", color: "#ec4899", weeklyTargetHours: 16, icon: "∫" },
    { id: "sub-6", userId: "user-2", name: "فیزیک پیشرفته", color: "#6366f1", weeklyTargetHours: 12, icon: "🚀" },
    { id: "sub-7", userId: "user-2", name: "هندسه و گسسته", color: "#14b8a6", weeklyTargetHours: 10, icon: "🔺" },
    // Subjects for user-3
    { id: "sub-8", userId: "user-3", name: "فلسفه و منطق", color: "#eab308", weeklyTargetHours: 12, icon: "🏛️" },
    { id: "sub-9", userId: "user-3", name: "جامعه‌شناسی", color: "#06b6d4", weeklyTargetHours: 10, icon: "👥" }
  ],
  groups: [
    {
      id: "group-101",
      name: "باشگاه نخبگان کنکور ۱۴۰۵ 🎯",
      code: "NOKHBE-101",
      description: "مطالعه گروهی روزانه، ثبت گزارش شبانه، رقابت سالم و انگیزشی",
      createdById: "user-1",
      members: ["user-1", "user-2", "user-3"],
      createdAt: new Date().toISOString()
    },
    {
      id: "group-102",
      name: "ماراتن سحرخیزان ۵ صبح ☀️",
      code: "MORNING-5",
      description: "پارت‌های اول مطالعه اول صبح، بدون گوشی و تمرکز مطلق",
      createdById: "user-2",
      members: ["user-2", "user-1"],
      createdAt: new Date().toISOString()
    }
  ],
  sessions: [
    {
      id: "sess-1",
      userId: "user-1",
      subjectId: "sub-1",
      subjectName: "زیست‌شناسی",
      durationMinutes: 90,
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      topic: "گفتار دوم فصل گردش مواد",
      testCount: 40,
      notes: "تست‌های چالشی علامت‌دار شدند"
    },
    {
      id: "sess-2",
      userId: "user-1",
      subjectId: "sub-2",
      subjectName: "شیمی",
      durationMinutes: 75,
      timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      topic: "استوکیومتری واکنش‌ها",
      testCount: 30,
      notes: "مرور فرمول‌های بازده درصدی"
    },
    {
      id: "sess-3",
      userId: "user-2",
      subjectId: "sub-5",
      subjectName: "حسابان و دیفرانسیل",
      durationMinutes: 120,
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      topic: "کاربرد مشتق و اکسترمم‌های نسبی",
      testCount: 45,
      notes: "حل سوالات کنکور سال‌های اخیر"
    },
    {
      id: "sess-4",
      userId: "user-3",
      subjectId: "sub-8",
      subjectName: "فلسفه و منطق",
      durationMinutes: 80,
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      topic: "مغالطات در منطق",
      testCount: 25,
      notes: "خلاصه‌نویسی نکات کلیدی"
    }
  ],
  plans: [
    {
      id: "plan-1",
      userId: "user-1",
      dayOfWeek: "شنبه",
      subjectId: "sub-1",
      title: "تست‌زنی زیست‌شناسی فصل ۴",
      plannedMinutes: 90,
      completed: true
    },
    {
      id: "plan-2",
      userId: "user-1",
      dayOfWeek: "شنبه",
      subjectId: "sub-2",
      title: "مرور شیمی و حل مسائل جرم مولی",
      plannedMinutes: 75,
      completed: true
    },
    {
      id: "plan-3",
      userId: "user-1",
      dayOfWeek: "امروز",
      subjectId: "sub-3",
      title: "فیزیک: مبحث کار و انرژی و قضیه کار کل",
      plannedMinutes: 90,
      completed: false
    }
  ],
  quotes: DEFAULT_QUOTES
};

// Database helper
function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("DB Read error, resetting:", err);
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    return INITIAL_DATA;
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ----------------- API ROUTES -----------------

// 1. Users & Profiles
app.get('/api/users', (req, res) => {
  const db = getDB();
  res.json(db.users);
});

app.post('/api/users', (req, res) => {
  const db = getDB();
  const { name, avatar, grade, bio, dailyTargetHours } = req.body;
  if (!name) return res.status(400).json({ error: "نام الزامی است" });

  const newUser = {
    id: "user-" + Date.now(),
    name,
    avatar: avatar || "🎓",
    grade: grade || "دانش‌آموز",
    bio: bio || "در حال تلاش برای ساختن آینده‌ای درخشان",
    dailyTargetHours: Number(dailyTargetHours) || 6,
    telegramConfig: { botToken: "", chatId: "", autoSend: false },
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Add default starter subjects for the new user
  const starterSubjects = [
    { id: "sub-" + Date.now() + "-1", userId: newUser.id, name: "درس اول", color: "#3b82f6", weeklyTargetHours: 10, icon: "📘" },
    { id: "sub-" + Date.now() + "-2", userId: newUser.id, name: "درس دوم", color: "#10b981", weeklyTargetHours: 8, icon: "📗" }
  ];
  db.subjects.push(...starterSubjects);

  // Automatically add to default community group
  if (db.groups.length > 0) {
    db.groups[0].members.push(newUser.id);
  }

  saveDB(db);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const db = getDB();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "کاربر یافت نشد" });

  db.users[index] = {
    ...db.users[index],
    ...req.body,
    id: db.users[index].id // preserve id
  };
  saveDB(db);
  res.json(db.users[index]);
});

// 2. Individual Subjects for each user
app.get('/api/subjects', (req, res) => {
  const { userId } = req.query;
  const db = getDB();
  if (userId) {
    return res.json(db.subjects.filter(s => s.userId === userId));
  }
  res.json(db.subjects);
});

app.post('/api/subjects', (req, res) => {
  const db = getDB();
  const { userId, name, color, weeklyTargetHours, icon } = req.body;
  if (!userId || !name) return res.status(400).json({ error: "نام درس و کاربر الزامی است" });

  const newSubject = {
    id: "sub-" + Date.now(),
    userId,
    name,
    color: color || "#3b82f6",
    weeklyTargetHours: Number(weeklyTargetHours) || 8,
    icon: icon || "📖"
  };

  db.subjects.push(newSubject);
  saveDB(db);
  res.status(201).json(newSubject);
});

app.delete('/api/subjects/:id', (req, res) => {
  const db = getDB();
  db.subjects = db.subjects.filter(s => s.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 3. Study Sessions (Study tracking & stats)
app.get('/api/sessions', (req, res) => {
  const { userId, groupId } = req.query;
  const db = getDB();
  let results = db.sessions;

  if (userId) {
    results = results.filter(s => s.userId === userId);
  } else if (groupId) {
    const group = db.groups.find(g => g.id === groupId);
    if (group) {
      results = results.filter(s => group.members.includes(s.userId));
    }
  }

  // Sort descending by timestamp
  results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(results);
});

app.post('/api/sessions', (req, res) => {
  const db = getDB();
  const { userId, subjectId, subjectName, durationMinutes, topic, testCount, notes } = req.body;
  if (!userId || !durationMinutes) {
    return res.status(400).json({ error: "اطلاعات مطالعه ناقص است" });
  }

  const newSession = {
    id: "sess-" + Date.now(),
    userId,
    subjectId: subjectId || "other",
    subjectName: subjectName || "مطالعه آزاد",
    durationMinutes: Number(durationMinutes),
    timestamp: new Date().toISOString(),
    topic: topic || "",
    testCount: Number(testCount) || 0,
    notes: notes || ""
  };

  db.sessions.push(newSession);
  saveDB(db);

  // Return session along with a random motivational quote
  const randomQuote = db.quotes[Math.floor(Math.random() * db.quotes.length)];

  res.status(201).json({
    session: newSession,
    encouragement: randomQuote
  });
});

// 4. Study Plans (برنامه‌ریزی درسی)
app.get('/api/plans', (req, res) => {
  const { userId } = req.query;
  const db = getDB();
  let plans = db.plans;
  if (userId) {
    plans = plans.filter(p => p.userId === userId);
  }
  res.json(plans);
});

app.post('/api/plans', (req, res) => {
  const db = getDB();
  const { userId, dayOfWeek, subjectId, title, plannedMinutes } = req.body;
  if (!userId || !title) return res.status(400).json({ error: "عنوان برنامه الزامی است" });

  const newPlan = {
    id: "plan-" + Date.now(),
    userId,
    dayOfWeek: dayOfWeek || "امروز",
    subjectId: subjectId || "",
    title,
    plannedMinutes: Number(plannedMinutes) || 60,
    completed: false
  };

  db.plans.push(newPlan);
  saveDB(db);
  res.status(201).json(newPlan);
});

app.patch('/api/plans/:id/toggle', (req, res) => {
  const db = getDB();
  const plan = db.plans.find(p => p.id === req.params.id);
  if (!plan) return res.status(404).json({ error: "برنامه یافت نشد" });

  plan.completed = !plan.completed;
  saveDB(db);
  res.json(plan);
});

app.delete('/api/plans/:id', (req, res) => {
  const db = getDB();
  db.plans = db.plans.filter(p => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 5. Group Study & Sharing (گروه‌های مطالعه و همرسانی)
app.get('/api/groups', (req, res) => {
  const db = getDB();
  // enrich with member user objects and calculated stats
  const enriched = db.groups.map(group => {
    const memberUsers = db.users.filter(u => group.members.includes(u.id));
    
    // Calculate total study time for each member in this group
    const memberStats = memberUsers.map(user => {
      const userSessions = db.sessions.filter(s => s.userId === user.id);
      const totalMinutes = userSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
      
      // Calculate today's minutes
      const today = new Date().toISOString().slice(0, 10);
      const todayMinutes = userSessions
        .filter(s => s.timestamp.startsWith(today))
        .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

      // Latest active session
      const lastSession = userSessions.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        grade: user.grade,
        totalMinutes,
        todayMinutes,
        lastActive: lastSession ? lastSession.timestamp : null,
        lastSubject: lastSession ? lastSession.subjectName : null
      };
    });

    // Leaderboard sorted by today's study minutes, then total
    memberStats.sort((a, b) => b.todayMinutes - a.todayMinutes || b.totalMinutes - a.totalMinutes);

    return {
      ...group,
      membersCount: group.members.length,
      membersList: memberStats
    };
  });

  res.json(enriched);
});

app.post('/api/groups', (req, res) => {
  const db = getDB();
  const { name, description, createdById } = req.body;
  if (!name || !createdById) return res.status(400).json({ error: "نام گروه الزامی است" });

  const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
  const newGroup = {
    id: "group-" + Date.now(),
    name,
    code: randomCode,
    description: description || "گروه مطالعه و همرسانی برنامه‌ریزی درسی",
    createdById,
    members: [createdById],
    createdAt: new Date().toISOString()
  };

  db.groups.push(newGroup);
  saveDB(db);
  res.status(201).json(newGroup);
});

app.post('/api/groups/join', (req, res) => {
  const db = getDB();
  const { code, userId } = req.body;
  if (!code || !userId) return res.status(400).json({ error: "کد گروه و آیدی کاربر الزامی است" });

  const group = db.groups.find(g => g.code.trim().toUpperCase() === code.trim().toUpperCase());
  if (!group) {
    return res.status(404).json({ error: "گروهی با این کد یافت نشد" });
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    saveDB(db);
  }

  res.json({ success: true, group });
});

// 6. Encouraging / Motivational Quotes
app.get('/api/quotes/random', (req, res) => {
  const db = getDB();
  const quote = db.quotes[Math.floor(Math.random() * db.quotes.length)];
  res.json(quote);
});

app.get('/api/quotes', (req, res) => {
  const db = getDB();
  res.json(db.quotes);
});

// 7. Telegram Integration (ارسال مستقیم به تلگرام با Bot API)
app.post('/api/telegram/send', async (req, res) => {
  const { botToken, chatId, message, parseMode = 'HTML' } = req.body;

  if (!botToken || !chatId || !message) {
    return res.status(400).json({
      error: "توکن ربات تلگرام، شناسه چت و متن پیام الزامی است."
    });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
    
    // Use native fetch
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: message,
        parse_mode: parseMode
      })
    });

    const result = await response.json();

    if (!result.ok) {
      return res.status(400).json({
        error: result.description || "خطا در ارتباط با سرور تلگرام",
        details: result
      });
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error("Telegram API Error:", error);
    res.status(500).json({
      error: "خطای شبکه در اتصال به سرور تلگرام (ممکن است به دلیل فیلترینگ یا عدم دسترسی مستقیم سرور باشد). می‌توانید از دکمه اشتراک‌گذاری مستقیم تلگرام نیز استفاده کنید.",
      details: error.message
    });
  }
});

// Serve static frontend build if present
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[DarsKhoon Server] Running on http://localhost:${PORT}`);
});

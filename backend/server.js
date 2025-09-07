const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// مصفوفة مؤقتة لحفظ المستخدمين (بدلاً من قاعدة البيانات)
let users = [];

// API للتسجيل
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // التحقق من وجود المستخدم
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم مسبقاً' });
    }
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // إنشاء المستخدم الجديد
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({ 
      message: 'تم إنشاء الحساب بنجاح',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// API لتسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // البحث عن المستخدم
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'بيانات غير صحيحة' });
    }
    
    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'بيانات غير صحيحة' });
    }
    
    // إنشاء JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// عرض جميع المستخدمين (للاختبار)
app.get('/api/users', (req, res) => {
  const safeUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }));
  res.json(safeUsers);
});

// إضافة route للصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في API الخاص بالمنصة التعليمية',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      users: 'GET /api/users'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
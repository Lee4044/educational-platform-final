import { getDatabase } from '../config/db.js';

const getAllCourses = async (req, res) => {
  try {
    const db = await getDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }
    
    const [courses] = await db.execute(`
      SELECT 
        c.id, c.title, c.description, c.created_at, c.updated_at,
        COUNT(DISTINCT l.id) as lesson_count,
        COUNT(DISTINCT q.id) as quiz_count
      FROM courses c
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN quizzes q ON c.id = q.course_id
      GROUP BY c.id, c.title, c.description, c.created_at, c.updated_at
      ORDER BY c.created_at DESC
    `);
    
    if (!courses) {
      return res.status(200).json({
        success: true,
        data: { courses: [] }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: { courses }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    const [courses] = await db.execute(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const [lessons] = await db.execute(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index',
      [id]
    );
    
    return res.status(200).json({
      success: true,
      data: {
        course: courses[0],
        lessons
      }
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    const [lessons] = await db.execute(
      'SELECT * FROM lessons WHERE id = ?',
      [id]
    );
    
    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: { lesson: lessons[0] }
    });
  } catch (error) {
    console.error('Get lesson by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson',
      error: error.message
    });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const db = await getDatabase();
    
    const [progress] = await db.execute(
      'SELECT * FROM user_progress WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    
    return res.status(200).json({
      success: true,
      data: { progress: progress[0] || null }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    const [quizzes] = await db.execute(
      'SELECT * FROM quizzes WHERE id = ?',
      [id]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const [questions] = await db.execute(
      'SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index',
      [id]
    );
    
    return res.status(200).json({
      success: true,
      data: {
        quiz: quizzes[0],
        questions
      }
    });
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz',
      error: error.message
    });
  }
};

const submitQuizAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;
    const db = await getDatabase();
    
    // Calculate score logic here
    const score = 0; // Placeholder
    
    await db.execute(
      'INSERT INTO quiz_submissions (user_id, quiz_id, answers, score, submitted_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, id, JSON.stringify(answers), score]
    );
    
    return res.status(200).json({
      success: true,
      data: { score }
    });
  } catch (error) {
    console.error('Submit quiz answers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

export {
  getAllCourses,
  getCourseById,
  getLessonById,
  getUserProgress,
  getQuizById,
  submitQuizAnswers
};
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========== ТИПЫ ==========
interface SmokeLog {
  id: string;
  date: string;
  count: number;
  reason: string;
  notes?: string;
  createdAt: string;
}

interface Tip {
  id: string;
  category: string;
  text: string;
}

interface Database {
  smokeLogs: SmokeLog[];
  tips: Tip[];
}

// ========== РАБОТА С ФАЙЛОМ ==========
const DATA_FILE = path.join(__dirname, "../data.json");

// Начальные данные
const INITIAL_DATA: Database = {
  smokeLogs: [],
  tips: [],
};

// Загружаем или создаем данные
let db: Database = INITIAL_DATA;
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    db = JSON.parse(data) as Database;
    console.log(`✅ Loaded ${db.smokeLogs.length} records from ${DATA_FILE}`);
  } else {
    console.log(`📁 Creating new data file: ${DATA_FILE}`);
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  }
} catch (error) {
  console.error("Error loading data:", error);
}

// Функция сохранения
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log(`💾 Saved ${db.smokeLogs.length} records`);
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// ========== МАРШРУТЫ ==========

// Корневой маршрут
app.get("/", (req, res) => {
  res.json({
    message: "Smoke Tracker API",
    version: "1.0.0",
    records: db.smokeLogs.length,
    endpoints: [
      "GET    /smokeLogs",
      "GET    /smokeLogs/:id",
      "POST   /smokeLogs",
      "PUT    /smokeLogs/:id",
      "DELETE /smokeLogs/:id",
      "GET    /tips",
      "GET    /health",
    ],
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    records: db.smokeLogs.length,
  });
});

// GET /smokeLogs
app.get("/smokeLogs", (req, res) => {
  res.json(db.smokeLogs);
});

// GET /smokeLogs/:id
app.get("/smokeLogs/:id", (req, res) => {
  const log = db.smokeLogs.find((l) => l.id === req.params.id);
  if (!log) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(log);
});

// POST /smokeLogs
app.post("/smokeLogs", (req, res) => {
  const newLog: SmokeLog = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  db.smokeLogs.push(newLog);
  saveData();

  res.status(201).json(newLog);
});

// PUT /smokeLogs/:id
app.put("/smokeLogs/:id", (req, res) => {
  const index = db.smokeLogs.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  db.smokeLogs[index] = {
    ...db.smokeLogs[index],
    ...req.body,
    id: req.params.id,
  };

  saveData();

  res.json(db.smokeLogs[index]);
});

// DELETE /smokeLogs/:id
app.delete("/smokeLogs/:id", (req, res) => {
  const initialLength = db.smokeLogs.length;
  db.smokeLogs = db.smokeLogs.filter((l) => l.id !== req.params.id);

  if (db.smokeLogs.length === initialLength) {
    return res.status(404).json({ error: "Not found" });
  }

  saveData();

  res.status(204).send();
});

// GET /tips - возвращаем статические советы
app.get("/tips", (req, res) => {
  const staticTips: Tip[] = [
    {
      id: "1",
      category: "general",
      text: "Сделайте 10 глубоких вдохов для снятия стресса",
    },
    {
      id: "2",
      category: "general",
      text: "Выпейте стакан воды когда хочется курить",
    },
  ];

  res.json(staticTips);
});

// Сохранение при выходе
process.on("SIGINT", () => {
  console.log("\n💾 Saving data before exit...");
  saveData();
  process.exit(0);
});

// ========== ЗАПУСК ==========
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`\n🚀 Smoke Tracker Backend Started!`);
  console.log(`📍 Local:     http://localhost:${PORT}`);
  console.log(`📍 Health:    http://localhost:${PORT}/health`);
  console.log(`📍 SmokeLogs: http://localhost:${PORT}/smokeLogs`);
  console.log(`📍 Tips:      http://localhost:${PORT}/tips`);
  console.log(`📍 Data file: ${DATA_FILE}`);
  console.log(`📊 Records:   ${db.smokeLogs.length} smoke logs\n`);
});

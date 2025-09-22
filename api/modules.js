const modulesData = require('../data/modules.json');

function getAllModules(req, res) {
  const modules = modulesData.map(module => ({
    id: module.id,
    title: module.title,
    content: module.content,
    quiz: module.quiz.map(q => ({
      question: q.question,
      choices: q.choices
      // Don't send correct answer!
    }))
  }));
  res.json(modules);
}

function getModuleById(req, res) {
  const { id } = req.params;
  const module = modulesData.find(m => m.id === id);
  if (!module) {
    return res.status(404).json({ error: "Module not found" });
  }
  res.json({
    id: module.id,
    title: module.title,
    content: module.content,
    quiz: module.quiz.map(q => ({
      question: q.question,
      choices: q.choices
    }))
  });
}

module.exports = { getAllModules, getModuleById };

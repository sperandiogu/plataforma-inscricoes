const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: { form: true },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar submissões' });
  }
});

// Get submissions for a specific form
router.get('/form/:formId', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { formId: req.params.formId },
      include: { form: true },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar submissões do formulário' });
  }
});

// Create a new submission
router.post('/', async (req, res) => {
  try {
    const newSubmission = await prisma.submission.create({
      data: {
        formId: req.body.formId,
        data: JSON.stringify(req.body.data),
      },
    });
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar submissão' });
  }
});

module.exports = router;


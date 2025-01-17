const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('./middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all forms
router.get('/', authenticateToken, async (req, res) => {
  try {
    const forms = await prisma.form.findMany();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formulários' });
  }
});

// Get a specific form
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await prisma.form.findUnique({
      where: { id: req.params.id },
    });
    if (form) {
      res.json(form);
    } else {
      res.status(404).json({ error: 'Formulário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formulário' });
  }
});

// Create a new form
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newForm = await prisma.form.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        fields: JSON.stringify(req.body.fields),
      },
    });
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar formulário' });
  }
});

// Update a form
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedForm = await prisma.form.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        fields: JSON.stringify(req.body.fields),
      },
    });
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar formulário' });
  }
});

// Delete a form
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.form.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar formulário' });
  }
});

module.exports = router;


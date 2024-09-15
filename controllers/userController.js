require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.jwtSecret

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error: error.message });
  }
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        uuid: user.uuid,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ 
      message: "Login successful", 
      token,
      uuid: user.uuid 
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { uuid: req.params.id }
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { uuid: req.params.id }
    });
    if (deleted) {
      res.status(204).send("User deleted");
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
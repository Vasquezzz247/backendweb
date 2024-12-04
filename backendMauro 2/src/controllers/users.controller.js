const User = require("../models/user.model");

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        console.log("Buscando usuario con email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log("Buscando usuario con email:", email);
        res.status(500).json({ message: "Error al buscar el usuario", error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["admin", "doctor", "patient"].includes(role)) {
            return res.status(400).json({ message: "Rol inválido" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Rol actualizado exitosamente", user });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol", error: error.message });
    }
};

module.exports = { getUserByEmail, updateUserRole };

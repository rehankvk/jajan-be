import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { jwtDecode } from "jwt-decode"
import Users from "../models/users.js";
import { createUUID } from "../middleware/uuid.js";

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const user = await Users.findAll()
            if (!user || user.length === 0) {
                res.status(404).json({ message: "Gagal Mengambil Seluruh Data User (Not Found)", user })
            } else {
                res.status(200).json({ message: "Berhasil Mengambil Seluruh Data User", totalUser: user.length, user })
            }
        } catch (error) {
            console.error(error)
        }
    },
    getUserById: async (req, res) => {
        const id = req.params.id
        const user = await Users.findByPk(id)
        try {
            if (!user || user.length === 0) {
                res.status(404).json({ message: "Gagal Mengambil Data User (Not Found)" })
            } else {
                res.status(200).json({ message: `Berhasil Mengambil Data User Dengan Id = ${id}`, user })
            }
        } catch (error) {
            console.error(error)
        }
    },
    addUser: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const existingUser = await Users.findOne({
                where: {
                    email: email
                }
            });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already registered" });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = await Users.create({
                    id: createUUID(),
                    username: username,
                    email: email,
                    password: hashedPassword
                });

                const token = jwt.sign({ id: newUser.id, username: newUser.username }, 'HS256', { expiresIn: '3d' });

                res.status(200).json({
                    message: "User created successfully",
                    token,
                    newUser: newUser
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateUser: async (req, res) => {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Access token is missing or invalid.' });
        }

        try {
            const decoded = await jwtDecode(token)
            const id = decoded.id
            if (!decoded || decoded.id !== id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const user = await Users.findByPk(id)
            if (!user || user.length === 0) return res.status(404).json({ message: "User Not Found" });

            const { newUsername, newPassword } = req.body;
            const updatedValues = {
                username: newUsername || user.username,
                // email: newEmail || user.email,
                password: newPassword ? bcrypt.hashSync(newPassword, 10) : user.password,
                // id
            }
            const updateResult = await Users.update(updatedValues, { where: { id: id } })

            const newToken = jwt.sign({ id: user.id, username: updatedValues.username }, 'HS256', { expiresIn: '3d' });

            // Send success response with new token
            res.status(200).json({
                message: 'User information updated successfully',
                newToken: newToken,
                updateResult
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    deleteUser: async (req, res) => {
        const id = req.params.id;
        try {
            const user = await Users.findByPk(id)
            if (!user || user.length === 0) {
                res.status(404).json({ message: "Email Tidak Ditemukan" })
            } else {
                const user = await Users.destroy({
                    where: {
                        id: id
                    }
                })
                res.status(200).json({ message: "Berhasil Menghapus User", user })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body

        try {
            const user = await Users.findOne({
                where: {
                    email: email
                }
            })

            if (!user) {
                return res.status(404).json({ message: "Email Tidak Ditemukan. Silahkan Registrasi" })
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                return res.status(401).json({ message: "Email Atau Password Salah" })
            }

            const token = jwt.sign({ id: user.id, username: user.username }, 'HS256', { expiresIn: '3d' });
            res.status(200).json({
                message: "Login Successful.",
                token: token
            })
        } catch (error) {
            console.error(error)
        }
    },
    addAddress: async (req, res) => {
        const { address } = req.body

        try {
            const oldAddress = await Users
       } catch (error) {
            console.error(error)
        }

    }
};

export default userController;
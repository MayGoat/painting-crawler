import { Model, DataTypes } from 'sequelize';
import { sequelize } from './vangogh';
import express from 'express';

const router = express.Router();

router.post('/favorites', async (req, res) => {
    try {
        const favorite = await Favorite.create(req.body);
        res.status(201).json(favorite);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/favorites/:userId', async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: {
                userId: req.params.userId,
            },
        });
        res.status(200).json(favorites);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

export default router;

class Favorite extends Model {
    public id!: number;
    public userId!: number;
    public artworkId!: number;
    public favoriteTime!: Date;
}

Favorite.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            field:'user_id'
        },
        artworkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field:'artwork_id'
        },
        favoriteTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field:'favorite_time'
        },
    },
    {
        sequelize,
        modelName: 'Favorite',
        tableName: 'favorites',
        timestamps: false,
    }
);
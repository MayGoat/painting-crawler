import { Model, DataTypes } from 'sequelize';
import { sequelize } from './vangogh';
import express from 'express';


const userRouter = express.Router();

userRouter.post('/create', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
userRouter.get('/findone', async (req: any, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.query.account
      }
    });
    res.json(user);
  } catch (error) {
    console.error('Error finding user:', error);
  }
});


userRouter.post('/users', async (req, res) => {
  try {
    
    const { username, password, avatar, memberType, inviteCode } = req.body;

    
    const newUser = await User.create({
      username,
      password,
      avatar,
      memberType,
      inviteCode
    });

    
    res.status(201).json(newUser);
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to create user' });
  }
});



  class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public avatar!: string | null;
    public memberType!: string | null;
    public registrationTime!: Date;
    public inviteCode!: string | null;
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id', 
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'username', 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password', 
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatar', 
      },
      memberType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'member_type', 
      },
      registrationTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'registration_time', 
      },
      inviteCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'invite_code', 
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      timestamps: false,
    }
  );
  

  export default userRouter;

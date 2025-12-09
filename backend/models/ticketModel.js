import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Ticket = db.define(
  "ticket",
  {
    id_ticket: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "medium",
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

db.sync().then(() => console.log("Database synced model or table Ticket"));

export default Ticket;

import Ticket from "../models/ticketModel.js";

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    return res.status(200).json({
      status: "success",
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tickets",
    });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { title, priority } = req.body;

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Title wajib diisi",
      });
    }

    // Get user information
    const createdBy =
      req.user?.preferred_username || req.user?.email || "unknown";

    // Create new ticket
    const newTicket = {
      title: title.trim(),
      priority: priority || "medium",
      status: "open",
      createdBy,
      createdAt: new Date().toISOString(),
    };

    await Ticket.create(newTicket);

    return res.status(201).json({
      status: "success",
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create ticket",
    });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const username =
      req.user?.preferred_username || req.user?.email || "unknown";

    const myTickets = await Ticket.findAll({
      where: {
        createdBy: username,
      },
    });

    return res.status(200).json({
      status: "success",
      data: myTickets,
      count: myTickets.length,
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch user tickets",
    });
  }
};

export const getOpenTicketsCount = async (req, res) => {
  try {
    const openTicketsCount = await Ticket.count({
      where: { status: "open" },
    });
    return res.status(200).json({
      status: "success",
      count: openTicketsCount,
    });
  } catch (error) {
    console.error("Error fetching open tickets count:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch open tickets count",
    });
  }
};

export const getClosedTicketsCount = async (req, res) => {
  try {
    const closedTicketsCount = await Ticket.count({
      where: { status: "closed" },
    });
    return res.status(200).json({
      status: "success",
      count: closedTicketsCount,
    });
  } catch (error) {
    console.error("Error fetching closed tickets count:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch closed tickets count",
    });
  }
};

export const getPriorityTicketsCount = async (req, res) => {
  try {
    const highPriorityCount = await Ticket.count({
      where: { priority: "high" },
    });
    const mediumPriorityCount = await Ticket.count({
      where: { priority: "medium" },
    });
    const lowPriorityCount = await Ticket.count({
      where: { priority: "low" },
    });
    return res.status(200).json({
      status: "success",
      counts: {
        high: highPriorityCount,
        medium: mediumPriorityCount,
        low: lowPriorityCount,
      },
    });
  } catch (error) {
    console.error("Error fetching priority tickets count:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch priority tickets count",
    });
  }
};

export const getAllTicketsCount = async (req, res) => {
  try {
    const totalTicketsCount = await Ticket.count();
    return res.status(200).json({
      status: "success",
      count: totalTicketsCount,
    });
  } catch (error) {
    console.error("Error fetching total tickets count:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch total tickets count",
    });
  }
};

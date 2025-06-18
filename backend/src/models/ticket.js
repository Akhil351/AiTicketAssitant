import monogoose from "mongoose";

const ticketSchema = new monogoose.Schema(
  {
    title: String,
    description: String,
    status: { type: String, default: "TODO" },
    createdBy: { type: monogoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: {
      type: monogoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    priority: String,
    deadLine: Date,
    helpFulNotes: String,
    relatedSkills: [String],
  },
  {
    timestamps: true,
  }
);

const Ticket = monogoose.model("Ticket", ticketSchema);

export default Ticket;

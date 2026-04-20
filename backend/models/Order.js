import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Optional - allow guest bookings
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      // Optional - event may not be selected
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    packageSelected: {
      name: String,
      price: Number,
      features: [String],
    },
    themeSelected: {
      name: String,
      additionalPrice: { type: Number, default: 0 },
    },
    addonsSelected: [
      {
        name: String,
        price: Number,
      },
    ],
    eventDetails: {
      eventDate: {
        type: Date,
        // Optional - date may not be provided
      },
      eventTime: String,
      venue: String,
      guestCount: Number,
      specialRequests: String,
    },
    contactInfo: {
      name: String,
      email: String,
      phone: String,
      alternatePhone: String,
    },
    pricing: {
      packagePrice: { type: Number, default: 0 },
      themePrice: { type: Number, default: 0 },
      addonsPrice: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      discountCode: String,
      tax: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      // Optional - total may not be calculated initially
    },
    payment: {
      method: {
        type: String,
        enum: ["online", "cash", "partial"],
        default: "cash",
      },
      status: {
        type: String,
        enum: ["pending", "partial", "completed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      paidAmount: { type: Number, default: 0 },
      paidAt: Date,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    assignedTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notes: [
      {
        text: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date,
    },
    cancelReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  },
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const count = (await mongoose.model("Order").countDocuments()) + 1;
    this.orderNumber = `EA${year}${month}${count.toString().padStart(5, "0")}`;
  }
  next();
});

// Add status to history on status change
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
    });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

import prisma from "../../config/prismaClient.js";
import { sendNotification } from "../../controllers/notificationController.js";
import { getNotificationReceivers } from "./notificationResolver.js";





export const notifyCustomerCreated = async ({ customer, admin }) => {
  const receiverIds = await getNotificationReceivers(admin);

  // avoid sending notification to self
  const filteredReceivers = receiverIds.filter(id => id !== admin.id);

  await sendNotification({
    type: "CUSTOMER_CREATED",
    title: "New Customer Created",
    message: `${customer.customerName} has been added`,
    entityId: customer.id,
    entityType: "Customer",
    receiverIds: filteredReceivers,
    senderId: admin.id,
    metadata: {
      phone: customer.ContactNumber,
    },
  });
};


export const notifyCustomerFollowupTaken = async ({ customer, admin }) => {
  const receiverIds = await getNotificationReceivers(admin);

  // avoid sending notification to self
  const filteredReceivers = receiverIds.filter(id => id !== admin.id);

  await sendNotification({
    type: "CUSTOMER_FOLLOWUP_TAKEN",
    title: "Customer Follow-up Taken",
    message: `${customer.customerName} has been followed up`,
    entityId: customer.id,
    entityType: "Customer",
    receiverIds: filteredReceivers,
    senderId: admin.id,
    metadata: {
      phone: customer.ContactNumber,
    },
  });
};

export const notifyNewUserRequest = async ({ newUser}) => {
const admins = await prisma.admin.findMany({
  where: { role: "administrator" },
  select: { id: true },
});

const receiverIds = admins.map(a => a.id);

  
  console.log("Receivers for new user request notification:", receiverIds);

  await sendNotification({
    type: "NEW_USER_REQUEST",
    title: "New User Request",
    message: `${newUser.name} has requested to create an account`,
    entityId: newUser.id,
    entityType: "User",
    receiverIds: receiverIds,
    senderId: null,
    metadata: {
      phone: newUser.phone,
    },
  });
};
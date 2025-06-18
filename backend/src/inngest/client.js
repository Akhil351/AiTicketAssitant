import { Inngest } from "inngest";

// It initializes Inngest in your app and names your service "ticketing-system" so you can define and run background tasks under that name.
// Create a client to send and receive events
export const inngest = new Inngest({ id: "ticketing-system" });

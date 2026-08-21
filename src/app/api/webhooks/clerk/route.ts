import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { WebhookEvent } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import {
  deleteUserByClerkId,
  syncUserFromClerk,
} from "@/services/user.service";

export async function POST(req: NextRequest) {
  let event: WebhookEvent;

  try {
    event = await verifyWebhook(req);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } =
          event.data;

        const primaryEmail = email_addresses.find(
          (email) => email.id === event.data.primary_email_address_id
        )?.email_address;

        if (!primaryEmail) {
          return new Response("No primary email on user", { status: 400 });
        }

        await syncUserFromClerk({
          clerkId: id,
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        });
        break;
      }

      case "user.deleted": {
        if (event.data.id) {
          await deleteUserByClerkId(event.data.id);
        }
        break;
      }

      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Clerk webhook handler failed:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}

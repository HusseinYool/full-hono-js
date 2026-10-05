import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      async sendInvitationEmail(data) {
        console.log("[better-auth] organization invitation", {
          email: data.email,
          organization: data.organization.name,
          inviter: data.inviter.user.email,
          inviteLink: `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/accept-invitation/${data.id}`,
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;

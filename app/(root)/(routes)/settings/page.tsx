import { Separator } from "@/components/ui/separator"
import { checkSubscription } from "@/lib/subscription"
import { SubscriptionButton } from "@/components/subscription-button"
import { currentUser, auth } from "@clerk/nextjs/server";
import UserAvatar from "@/components/UserAvatar";
import { ModeToggle } from "@/components/theme-toggle";

const SettingsPage = async () => {

    const isPro = await checkSubscription();
    const user = await currentUser();

  return (
    <div className="h-full p-4 space-y-2">
        <h3 className="text-2xl font-medium">Settings</h3>
        <Separator/>
        <h4 className="text-lg">Account</h4>
        <div className="flex items-center gap-x-4 text-muted-foreground pt-2 pb-4 ml-2">
          <UserAvatar/>
          {user?.emailAddresses[0].emailAddress}
        </div>

        <h4 className="text-lg">Subscriptions</h4>
        <div className="text-muted-foreground text-sm">
            {isPro ? "You are subscribed to GrowNest Subscription.": "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />

        <h4 className="text-lg pt-4 pb-1">Theme</h4>
        <ModeToggle/>
    </div>
  )
}

export default SettingsPage
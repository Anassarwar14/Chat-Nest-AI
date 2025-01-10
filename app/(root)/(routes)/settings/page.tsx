import { Separator } from "@/components/ui/separator"
import { checkSubscription } from "@/lib/subscription"
import { SubscriptionButton } from "@/components/subscription-button"


const SettingsPage = async () => {

    const isPro = await checkSubscription();

  return (
    <div className="h-full p-4 space-y-2">
        <h3 className="text-2xl font-medium">Settings</h3>
        <Separator/>
        <h4 className="text-lg">Subscriptions</h4>
        <div className="text-muted-foreground text-sm">
            {isPro ? "You are subscribed to GrowNest Subscription.": "You are currently on a free plan."}
        </div>
            <SubscriptionButton isPro={isPro} />

    </div>
  )
}

export default SettingsPage
import { useStore } from "@/store";
import { Onboarding } from "@/components/Onboarding";
import { Dashboard } from "@/components/Dashboard";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const profile = useStore((s) => s.profile);
  return (
    <ThemeProvider>
      {profile ? <Dashboard /> : <Onboarding onDone={() => { /* state drives redirect */ }} />}
    </ThemeProvider>
  );
};

export default Index;

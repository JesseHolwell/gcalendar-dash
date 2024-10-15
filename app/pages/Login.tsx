import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <Card className="bg-white/10 border-none text-white">
      <CardHeader>
        <CardTitle>Sign in to access your Google Calendar and Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}

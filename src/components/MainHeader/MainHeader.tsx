import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LogOut, Sparkles } from "lucide-react";
import React from "react";

// Define props to receive mock user data
interface MainHeaderProps {
  user: { name: string | null };
}

export const MainHeader: React.FC<MainHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Interview Assistant</h1>
              <p className="text-sm text-muted-foreground">Crisp</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex">
              {user?.name || "Guest"}
            </Badge>
            {/* LogOut button kept as a placeholder since signOut function is removed */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")} // Removed authentication hook logic
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
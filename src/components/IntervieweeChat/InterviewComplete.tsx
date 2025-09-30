
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {useNavigate} from "react-router-dom";




export const InterviewComplete = () => {
    const navigate = useNavigate();
  

    const handleClick = () => {

       setTimeout(() => navigate("/"), 50); // Delay navigation
    }

    
  return (
    <div className="flex items-center justify-center h-[70vh] md:h-[65vh]">
      <Card className="border-0 p-8 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-primary mb-2">
          🎉 Interview Completed Successfully!
        </h2>
        <p className="text-muted-foreground text-center">
          You have answered all the questions. Thank you for participating in this interview.
        </p>
        <Button className="mt-4" onClick={handleClick}>
          Go to Home
        </Button>
      </Card>
    </div>
  );
};

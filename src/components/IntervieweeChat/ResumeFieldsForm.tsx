import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Fields = {
  name: string;
  email: string;
  phone: string;
  resumeVerdict: string;
};

interface ResumeFieldsFormProps {
  parsedFields: Partial<Fields>;
  onConfirm: (fields: Fields) => void;
}

export const ResumeFieldsForm: React.FC<ResumeFieldsFormProps> = ({
  parsedFields,
  onConfirm,
}) => {
  const [fields, setFields] = React.useState<Fields>({
    name: parsedFields.name || "",
    email: parsedFields.email || "",
    phone: parsedFields.phone || "",
    resumeVerdict: parsedFields.resumeVerdict || "",
  });

  const handleChange = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const isValid =
    fields.name.trim() !== "" &&
    fields.email.trim() !== "" &&
    fields.phone.trim() !== "";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Confirm Your Details</h3>
      <p className="text-sm text-muted-foreground">
        We parsed your resume. Please confirm or fill in missing details before starting the interview.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label>Name</Label>
          <Input
            value={fields.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Full Name"
          />
        </div>

        <div className="flex flex-col">
          <Label>Email</Label>
          <Input
            type="email"
            value={fields.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email Address"
          />
        </div>

        <div className="flex flex-col">
          <Label>Phone</Label>
          <Input
            type="tel"
            value={fields.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone Number"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={() => onConfirm(fields)}
          disabled={!isValid}
        >
          Confirm & Start Interview
        </Button>
      </div>
    </div>
  );
};

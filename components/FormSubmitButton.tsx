"use client";

import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
};

export default function FormSubmitButton({ children, pendingLabel, className = "btn-primary" }: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StepCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Should be editable!</CardDescription>
      </CardHeader>
    </Card>
  );
}

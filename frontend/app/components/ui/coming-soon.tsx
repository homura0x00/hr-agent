import { Card } from "@heroui/react";

/**
 * Placeholder for navigation destinations that exist in the shell but have no
 * implementation yet, so the sidebar never links to a 404.
 */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Card className="items-center gap-2 py-14 text-center">
      <Card.Title className="text-base">{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card>
  );
}

import type { Route } from "./+types/login";
import {ThemeSwitcher} from "~/components/theme-switcher";
import {Card, Link} from "@heroui/react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
          <Card className="w-[400px]">
      <Card.Header>
        <Card.Title>成为 Acme 创作者！</Card.Title>
        <Card.Description>
          前往 Acme 创作者中心立即注册，开始从粉丝与支持者处获得积分奖励。
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Link
          aria-label="前往 Acme 创作者中心（在新标签页打开）"
          href="https://heroui.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          创作者中心
          <Link.Icon aria-hidden="true" />
        </Link>
      </Card.Footer>
          </Card>
      </div>
    </div>
  );
}

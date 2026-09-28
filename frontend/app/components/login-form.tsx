import { Button, FieldError, Form, Input, Label, TextField, Card, cn } from "@heroui/react";
import React from "react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    // Convert FormData to a plain object. File entries keep their name rather
    // than stringifying to "[object File]".
    formData.forEach((value, key) => {
      data[key] = typeof value === "string" ? value : value.name;
    });
    alert(`表单提交数据：${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <Card.Header>
          <Card.Title>Login to your account</Card.Title>
          <Card.Description>Enter your email below to login to your account</Card.Description>
        </Card.Header>
        <Card.Content>
          <Form
            className="flex flex-col gap-4"
            render={(props) => <form {...props} data-custom="foo" />}
            onSubmit={onSubmit}
          >
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (value.length < 3) {
                  return "姓名至少需要 3 个字符";
                }
                return null;
              }}
            >
              <Label>Account</Label>
              <Input placeholder="Account" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              minLength={8}
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 8) {
                  return "密码至少需要 8 个字符";
                }
                if (!/[A-Z]/.test(value)) {
                  return "密码至少需要包含一个大写字母";
                }
                if (!/[0-9]/.test(value)) {
                  return "密码至少需要包含一个数字";
                }
                return null;
              }}
            >
              <Label>Password</Label>
              <Input placeholder="Your password" />
              <FieldError />
            </TextField>

            <div className="flex gap-2">
              <Button type="submit">提交</Button>
              <Button type="reset" variant="secondary">
                重置
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}

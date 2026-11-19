'use client';

import { Eye, EyeOff, Zap } from 'lucide-react';
import { Suspense, useActionState, useRef, useState } from 'react';
import { login } from '@/actions/auth-actions';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { DEMO_CREDENTIALS } from '@/lib/auth/demo-credentials';
import { cn } from '@/lib/cn';
import type { LoginFormState } from '@/types/auth';
import { RedirectToField } from './RedirectToField';

const INITIAL_STATE: LoginFormState = { error: null, username: '' };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, INITIAL_STATE);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const PasswordIcon = isPasswordVisible ? EyeOff : Eye;

  function loginWithDemoAccount() {
    const form = formRef.current;
    if (!form) {
      return;
    }
    const usernameInput = form.elements.namedItem('username');
    const passwordInput = form.elements.namedItem('password');
    if (
      !(usernameInput instanceof HTMLInputElement) ||
      !(passwordInput instanceof HTMLInputElement)
    ) {
      return;
    }
    usernameInput.value = DEMO_CREDENTIALS.username;
    passwordInput.value = DEMO_CREDENTIALS.password;
    form.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <RedirectToField />
      </Suspense>

      <Field label="Tên đăng nhập" htmlFor="username">
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          autoFocus
          required
          defaultValue={state.username}
          placeholder="Nhập tên đăng nhập"
          className={INPUT_CLASS_NAME}
        />
      </Field>

      <Field label="Mật khẩu" htmlFor="password">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="Nhập mật khẩu"
            className={cn(INPUT_CLASS_NAME, 'pr-11')}
          />
          <button
            type="button"
            aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-faint transition-colors hover:text-ink"
          >
            <PasswordIcon className="size-4" />
          </button>
        </div>
      </Field>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </Button>

      <div
        aria-hidden="true"
        className="flex items-center gap-3 text-xs text-ink-faint"
      >
        <span className="h-px flex-1 bg-line" />
        hoặc
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        variant="secondary"
        size="lg"
        disabled={isPending}
        onClick={loginWithDemoAccount}
      >
        <Zap className="size-4 text-brand" />
        Dùng thử với tài khoản demo
      </Button>

      <p className="text-center text-xs text-ink-soft">
        Tài khoản dùng thử:{' '}
        <strong className="font-mono text-ink">
          {DEMO_CREDENTIALS.username}
        </strong>{' '}
        /{' '}
        <strong className="font-mono text-ink">
          {DEMO_CREDENTIALS.password}
        </strong>
      </p>
    </form>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ErrorAlert } from '~/components/alerts';
import { Button } from '~/components/buttons';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/inputs';
import { useAuth } from '~/hooks/useAuth';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '..';

const OTPSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your verification code must be 6 characters.',
  }),
});

type OTPFormInputs = z.infer<typeof OTPSchema>;

interface OTPValidationFormProps {
  email: string;
}

const RESEND_TIMEOUT = 60;

const OTPValidationForm: React.FC<OTPValidationFormProps> = ({ email }) => {
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState<number>(RESEND_TIMEOUT);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const {
    confirmSignUp,
    resendSignUpCode,
    loading,
    error: confirmSignUpError,
  } = useAuth();
  const form = useForm<OTPFormInputs>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      pin: '',
    },
  });

  useEffect(() => {
    if (isCountingDown) {
      const interval = setInterval(() => {
        setCountdown((currentCountdown) => {
          const newTimeLeft = currentCountdown - 1;
          if (newTimeLeft < 0) {
            clearInterval(interval as unknown as number);
            return currentCountdown;
          } else {
            return newTimeLeft;
          }
        });
      }, 1000) as unknown as number;

      return () => clearInterval(interval as unknown as number);
    }
  }, [isCountingDown]);

  const handleResendCode = useCallback(async () => {
    await resendSignUpCode(email);
    setIsCountingDown(true);
    setCountdown(RESEND_TIMEOUT);
  }, [email, resendSignUpCode]);

  const onSubmit = async (values: OTPFormInputs) => {
    await confirmSignUp({ username: email, confirmationCode: values.pin });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        {confirmSignUpError && (
          <ErrorAlert
            error={confirmSignUpError.message}
            className="mb-4"
            ref={errorAlertRef}
          />
        )}
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-12 bg-white"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the verification code sent to {email}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-6">
          <Button
            onClick={handleResendCode}
            disabled={isCountingDown || loading}
            className="place-self-start bg-transparent p-0 text-gray-600 shadow-none"
            aria-live="polite"
            aria-disabled={isCountingDown || loading}
            aria-label={
              isCountingDown ? `Resend in ${countdown}s` : 'Resend code'
            }
          >
            {isCountingDown ? `Resend in ${countdown}s` : 'Resend code'}
          </Button>
          <Button
            type="submit"
            className="h-12 w-full bg-[#1D781D] text-white"
            disabled={loading}
            aria-live="polite"
            aria-label={loading ? 'Processing,please wait' : 'Verify and Sign Up'}
          >
            {loading ? (
              <>
                <span className="sr-only">Processing, please wait...</span>
                <div
                  role="status"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                ></div>
              </>
            ) : (
              'Verify and Sign Up'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OTPValidationForm;

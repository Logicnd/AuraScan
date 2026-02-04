'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.365 1.43c0 1.14-.434 2.2-1.273 3.06-.86.88-2.29 1.56-3.47 1.46-.12-1.11.38-2.28 1.2-3.15.86-.92 2.36-1.6 3.54-1.37ZM20.7 17.16c-.54 1.26-.8 1.82-1.5 2.93-.98 1.53-2.37 3.43-4.09 3.45-1.53.02-1.93-1-3.99-1-2.07 0-2.5.98-4.02 1.02-1.72.04-3.03-1.73-4.01-3.26-2.72-4.24-3.01-9.21-1.33-11.81 1.19-1.87 3.08-2.97 4.84-2.97 1.78 0 2.9 1.03 4.38 1.03 1.44 0 2.32-1.03 4.38-1.03 1.57 0 3.24.86 4.43 2.34-3.89 2.13-3.26 7.74.91 9.3Z"/>
  </svg>
);

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithApple, error } = useAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, displayName);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign up with Google');
    }
  };

  const handleAppleSignup = async () => {
    try {
      await signInWithApple();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign up with Apple');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email!</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
            Click the link to verify your account and get started!
          </p>
          <Button onClick={() => router.push('/auth/login')} className="bg-violet-600 hover:bg-violet-700">
            Go to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <motion.div
              className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-violet-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              AuraScan
            </motion.div>
          </Link>
          <p className="text-slate-400 mt-2">Create your account</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl">
          <CardContent className="p-6">
            {(errorMessage || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {errorMessage || error}
              </motion.div>
            )}

            {/* OAuth buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 flex items-center justify-center gap-3"
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              <Button
                type="button"
                onClick={handleAppleSignup}
                className="w-full bg-black hover:bg-black/90 text-white flex items-center justify-center gap-3"
              >
                <AppleIcon />
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400">or sign up with email</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-1">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-slate-400 hover:text-slate-300">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-slate-400 hover:text-slate-300">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}

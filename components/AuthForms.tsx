
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Phone, Smartphone, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState } from '../types';

interface AuthFormProps {
  type: 'LOGIN' | 'SIGNUP';
  onSuccess: () => void;
  onSwitchMode: (mode: ViewState) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess, onSwitchMode }) => {
  const { login, signup, resetPassword } = useAuth();
  const { t } = useLanguage();
  
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Verification & Reset State
  const [showVerification, setShowVerification] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'LOGIN') {
           if (!email || !password) throw new Error('Please fill in all fields');
           await login(email, password);
           onSuccess();
      } else {
           if (!name || !password) throw new Error('Please fill in all fields');
           if (signupMethod === 'email') {
               if (!email) throw new Error('Please enter your email');
               await signup(email, password, name);
               setShowVerification(true); // Show verification screen instead of success callback
           } else {
               throw new Error('Phone registration is currently disabled. Please use Email.');
           }
      }
    } catch (err: any) {
      console.error(err);
      
      let msg = 'An error occurred. Please try again.';
      
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setShowVerification(true);
        setLoading(false);
        return; // Exit early to avoid setting generic error
      }

      // Use Firebase error code if available, otherwise check message text
      const errorCode = err.code || '';
      const errorMessage = err.message || '';

      if (errorCode === 'auth/invalid-email' || errorMessage.includes('auth/invalid-email')) {
        msg = 'Invalid email address.';
      } else if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('auth/email-already-in-use')) {
        msg = 'User already exists. Sign in?';
        if (type === 'SIGNUP') {
            onSwitchMode('LOGIN');
        }
      } else if (
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/wrong-password' || 
        errorCode === 'auth/invalid-credential' ||
        errorMessage.includes('auth/user-not-found') || 
        errorMessage.includes('auth/wrong-password') || 
        errorMessage.includes('auth/invalid-credential')
      ) {
        msg = 'Email or Password Incorrect';
      } else if (errorCode === 'auth/weak-password' || errorMessage.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      } else if (errorMessage) {
        // Fallback to error message if meaningful
        msg = errorMessage.replace('Firebase: ', '').replace('Error (', '').replace(').', '');
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        setError('Please enter your email address');
        return;
    }
    setError('');
    setLoading(true);
    try {
        await resetPassword(email);
        setIsResetSent(true);
    } catch (err: any) {
        console.error(err);
        setError('Failed to send reset email. Please check the email address.');
    } finally {
        setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Verify your email</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We have sent you a verification email to <span className="font-bold text-gray-900 dark:text-white">{email}</span>. Please verify it and log in.
        </p>
        <button
          onClick={() => {
            setShowVerification(false);
            if (type === 'SIGNUP') {
                onSwitchMode('LOGIN');
            }
          }}
          className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (isResetMode) {
      return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            {isResetSent ? (
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Check your email</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        We sent you a password change link to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                    </p>
                    <button
                        onClick={() => {
                            setIsResetMode(false);
                            setIsResetSent(false);
                        }}
                        className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                        Sign In
                    </button>
                </div>
            ) : (
                <>
                    <button 
                        onClick={() => setIsResetMode(false)}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                    </button>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg border border-red-100 dark:border-red-900/50 flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailAddress')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Get Reset Link"
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
      );
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {type === 'LOGIN' ? t('welcomeBack') : t('createAccount')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {type === 'LOGIN' 
            ? t('enterCredentials') 
            : t('joinUs')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg border border-red-100 dark:border-red-900/50 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Signup Method Toggle */}
      {type === 'SIGNUP' && (
         <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            <button
               type="button"
               onClick={() => setSignupMethod('email')}
               className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  signupMethod === 'email'
                  ? 'bg-white dark:bg-gray-800 text-amber-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
               }`}
            >
               <Mail className="h-4 w-4" /> Email
            </button>
            <button
               type="button"
               onClick={() => setSignupMethod('phone')}
               className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  signupMethod === 'phone'
                  ? 'bg-white dark:bg-gray-800 text-amber-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
               }`}
            >
               <Smartphone className="h-4 w-4" /> Phone
            </button>
         </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'SIGNUP' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fullName')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}

        {(type === 'LOGIN' || signupMethod === 'email') && (
          <div className="animate-in fade-in duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailAddress')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>
        )}

        {type === 'SIGNUP' && signupMethod === 'phone' && (
          <div className="animate-in fade-in duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('phoneNumber')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <p className="text-xs text-amber-600 mt-1">Phone signup is currently limited. Please use email.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        {type === 'LOGIN' && (
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                >
                    Forgot password?
                </button>
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {type === 'LOGIN' ? t('signIn') : t('createAccount')}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {type === 'LOGIN' ? `${t('dontHaveAccount')} ` : `${t('alreadyHaveAccount')} `}
          <button
            onClick={() => {
                setError('');
                onSwitchMode(type === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
            }}
            className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            {type === 'LOGIN' ? t('signup') : t('login')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

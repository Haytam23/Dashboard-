import React, { useContext, useState, useEffect, useRef, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
// import { AuthContext } from './AuthContext';
import { useAuth } from './AuthContext';

import { useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, BriefcaseIcon } from 'lucide-react';

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'relative font-medium rounded-md transition-all duration-300 focus:outline-none flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700',
    outline: 'bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800',
  };

  const sizeClasses = 'px-6 py-3 text-sm';
  
  const loadingClasses = isLoading ? 'cursor-wait' : '';
  const disabledClasses = disabled ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${loadingClasses} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  className = '',
  label,
  error,
  icon,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-800/50 border border-slate-700 text-slate-100 rounded-md
            shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20
            placeholder-slate-500 transition-all duration-200
            ${icon ? 'pl-10' : 'pl-4'} py-3 pr-4
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Background Animation Component
const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.floor(Math.random() * 50) + 20}, ${
          Math.floor(Math.random() * 50) + 100
        }, ${Math.floor(Math.random() * 100) + 155}, ${Math.random() * 0.5 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas?.width!) this.x = 0;
        else if (this.x < 0) this.x = canvas?.width!;
        
        if (this.y > canvas?.height!) this.y = 0;
        else if (this.y < 0) this.y = canvas?.height!;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particlesArray: Particle[] = [];
    
    const initParticles = () => {
      particlesArray = [];
      const numberOfParticles = Math.min(
        Math.floor((canvas.width * canvas.height) / 15000),
        100
      );
      
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connectParticles = () => {
      const maxDistance = 150;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#050A30');
      gradient.addColorStop(1, '#000814');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      requestAnimationFrame(animate);
    };

    setCanvasDimensions();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      setCanvasDimensions();
      initParticles();
    });

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

// Main Login Page Component
interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
//   const { login } = useContext(AuthContext);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const nav = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       nav('/');
//     } catch (error) {
//       console.error('Login failed:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      await login(email, password);
      nav('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20 p-8 space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-full blur-md opacity-70 animate-pulse"></div>
                <div className="relative bg-slate-800 rounded-full p-3">
                  <BriefcaseIcon className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">ProjectHub</span>
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to access your projects and tasks
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<MailIcon className="h-5 w-5" />}
              />
              
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<LockIcon className="h-5 w-5" />}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
                  {error && <p className="text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full group"
              isLoading={isLoading}
            >
              <span>Sign in</span>
              <span className="absolute right-6 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
        
        <div className="h-1 w-3/4 mx-auto mt-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></div>
      </div>
    </div>
  );
}

export default LoginPage;
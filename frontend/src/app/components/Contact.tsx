import { motion } from 'motion/react';
import { Mail, Phone, Send, Github, Linkedin, Instagram, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4000';
const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() || '';
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const MAX_NAME_LENGTH = 80;
const MAX_PHONE_LENGTH = 32;
const MAX_MESSAGE_LENGTH = 3000;
const MIN_MESSAGE_LENGTH = 10;
const REQUEST_TIMEOUT_MS = 15000;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string | number;
      reset: (widgetId?: string | number) => void;
      remove?: (widgetId: string | number) => void;
    };
  }
}

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  formStartedAt: number;
};

function buildInitialFormData(): ContactFormData {
  return {
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '',
    formStartedAt: Date.now(),
  };
}

function validateFormData(data: ContactFormData): string | null {
  const name = data.name.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();
  const message = data.message.trim();

  if (!name || !email || !phone || !message) {
    return 'Please fill in all fields before sending.';
  }

  if (name.length > MAX_NAME_LENGTH) {
    return `Name is too long. Maximum ${MAX_NAME_LENGTH} characters.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }

  if (phone.length > MAX_PHONE_LENGTH) {
    return `Phone number is too long. Maximum ${MAX_PHONE_LENGTH} characters.`;
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (!/^[+\d().\-\s]{7,32}$/.test(phone) || phoneDigits.length < 7) {
    return 'Please enter a valid phone number.';
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return `Message is too short. Please use at least ${MIN_MESSAGE_LENGTH} characters.`;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return null;
}

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(buildInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      return;
    }

    let isUnmounted = false;

    const renderCaptcha = () => {
      if (isUnmounted) {
        return;
      }

      const turnstile = window.turnstile;
      const container = captchaContainerRef.current;
      if (!turnstile || !container || captchaWidgetIdRef.current !== null) {
        return;
      }

      captchaWidgetIdRef.current = turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token) => setCaptchaToken(token),
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => setCaptchaToken(''),
      });
      setIsCaptchaLoaded(true);
    };

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.turnstile) {
        renderCaptcha();
      } else {
        existingScript.addEventListener('load', renderCaptcha, { once: true });
      }
    } else {
      const script = document.createElement('script');
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', renderCaptcha, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      isUnmounted = true;
      const turnstile = window.turnstile;
      if (turnstile && captchaWidgetIdRef.current !== null && typeof turnstile.remove === 'function') {
        turnstile.remove(captchaWidgetIdRef.current);
      }
      captchaWidgetIdRef.current = null;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError = validateFormData(formData);
    if (validationError) {
      setSubmitStatus({ type: 'error', message: validationError });
      return;
    }

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setSubmitStatus({ type: 'error', message: 'Please complete the CAPTCHA challenge.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const endpoint = `${API_BASE_URL}/api/contact`;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        website: formData.website,
        formStartedAt: formData.formStartedAt,
        captchaToken,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        const backendMode = String(data.mode || '');
        const emailDelivered = Boolean(data.emailDelivered);
        setSubmitStatus({
          type: backendMode === 'local' || backendMode === 'fallback' || !emailDelivered ? 'error' : 'success',
          message:
            backendMode === 'local'
              ? 'Message saved locally only. Set RESEND_API_KEY in backend/.env and restart backend to enable email delivery.'
              : backendMode === 'fallback'
                ? 'Message saved, but email delivery failed temporarily. Please check backend logs and Resend configuration.'
                : data.message || 'Your message has been sent successfully! I\'ll get back to you soon.',
        });
        setFormData(buildInitialFormData());
        setCaptchaToken('');
        if (TURNSTILE_SITE_KEY && window.turnstile && captchaWidgetIdRef.current !== null) {
          window.turnstile.reset(captchaWidgetIdRef.current);
        }
      } else {
        if (response.status === 429) {
          const retryAfter = Number(data.retryAfter);
          const retryHint = Number.isFinite(retryAfter) && retryAfter > 0 ? ` Please retry in ${retryAfter} seconds.` : '';
          setSubmitStatus({
            type: 'error',
            message: (data.error || 'Too many requests.') + retryHint,
          });
        } else {
          setSubmitStatus({
            type: 'error',
            message: data.error || 'Failed to send message. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        setSubmitStatus({
          type: 'error',
          message: 'Request timed out. Please check your connection and try again.',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message. Please try again later.',
        });
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            Let's Work <span className="text-[#6366f1]">Together</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            If you're looking to build a web application or automate business workflows using AI, feel free to reach out.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl text-[#e2e8f0] mb-6">Get in Touch</h3>
              <p className="text-[#e2e8f0]/70 mb-8">
                Ready to transform your business with automation and modern web solutions? Let's discuss your project.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:laxmidharhuzaifa.2004@gmail.com"
                className="flex items-center gap-4 p-4 bg-[#1e293b] rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-[#6366f1]" />
                </div>
                <div>
                  <p className="text-[#e2e8f0]/60 text-sm">Email</p>
                  <p className="text-[#e2e8f0] group-hover:text-[#6366f1] transition-colors duration-300">
                    laxmidharhuzaifa.2004@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+916354955721"
                className="flex items-center gap-4 p-4 bg-[#1e293b] rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center group-hover:bg-[#22c55e]/20 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-[#22c55e]" />
                </div>
                <div>
                  <p className="text-[#e2e8f0]/60 text-sm">Phone</p>
                  <p className="text-[#e2e8f0] group-hover:text-[#22c55e] transition-colors duration-300">
                    +91 63549 55721
                  </p>
                </div>
              </a>

            </div>

            <div className="pt-6 border-t border-[#1e293b]">
              <p className="text-[#e2e8f0]/60 text-sm mb-4">Connect on social media</p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/LaxmidharHojefa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#1e293b] rounded-lg flex items-center justify-center text-[#e2e8f0] hover:text-[#6366f1] hover:bg-[#6366f1]/10 transition-all duration-300 border border-[#1e293b] hover:border-[#6366f1]/50"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/hojefa-laxmidhar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#1e293b] rounded-lg flex items-center justify-center text-[#e2e8f0] hover:text-[#6366f1] hover:bg-[#6366f1]/10 transition-all duration-300 border border-[#1e293b] hover:border-[#6366f1]/50"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/huzaifa452004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#1e293b] rounded-lg flex items-center justify-center text-[#e2e8f0] hover:text-[#e1306c] hover:bg-[#e1306c]/10 transition-all duration-300 border border-[#1e293b] hover:border-[#e1306c]/50"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-[#1e293b] p-6 sm:p-8 rounded-xl border border-[#1e293b]">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#e2e8f0] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={MAX_NAME_LENGTH}
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-[#0f172a] text-[#e2e8f0] rounded-lg border border-[#1e293b] focus:border-[#6366f1] focus:outline-none transition-colors duration-300"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#e2e8f0] mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-[#0f172a] text-[#e2e8f0] rounded-lg border border-[#1e293b] focus:border-[#6366f1] focus:outline-none transition-colors duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#e2e8f0] mb-2">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={MAX_PHONE_LENGTH}
                    pattern="[+\d().\-\s]{7,32}"
                    autoComplete="tel"
                    className="w-full px-4 py-3 bg-[#0f172a] text-[#e2e8f0] rounded-lg border border-[#1e293b] focus:border-[#6366f1] focus:outline-none transition-colors duration-300"
                    placeholder="+91 12345 67890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#e2e8f0] mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minLength={MIN_MESSAGE_LENGTH}
                    maxLength={MAX_MESSAGE_LENGTH}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0f172a] text-[#e2e8f0] rounded-lg border border-[#1e293b] focus:border-[#6366f1] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                  <p className="mt-2 text-xs text-[#e2e8f0]/60">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH} characters
                  </p>
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                {TURNSTILE_SITE_KEY ? (
                  <div>
                    <div ref={captchaContainerRef} className="min-h-[65px]" />
                    {!isCaptchaLoaded && (
                      <p className="mt-2 text-xs text-[#e2e8f0]/60">Loading CAPTCHA challenge...</p>
                    )}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-[#6366f1] hover:bg-[#5558e3] disabled:bg-[#6366f1]/60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {submitStatus.type && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-4 px-4 py-3 rounded-lg ${
                      submitStatus.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    <div className="flex items-center">
                      {submitStatus.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      <p className="text-sm">{submitStatus.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
